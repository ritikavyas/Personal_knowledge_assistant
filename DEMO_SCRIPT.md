# Demo Script for 5-Minute Video

This script will help you create a compelling 5-minute demo video for the Personal Knowledge Assistant project.

## Video Structure (5 minutes)

### Introduction (30 seconds)
- **Show:** Title slide with project name
- **Say:** "Hi, I'm [Your Name], and I'm going to show you my Personal Knowledge Assistant - a RAG-based application that lets you chat with your documents."
- **Say:** "This is a full-stack TypeScript application using React, Node.js, Express, and OpenAI's API."

### Project Overview (30 seconds)
- **Show:** README.md or project structure
- **Say:** "The system uses Retrieval-Augmented Generation to answer questions about uploaded documents."
- **Say:** "It supports PDF and TXT files, chunks them intelligently with overlap, generates embeddings, and retrieves relevant context for the AI."

### Live Demo - Part 1: Document Upload (1 minute)
- **Show:** Application interface
- **Do:** Click "Upload Documents" button
- **Say:** "I can upload up to 3 documents. Let me upload a couple of PDFs about [topic]."
- **Do:** Select and upload 2 documents
- **Show:** Documents appearing in the sidebar with chunk counts
- **Say:** "The system automatically extracts text, splits it into 500-token chunks with 100-token overlap, and generates embeddings for each chunk."

### Live Demo - Part 2: Asking Questions (1.5 minutes)
- **Show:** Chat interface
- **Say:** "Now I can ask questions about my documents."

- **Do:** Type first question: "What is the main topic of these documents?"
- **Show:** AI response appearing
- **Say:** "The system retrieves the most relevant chunks using cosine similarity and sends them to GPT as context."

- **Show:** Sources section below the answer
- **Do:** Click on a source to expand it
- **Say:** "Each answer shows which documents it came from, with similarity scores and the exact text used."

- **Do:** Ask another question that references specific details
- **Show:** How the system handles follow-up questions

### Technical Deep Dive (1.5 minutes)
- **Show:** Split screen or quick code walkthrough
- **Say:** "Let me quickly show you the technical implementation."

**Backend (30 seconds):**
- **Show:** `backend/src/services/ragService.ts`
- **Say:** "The RAG service handles embedding generation, similarity search, and GPT completion."
- **Show:** `backend/src/services/documentProcessor.ts`
- **Say:** "Document processor extracts text and implements chunking with overlap strategy."

**Frontend (30 seconds):**
- **Show:** `frontend/src/components/ChatInterface.tsx`
- **Say:** "The React frontend is fully typed with TypeScript, featuring real-time chat updates."
- **Show:** `frontend/src/components/MessageBubble.tsx`
- **Say:** "Source highlighting and expandable references are built into each message."

**Features (30 seconds):**
- **Show:** Application in action
- **Say:** "Key features include:"
  - ✅ In-memory vector storage
  - ✅ Smart chunking with overlap
  - ✅ Cosine similarity search
  - ✅ Source attribution
  - ✅ Conversation history
  - ✅ Document management

### Bonus Features Demo (30 seconds)
- **Do:** Upload a third document
- **Say:** "I implemented all the bonus features."
- **Show:** Chunk overlap in action (explain how it maintains context)
- **Show:** Source text highlighting
- **Do:** Compare information across multiple documents
- **Do:** Delete a document
- **Say:** "Document deletion immediately affects the knowledge base."

### Closing (30 seconds)
- **Show:** GitHub repository
- **Say:** "The complete source code is on GitHub with comprehensive documentation."
- **Show:** README.md
- **Say:** "The README includes setup instructions, architecture details, API documentation, and future improvements."
- **Say:** "This project demonstrates RAG implementation, full-stack development, TypeScript proficiency, and production-ready code practices."
- **Show:** Your contact info or GitHub profile
- **Say:** "Thanks for watching! Feel free to check out the repo and try it yourself."

## Recording Tips

### Before Recording:
1. ✅ Have 2-3 interesting documents ready to upload
2. ✅ Prepare 3-4 good questions in advance
3. ✅ Clear browser cache and restart servers for clean demo
4. ✅ Close unnecessary browser tabs
5. ✅ Set browser zoom to 100%
6. ✅ Test your microphone
7. ✅ Have code snippets ready to show

### During Recording:
- Speak clearly and at a moderate pace
- Show confidence in your code
- Explain the "why" behind technical decisions
- Keep energy high and engaging
- Don't worry about minor stumbles - they show authenticity

### Screen Recording Settings:
- Record at 1920x1080 or 1280x720
- 30 fps is sufficient
- Include system audio if showing features
- Use a simple, clean background

### Editing Tips:
- Add title cards for each section
- Speed up slow parts (like uploads) by 1.5-2x
- Add captions or text overlays for key features
- Include code snippets as overlays when explaining
- Background music (optional, keep it subtle)

## Questions to Prepare Answers For

Have these documents ready and know interesting questions to ask:

**Example 1 - Research Papers:**
- "What methodology was used in this study?"
- "What were the main findings?"
- "Compare the results from both papers."

**Example 2 - Technical Documentation:**
- "How do I configure this feature?"
- "What are the system requirements?"
- "Explain the installation process."

**Example 3 - Mixed Documents:**
- "Which document mentions [specific term]?"
- "Summarize the key points from all documents."
- "What are the differences between these approaches?"

## Sample Opening Script

"Hello! I'm [Your Name], and welcome to my Personal Knowledge Assistant demo. 

Over the next 5 minutes, I'll show you a production-ready RAG application that I built from scratch using React, TypeScript, Node.js, and OpenAI's API.

This isn't just a simple chatbot - it's a sophisticated document analysis system that extracts text, generates embeddings, performs semantic search, and provides AI-powered answers with full source attribution.

Let's dive in!"

## Sample Closing Script

"As you've seen, this project demonstrates:
- Advanced RAG implementation with embeddings and similarity search
- Full-stack TypeScript development
- Clean, maintainable code architecture
- Production-ready error handling and user experience

The complete source code is available on GitHub with comprehensive documentation, setup instructions, and a detailed README.

This project was built to showcase real-world AI application development skills and full-stack engineering capabilities.

Thanks for watching, and feel free to check out the repository!"

---

Good luck with your demo! Remember: confidence, clarity, and enthusiasm will make your video stand out. 🚀
