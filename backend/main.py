import os
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, validator
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database instance
db_client = None
database = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global db_client, database
    try:
        db_client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
        database = db_client[os.getenv("DATABASE_NAME", "quiz_app")]
        # Test connection
        await db_client.admin.command('ping')
        logger.info("Connected to MongoDB successfully")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise
    
    yield
    
    # Shutdown
    if db_client:
        db_client.close()
        logger.info("MongoDB connection closed")

# Create FastAPI app
app = FastAPI(
    title="Quiz Results API",
    description="API for processing quiz results and sending emails",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Pydantic models
class QuizAnswers(BaseModel):
    answers: List[str]
    email: EmailStr
    
    @validator('answers')
    def validate_answers(cls, v):
        if not v or len(v) == 0:
            raise ValueError('Answers cannot be empty')
        return v

class EmailUser(BaseModel):
    email: EmailStr
    learning_style: str
    quiz_date: datetime
    answers: List[str]

# Quiz logic and learning styles
LEARNING_STYLES = {
    "Visual": {
        "description": "You learn best through visual aids like diagrams, charts, and images. You prefer to see information presented in a visual format.",
        "characteristics": ["Strong visual memory", "Prefers charts and diagrams", "Benefits from color coding", "Thinks in pictures"]
    },
    "Auditory": {
        "description": "You learn best through listening and speaking. You prefer lectures, discussions, and verbal explanations.",
        "characteristics": ["Learns through listening", "Benefits from discussions", "Remembers spoken information well", "Enjoys group work"]
    },
    "Kinesthetic": {
        "description": "You learn best through hands-on activities and movement. You prefer practical experiences and physical involvement.",
        "characteristics": ["Learns by doing", "Prefers hands-on activities", "Benefits from movement", "Enjoys practical applications"]
    },
    "Reading/Writing": {
        "description": "You learn best through written words. You prefer reading, writing, and text-based information.",
        "characteristics": ["Prefers written information", "Enjoys reading and writing", "Takes detailed notes", "Learns well from textbooks"]
    },
    "Mixed": {
        "description": "You have a combination of learning styles and can adapt to different learning methods effectively.",
        "characteristics": ["Flexible learner", "Adapts to different methods", "Benefits from varied approaches", "Well-rounded learning preferences"]
    }
}

def calculate_learning_style(answers: List[str]) -> tuple[str, str]:
    """Calculate learning style based on quiz answers"""
    try:
        # Example scoring logic - adjust based on your actual quiz structure
        style_scores = {
            "Visual": 0,
            "Auditory": 0,
            "Kinesthetic": 0,
            "Reading/Writing": 0
        }
        
        # Simple scoring based on answer patterns
        # This is a simplified example - adjust based on your actual quiz logic
        for answer in answers:
            if answer in ['A', 'a']:
                style_scores["Visual"] += 1
            elif answer in ['B', 'b']:
                style_scores["Auditory"] += 1
            elif answer in ['C', 'c']:
                style_scores["Kinesthetic"] += 1
            elif answer in ['D', 'd']:
                style_scores["Reading/Writing"] += 1
        
        # Find the dominant style(s)
        max_score = max(style_scores.values())
        dominant_styles = [style for style, score in style_scores.items() if score == max_score]
        
        if len(dominant_styles) > 1:
            learning_style = "Mixed"
        else:
            learning_style = dominant_styles[0]
        
        description = LEARNING_STYLES[learning_style]["description"]
        
        return learning_style, description
        
    except Exception as e:
        logger.error(f"Error calculating learning style: {e}")
        return "Mixed", LEARNING_STYLES["Mixed"]["description"]

# Email template
EMAIL_TEMPLATE = EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>D'oh! Your Learning Style Results</title>
    <style>
        body { 
            font-family: 'Comic Sans MS', cursive, Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #87CEEB;
        }
        .header { 
            background: linear-gradient(135deg, #FFD700, #FFA500); 
            color: #333; 
            padding: 25px; 
            text-align: center; 
            border-radius: 15px 15px 0 0; 
            border: 3px solid #FF6347;
        }
        .content { 
            background-color: #FFFACD; 
            padding: 30px; 
            border-radius: 0 0 15px 15px; 
            border: 3px solid #FF6347;
            border-top: none;
        }
        .result-box { 
            background: linear-gradient(135deg, #FFD700, #FFFF99); 
            padding: 20px; 
            border-radius: 15px; 
            margin: 20px 0; 
            border: 3px solid #FF6347;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .characteristics { 
            background: linear-gradient(135deg, #98FB98, #90EE90); 
            padding: 20px; 
            border-radius: 15px; 
            margin: 15px 0; 
            border: 2px solid #32CD32;
        }
        .footer { 
            text-align: center; 
            margin-top: 30px; 
            font-size: 12px; 
            color: #666; 
            background-color: #FFB6C1;
            padding: 15px;
            border-radius: 10px;
            border: 2px solid #FF69B4;
        }
        ul { padding-left: 20px; }
        li { margin: 8px 0; }
        .homer-quote {
            font-style: italic;
            color: #FF4500;
            text-align: center;
            font-size: 14px;
            margin: 15px 0;
        }
        .simpson-title {
            font-size: 28px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            margin: 0;
        }
        .donut-emoji {
            font-size: 24px;
            animation: spin 3s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="simpson-title">🍩 D'oh! Your Learning Style Results 🍩</h1>
        <p>Brought to you by Springfield Elementary!</p>
    </div>
    <div class="content">
        <p>Howdy-diddly-do, neighbor!</p>
        
        <div class="homer-quote">
            "The only thing I know is that I know nothing... and that makes me smarter than Homer!" - Lisa Simpson
        </div>
        
        <p>Thank you for taking our <strong>Springfield Learning Style Quiz</strong>! Even Bart would be proud of these results:</p>
       
        <div class="result-box">
            <h2>🎯 Your Learning Style: {{ learning_style }}</h2>
            <p><strong>Marge's Description:</strong> {{ description }}</p>
            <div class="homer-quote">
                "Mmm... learning..." - Homer Simpson
            </div>
        </div>
       
        {% if characteristics %}
        <div class="characteristics">
            <h3>🧠 Key Characteristics (According to Professor Frink):</h3>
            <ul>
            {% for characteristic in characteristics %}
                <li>{{ characteristic }} <em>*adjusts glasses scientifically*</em></li>
            {% endfor %}
            </ul>
        </div>
        {% endif %}
       
        <p><strong>Principal Skinner says</strong> understanding your learning style can help you:</p>
        <ul>
            <li>🍎 Choose study methods that work better than Bart's "I didn't do it" approach</li>
            <li>⚡ Improve your learning efficiency (faster than Milhouse reading comic books)</li>
            <li>💪 Better understand your strengths (like Lisa's saxophone skills)</li>
            <li>🏫 Adapt to different learning environments (from Springfield Elementary to Shelbyville)</li>
        </ul>
       
        <div class="homer-quote">
            "Kids, you tried your best and you failed miserably. The lesson is: never try." - Homer Simpson<br>
            <small>(But we disagree with Homer on this one! Keep learning!)</small>
        </div>
       
        <p>We hope these insights help you on your learning journey! Remember, as Marge always says: "As long as you tried your best, that's all that matters!"</p>
       
        <div class="footer">
            <p><span class="donut-emoji">🍩</span> This email was sent because you completed our Springfield Learning Style Quiz! <span class="donut-emoji">🍩</span></p>
            <p>Quiz completed on: {{ quiz_date }}</p>
            <p><em>"That's a wrap!" - Krusty the Clown</em></p>
        </div>
    </div>
</body>
</html>
"""

async def send_email(to_email: str, learning_style: str, description: str, quiz_date: datetime):
    """Send email with quiz results"""
    try:
        # Create email content
        template = Template(EMAIL_TEMPLATE)
        characteristics = LEARNING_STYLES.get(learning_style, {}).get("characteristics", [])
        
        html_content = template.render(
            learning_style=learning_style,
            description=description,
            characteristics=characteristics,
            quiz_date=quiz_date.strftime("%B %d, %Y at %I:%M %p")
        )
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Your Learning Style: {learning_style}"
        msg['From'] = os.getenv("EMAIL_FROM")
        msg['To'] = to_email
        
        # Add HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Send email
        await aiosmtplib.send(
            msg,
            hostname=os.getenv("EMAIL_HOST"),
            port=int(os.getenv("EMAIL_PORT", 587)),
            start_tls=True,
            username=os.getenv("EMAIL_USERNAME"),
            password=os.getenv("EMAIL_PASSWORD"),
        )
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False

async def save_user_email(email_data: EmailUser):
    """Save user email and quiz data to MongoDB"""
    try:
        print('saving user email:', email_data.email)
        collection = database.email_only_users
        
        # Check if email already exists
        existing_user = await collection.find_one({"email": email_data.email})
        
        if existing_user:
            # Update existing user with new quiz data
            await collection.update_one(
                {"email": email_data.email},
                {
                    "$set": {
                        "learning_style": email_data.learning_style,
                        "last_quiz_date": email_data.quiz_date,
                        "updated_at": datetime.utcnow()
                    },
                    "$push": {
                        "quiz_history": {
                            "learning_style": email_data.learning_style,
                            "answers": email_data.answers,
                            "quiz_date": email_data.quiz_date
                        }
                    }
                }
            )
            logger.info(f"Updated existing user: {email_data.email}")
        else:
            # Create new user
            user_doc = {
                "email": email_data.email,
                "learning_style": email_data.learning_style,
                "first_quiz_date": email_data.quiz_date,
                "last_quiz_date": email_data.quiz_date,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "quiz_history": [{
                    "learning_style": email_data.learning_style,
                    "answers": email_data.answers,
                    "quiz_date": email_data.quiz_date
                }]
            }
            
            await collection.insert_one(user_doc)
            logger.info(f"Created new user: {email_data.email}")
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to save user email {email_data.email}: {e}")
        return False

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Quiz Results API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        # Test database connection
        await db_client.admin.command('ping')
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/quiz-results")
async def process_quiz_results(quiz_data: QuizAnswers, background_tasks: BackgroundTasks):
    """Process quiz results and send email"""
    try:
        # Calculate learning style
        learning_style, description = calculate_learning_style(quiz_data.answers)
        
        # Create user data
        quiz_date = datetime.utcnow()
        email_user = EmailUser(
            email=quiz_data.email,
            learning_style=learning_style,
            quiz_date=quiz_date,
            answers=quiz_data.answers
        )
        
        # Save to database (in background)
        background_tasks.add_task(save_user_email, email_user)
        
        # Send email (in background)
        background_tasks.add_task(
            send_email, 
            quiz_data.email, 
            learning_style, 
            description, 
            quiz_date
        )
        
        # Return success response (don't include the actual results)
        return JSONResponse(
            status_code=200,
            content={
                "message": "Quiz completed successfully! Check your email for detailed results.",
                "email_sent": True,
                "timestamp": quiz_date.isoformat()
            }
        )
        
    except Exception as e:
        logger.error(f"Error processing quiz results: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your quiz results. Please try again later."
        )

@app.get("/api/stats")
async def get_quiz_stats():
    """Get basic quiz statistics (optional endpoint)"""
    try:
        collection = database.email_only_users
        
        total_users = await collection.count_documents({})
        
        # Get learning style distribution
        pipeline = [
            {"$group": {"_id": "$learning_style", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        
        style_distribution = []
        async for doc in collection.aggregate(pipeline):
            style_distribution.append({
                "learning_style": doc["_id"],
                "count": doc["count"]
            })
        
        return {
            "total_users": total_users,
            "learning_style_distribution": style_distribution,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving statistics")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )