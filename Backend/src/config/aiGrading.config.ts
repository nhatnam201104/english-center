import Groq from 'groq-sdk';

// Initialize Groq AI client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// Get the model (default to llama3-70b-8192)
export const model = groq;

// Model name to use
export const MODEL_NAME = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// Timeout for AI grading requests (in milliseconds)
export const AI_TIMEOUT = parseInt(process.env.AI_TIMEOUT_MS || '30000');
