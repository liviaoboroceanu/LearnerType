// src/data/quizData.js
export const quiz = [
  {
    question: "How do you usually remember new information best?",
    options: {
      A: { text: "I draw it or visualise it", style: "Visual" },
      B: { text: "I repeat it out loud", style: "Auditory" },
      C: { text: "I write it down or explain it in words", style: "Verbal" },
      D: { text: "I try it out hands-on", style: "Kinesthetic" }
    },
    laptopImageUrl: "/images/laptop/laptop-question1.png", // For desktop
    mobileImageUrl: "/images/mobile/mobile-question1.png"   // For mobile
  },
  {
    question: "When you're learning something new, what helps the most?",
    options: {
      A: { text: "Diagrams, mind maps, or videos", style: "Visual" },
      B: { text: "Hearing someone explain it", style: "Auditory" },
      C: { text: "Reading about it or writing summaries", style: "Verbal" },
      D: { text: "Doing an activity or practising it", style: "Kinesthetic" }
    },
    laptopImageUrl: "/images/laptop/laptop-question2.png",
    mobileImageUrl: "/images/mobile/mobile-question2.png"
  },
  {
    question: "What do your notes usually look like?",
    options: {
      A: { text: "Full of doodles, colours, or arrows", style: "Visual" },
      B: { text: "Barely there – I just listen", style: "Auditory" },
      C: { text: "Neatly written with lots of words", style: "Verbal" },
      D: { text: "Quick sketches or step-by-step instructions", style: "Kinesthetic" }
    },
    laptopImageUrl: "/images/laptop/laptop-question3.png",
    mobileImageUrl: "/images/mobile/mobile-question3.png"
  },
  {
    question: "If you're stuck trying to understand something, what do you do?",
    options: {
      A: { text: "Search for a visual or infographic", style: "Visual" },
      B: { text: "Ask someone to explain it out loud", "style": "Auditory" },
      C: { text: "Re-read the instructions or write them again", style: "Verbal" },
      D: { text: "Try it out or use a physical example", style: "Kinesthetic" }
    },
    laptopImageUrl: "/images/laptop/laptop-question4.png",
    mobileImageUrl: "/images/mobile/mobile-question4.png"
  },
  {
    question: "Which of these would you enjoy most in a study session?",
    options: {
      A: { text: "Watching a video tutorial", style: "Visual" },
      B: { text: "Listening to a podcast or lecture", style: "Auditory" },
      C: { text: "Reading a guide or discussing it", style: "Verbal" },
      D: { text: "Building something or doing a task", style: "Kinesthetic" }
    },
    laptopImageUrl: "/images/laptop/laptop-question5.png",
    mobileImageUrl: "/images/mobile/mobile-question5.png"
  },
  {
    question: "How do you prepare for a presentation or exam?",
    options: {
      A: { text: "Use flashcards or visual aids", style: "Visual" },
      B: { text: "Say things out loud or record yourself", style: "Auditory" },
      C: { text: "Write out your notes multiple times", style: "Verbal" },
      D: { text: "Practise by doing a mock test or walking around", style: "Kinesthetic" }
    },
    laptopImageUrl: "/images/laptop/laptop-question6.png",
    mobileImageUrl: "/images/mobile/mobile-question6.png"
  },
  {
    question: "What’s your go-to method for remembering things?",
    options: {
      A: { text: "Creating mental images or visual patterns", style: "Visual" },
      B: { text: "Using rhymes or repeating it aloud", style: "Auditory" },
      C: { text: "Making lists or written explanations", style: "Verbal" },
      D: { text: "Relating it to real-world actions", style: "Kinesthetic" }
    },
    laptopImageUrl: "/images/laptop/laptop-question7.png",
    mobileImageUrl: "/images/mobile/mobile-question7.png"
  },
  {
    question: "What kind of classroom activity do you enjoy most?",
    options: {
      A: { text: "Watching a demonstration", style: "Visual" },
      B: { text: "Group discussions or audio learning", style: "Auditory" },
      C: { text: "Reading assignments or writing tasks", style: "Verbal" },
      D: { text: "Interactive experiments or role-play", style: "Kinesthetic" }
    },
    laptopImageUrl: "/images/laptop/laptop-question8.png",
    mobileImageUrl: "/images/mobile/mobile-question8.png"
  },
  {
    question: "How do you prefer to learn a new skill (like cooking or tech tools)?",
    options: {
      A: { text: "Watching someone do it first", style: "Visual" },
      B: { text: "Listening to step-by-step audio instructions", style: "Auditory" },
      C: { text: "Reading a detailed guide", style: "Verbal" },
      D: { text: "Trying it yourself with trial and error", style: "Kinesthetic" }
    },
    laptopImageUrl: "/images/laptop/laptop-question9.png",
    mobileImageUrl: "/images/mobile/mobile-question9.png"
  },
  {
    question: "If you had to teach someone something, how would you do it?",
    options: {
      A: { text: "Show them with visuals or diagrams", style: "Visual" },
      B: { text: "Explain it clearly out loud", style: "Auditory" },
      C: { text: "Write down the steps or give them notes", style: "Verbal" },
      D: { text: "Walk them through the task while doing it together", style: "Kinesthetic" }
    },
    laptopImageUrl: "/images/laptop/laptop-question10.png",
    mobileImageUrl: "/images/mobile/mobile-question10.png"
  }
];

export const styleDescriptions = {
  Visual: {
    description: " You're a Visual Learner! You think in pictures. Diagrams, colour-coded notes, and mind maps help you absorb information faster. Try using videos, flashcards, or drawing things out when you study.",
    laptopImageUrl: "/images/laptop/laptop-result1.png",
    mobileImageUrl: "/images/mobile/mobile-result1.png"
  },
  Auditory: {
    description: " You're an Auditory Learner! You learn best through sound. Try listening to recordings, talking things through, or using rhythm and music to remember information. Podcasts are your best friend!",
    laptopImageUrl: "/images/laptop/laptop-result2.png",
    mobileImageUrl: "/images/mobile/mobile-result2.png"
  },
  Verbal: {
    description: " You're a Verbal Learner! Words are your superpower. You understand things better when reading or writing. Take notes, write summaries, and talk things out to make learning stick.",
    laptopImageUrl: "/images/laptop/laptop-result3.png",
    mobileImageUrl: "/images/mobile/mobile-result3.png"
  },
  Kinesthetic: {
    description: " You're a Kinesthetic Learner! You learn best by doing. Hands-on activities, real-life examples, and moving while learning (like walking around or acting things out) work great for you.",
    laptopImageUrl: "/images/laptop/laptop-result4.png",
    mobileImageUrl: "/images/mobile/mobile-result4.png"
  },
  Mixed: {
    description: " You're a Mixed Learner! You scored equally across styles. That means you benefit from a blend—videos, writing, discussion, and hands-on practice all work for you. Your flexibility is a strength!",
    laptopImageUrl: "", // No image specified for mixed in your current assets, leaving empty.
    mobileImageUrl: "" // No image specified for mixed in your current assets, leaving empty.
  }
};