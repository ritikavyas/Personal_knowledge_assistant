# Testing Guide

This document provides comprehensive testing instructions for the Personal Knowledge Assistant.

## Manual Testing Checklist

### 1. Document Upload Tests

#### Test 1.1: Single PDF Upload
- [ ] Upload a single PDF file
- [ ] Verify document appears in sidebar
- [ ] Verify chunk count is displayed
- [ ] Verify upload timestamp is correct

#### Test 1.2: Single TXT Upload
- [ ] Upload a single TXT file
- [ ] Verify successful processing
- [ ] Verify document metadata

#### Test 1.3: Multiple Documents Upload
- [ ] Upload 2-3 documents at once
- [ ] Verify all documents are processed
- [ ] Verify document list shows all files

#### Test 1.4: Maximum Document Limit
- [ ] Try uploading 4 documents when limit is 3
- [ ] Verify error message appears
- [ ] Verify no documents are added

#### Test 1.5: Invalid File Type
- [ ] Try uploading a .docx or .jpg file
- [ ] Verify error message about file type
- [ ] Verify upload is rejected

#### Test 1.6: Empty Document
- [ ] Try uploading an empty PDF or TXT file
- [ ] Verify appropriate error handling
- [ ] System should handle gracefully

#### Test 1.7: Large Document
- [ ] Upload a document near the 10MB limit
- [ ] Verify processing time is reasonable
- [ ] Verify chunking works correctly

### 2. Chat Functionality Tests

#### Test 2.1: Basic Question
- [ ] Upload a document
- [ ] Ask a simple factual question
- [ ] Verify relevant answer is returned
- [ ] Verify response time is reasonable (<10 seconds)

#### Test 2.2: Question Without Documents
- [ ] Clear all documents
- [ ] Try asking a question
- [ ] Verify appropriate error/message about no documents

#### Test 2.3: Complex Question
- [ ] Ask a question requiring multiple chunks
- [ ] Verify comprehensive answer
- [ ] Verify multiple sources are cited

#### Test 2.4: Follow-up Questions
- [ ] Ask an initial question
- [ ] Ask a follow-up question
- [ ] Verify conversation history is maintained
- [ ] Verify context is preserved

#### Test 2.5: Question About Non-existent Topic
- [ ] Ask about something not in documents
- [ ] Verify AI acknowledges lack of information
- [ ] Should not hallucinate answers

#### Test 2.6: Multiple Documents Query
- [ ] Upload 2-3 different documents
- [ ] Ask a question spanning multiple docs
- [ ] Verify sources from different documents

### 3. Source Attribution Tests

#### Test 3.1: Source Display
- [ ] Send a message
- [ ] Verify sources are displayed
- [ ] Verify document names are shown
- [ ] Verify similarity scores are shown

#### Test 3.2: Source Expansion
- [ ] Click on a source
- [ ] Verify full text excerpt appears
- [ ] Click again to collapse
- [ ] Verify toggle works smoothly

#### Test 3.3: Multiple Sources
- [ ] Verify all relevant sources are shown
- [ ] Verify sources are ordered by relevance
- [ ] Verify max 3 sources per answer

#### Test 3.4: Source Highlighting
- [ ] Check that source text is properly formatted
- [ ] Verify text length is reasonable (not cut off awkwardly)
- [ ] Verify special characters are handled

### 4. Document Management Tests

#### Test 4.1: View Document List
- [ ] Upload multiple documents
- [ ] Verify all documents are listed
- [ ] Verify metadata is correct
- [ ] Verify document count is correct

#### Test 4.2: Delete Single Document
- [ ] Delete one document
- [ ] Verify document is removed from list
- [ ] Verify document count updates
- [ ] Verify can upload new documents

#### Test 4.3: Delete and Re-query
- [ ] Ask a question about a document
- [ ] Delete that document
- [ ] Ask the same question
- [ ] Verify AI no longer has that information

#### Test 4.4: Delete All Documents
- [ ] Delete all documents one by one
- [ ] Verify empty state is shown
- [ ] Verify upload button still works

### 5. UI/UX Tests

#### Test 5.1: Responsive Layout
- [ ] Resize browser window
- [ ] Verify layout adapts appropriately
- [ ] Verify sidebar remains functional
- [ ] Verify chat interface is usable

#### Test 5.2: Loading States
- [ ] Upload document - verify loading indicator
- [ ] Send message - verify loading indicator
- [ ] Verify disable state during loading

#### Test 5.3: Error Messages
- [ ] Trigger various errors
- [ ] Verify error messages are clear
- [ ] Verify error messages are user-friendly
- [ ] Verify errors don't crash the app

#### Test 5.4: Empty States
- [ ] Check empty document list message
- [ ] Check empty chat message
- [ ] Verify empty states are helpful

#### Test 5.5: Scroll Behavior
- [ ] Send multiple messages
- [ ] Verify auto-scroll to latest message
- [ ] Verify can scroll up to view history

### 6. Conversation History Tests

#### Test 6.1: Message Order
- [ ] Send several messages
- [ ] Verify chronological order
- [ ] Verify timestamps are correct

