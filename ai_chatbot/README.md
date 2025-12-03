# AI Chatbot Server

This is an AI-powered chatbot server that uses Google's Gemini model to answer questions about orders and consultations from the MongoDB database.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python server.py
```

The server will start on `http://localhost:8000`

## API Endpoint

- **POST /ask**: Send a question and get an AI-generated answer
  - Request body: `{ "question": "Your question here" }`
  - Response: `{ "answer": "AI generated answer" }`

## Features

- Natural language processing for queries
- Automatic MongoDB filter generation
- Searches across orders and consultations collections
- CORS enabled for cross-origin requests