#### Test 6.2: User vs Assistant Messages
- [ ] Verify user messages are styled correctly
- [ ] Verify assistant messages are styled differently
- [ ] Verify alignment is correct

#### Test 6.3: Long Conversation
- [ ] Have a conversation with 10+ messages
- [ ] Verify all messages are preserved
- [ ] Verify context is maintained

#### Test 6.4: Page Refresh
- [ ] Send messages
- [ ] Refresh the page
- [ ] Note: Messages will be lost (in-memory storage)
- [ ] Verify app restarts cleanly

### 7. Edge Cases and Error Handling

#### Test 7.1: Network Error
- [ ] Stop the backend server
- [ ] Try to send a message
- [ ] Verify error message is shown
- [ ] Restart server and verify recovery

#### Test 7.2: Invalid API Key
- [ ] Set invalid OpenAI API key
- [ ] Try to upload documents
- [ ] Verify appropriate error message
- [ ] Check backend logs for details

#### Test 7.3: Concurrent Uploads
- [ ] Upload multiple documents simultaneously
- [ ] Verify all are processed correctly
- [ ] Verify no race conditions

#### Test 7.4: Special Characters
- [ ] Upload document with special characters
- [ ] Ask questions with special characters
- [ ] Verify proper handling

#### Test 7.5: Very Long Document
- [ ] Upload a document with 100+ pages
- [ ] Verify chunking works correctly
- [ ] Verify performance is acceptable

#### Test 7.6: Very Long Question
- [ ] Type a very long question (500+ words)
- [ ] Verify it's handled gracefully
- [ ] Verify response is relevant

### 8. Performance Tests

#### Test 8.1: Upload Performance
- [ ] Time document upload and processing
- [ ] Should be under 30 seconds for typical PDF
- [ ] Note: Depends on document size

#### Test 8.2: Query Performance
- [ ] Time query responses
- [ ] Should be under 10 seconds
- [ ] Note: Depends on OpenAI API response time

#### Test 8.3: Memory Usage
- [ ] Upload 3 large documents
- [ ] Check browser memory usage
- [ ] Check server memory usage
- [ ] Verify no memory leaks

### 9. API Tests (using curl or Postman)

#### Test 9.1: Health Check
```bash
curl http://localhost:3001/api/health
```
Expected: 200 OK with status message

#### Test 9.2: Upload API
```bash
curl -X POST http://localhost:3001/api/documents/upload \
  -F "documents=@test.pdf"
```
Expected: 200 OK with document info

#### Test 9.3: List Documents API
```bash
curl http://localhost:3001/api/documents
```
Expected: 200 OK with documents array

#### Test 9.4: Delete API
```bash
curl -X DELETE http://localhost:3001/api/documents/{id}
```
Expected: 200 OK with success message

#### Test 9.5: Chat API
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test question"}'
```
Expected: 200 OK with message and sources

### 10. RAG Implementation Tests

#### Test 10.1: Chunk Overlap
- [ ] Upload a document
- [ ] Verify chunks have proper overlap
- [ ] Check backend logs for chunk details

#### Test 10.2: Embedding Generation
- [ ] Upload a document
- [ ] Verify embeddings are created
- [ ] Check that embeddings have correct dimensions (1536 for text-embedding-3-small)

#### Test 10.3: Similarity Search
- [ ] Ask a specific question
- [ ] Verify most relevant chunks are retrieved
- [ ] Check similarity scores are reasonable (> 0.5 for good matches)

#### Test 10.4: Context Building
- [ ] Verify retrieved chunks are properly formatted
- [ ] Verify document names are included in context
- [ ] Check context length is appropriate

#### Test 10.5: GPT Integration
- [ ] Verify responses are coherent
- [ ] Verify responses cite sources
- [ ] Verify responses don't hallucinate

## Test Data Recommendations

### Good Test Documents:

1. **Technical Documentation** (PDF)
   - Clear structure
   - Factual information
   - Good for specific queries

2. **Research Paper** (PDF)
   - Complex content
   - Multiple sections
   - Tests chunking well

3. **Simple Text File** (TXT)
   - Plain text
   - Easy to verify
   - Fast processing

4. **Mixed Content Document** (PDF)
   - Text + some structure
   - Tests extraction
   - Real-world scenario

### Good Test Questions:

1. "What is the main topic of this document?"
2. "Summarize the key points."
3. "What methodology was used?"
4. "Compare the information from both documents."
5. "What are the requirements mentioned?"

## Automated Testing (Future Enhancement)

Consider implementing:
- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for user flows
- Performance benchmarks

## Bug Reporting Template

When you find a bug, document it:

```
**Bug Title:** [Short description]

**Steps to Reproduce:**
1. Step one
2. Step two
3. ...

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[If applicable]

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]

**Additional Context:**
[Any other relevant information]
```

## Success Criteria

The application passes testing if:
- ✅ All critical features work correctly
- ✅ No crashes or unhandled errors
- ✅ Reasonable performance
- ✅ Good user experience
- ✅ Clear error messages
- ✅ Proper source attribution
- ✅ Accurate RAG implementation

Happy Testing! 🧪
