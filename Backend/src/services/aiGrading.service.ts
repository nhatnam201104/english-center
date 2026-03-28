import { model, MODEL_NAME, AI_TIMEOUT } from "../config/aiGrading.config";
import { transcribeAudio } from "./speechToText.service";

/**
 * Score interface for AI grading result
 */
interface ScoreResult {
  score: number; // 0-5 for each criterion
  feedback: string;
}

interface SpeakingScore {
  pronunciation: ScoreResult;
  grammar: ScoreResult;
  vocabulary: ScoreResult;
  fluency: ScoreResult;
  taskAchievement: ScoreResult;
  totalScore: number; // 0-25 (sum of 5 criteria)
}

interface WritingScore {
  grammar: ScoreResult;
  vocabulary: ScoreResult;
  organization: ScoreResult;
  taskFulfillment: ScoreResult;
  toneAndStyle: ScoreResult;
  totalScore: number; // 0-25 (sum of 5 criteria)
}

/**
 * Prompt template for Speaking grading
 */
const SPEAKING_PROMPT = `
You are a strict TOEIC Speaking examiner.

Grade the response using the following criteria (0–5 each):
Pronunciation: Estimate based on transcription clarity, word accuracy, and possible misrecognitions. Be conservative when unsure.
Scoring guidelines:
- 5: Excellent, near-native, minimal errors
- 4: Good, minor errors
- 3: Fair, noticeable errors but understandable
- 2: Limited, frequent errors
- 1: Poor, very difficult to understand
- 0: No response or irrelevant

Pronunciation scoring rule:
- High confidence (>0.9): likely clear pronunciation
- Medium (0.7–0.9): minor pronunciation issues
- Low (<0.7): unclear pronunciation, possible errors


Important rules:
- Base your evaluation ONLY on the transcript.
- Do NOT assume missing information.
- Pronunciation must be estimated conservatively from transcript clarity.
- Be strict and consistent.



Question: {question}
Type: {partType}
{passage_context}
{image_context}

Transcript: {transcript}
Confidence score: {confidence}

Return ONLY valid JSON in this format:
{
  "pronunciation": { "score": number, "feedback": string },
  "grammar": { "score": number, "feedback": string },
  "vocabulary": { "score": number, "feedback": string },
  "fluency": { "score": number, "feedback": string },
  "taskAchievement": { "score": number, "feedback": string }
}

Be concise and constructive in feedback. Return ONLY valid JSON.
`;

/**
 * Prompt template for Writing grading
 */
const WRITING_PROMPT = `
You are a TOEIC Writing examiner. Grade the following writing response based on TOEIC criteria.

TOEIC Writing Criteria (0-5 points each):
1. Grammar: Sentence structure, verb tenses, word forms, punctuation
2. Vocabulary: Range, accuracy, appropriateness, spelling
3. Organization: Paragraph structure, logical flow, coherence
4. Task Fulfillment: Completeness, relevance, content accuracy
5. Tone & Style: Professionalism, formality, register

Question: {question}
Type: {partType}
{passage_context}
{image_context}

Response: {answer}

Provide a JSON response with this exact format:
{
  "grammar": { "score": number (0-5), "feedback": string },
  "vocabulary": { "score": number (0-5), "feedback": string },
  "organization": { "score": number (0-5), "feedback": string },
  "taskFulfillment": { "score": number (0-5), "feedback": string },
  "toneAndStyle": { "score": number (0-5), "feedback": string }
}

Be concise and constructive in feedback. Return ONLY valid JSON.
- Penalize grammatical errors strictly.
- Reward clear structure and coherence.
- Do not give high scores unless the response fully answers the question.
`;

/**
 * Grade a single Speaking answer
 * Integrates Google Cloud Speech-to-Text for transcription
 */
export const gradeSpeakingAnswer = async (
  question: string,
  partType: string,
  audioPath: string, // Audio path for speech-to-text
  passage?: string, // Optional passage context for Parts 5-7, 8-10
): Promise<SpeakingScore> => {
  try {
    let transcript: string;
    let confidence: number;
    console.log("Starting to grade speaking answer for question:", question);

    // Build context for Parts 5-7, 8-10
    let passageContext = "";
    let imageContext = "";

    if (passage) {
      passageContext = `\nContext/Passage:\n${passage}`;
    }

    // Check if question contains image URL
    if (
      question.includes("http") ||
      question.includes(".jpg") ||
      question.includes(".png")
    ) {
      imageContext =
        "\nNote: The question includes an image. Consider the image content in your evaluation.";
    }

    // Transcribe audio if path is provided
    if (audioPath) {
      try {
        const transcriptionResult = await transcribeAudio(audioPath);
        transcript = transcriptionResult.transcript;
        confidence = transcriptionResult.confidence;
      } catch (transcribeError) {
        console.error("Failed to transcribe audio:", transcribeError);
        // Use placeholder if transcription fails
        return getDefaultSpeakingScore();
      }
    } else {
      // Use placeholder if no audio provided
      return getDefaultSpeakingScore();
    }
    if (!transcript || transcript.trim() === "") {
      return getDefaultSpeakingScore();
    }
    const prompt = SPEAKING_PROMPT.replace("{question}", question)
      .replace("{partType}", partType)
      .replace("{transcript}", transcript)
      .replace("{passage_context}", passageContext)
      .replace("{image_context}", imageContext)
      .replace("{confidence}", confidence.toFixed(2));

    console.log("Grading speaking answer with prompt:", prompt);
    const result = await Promise.race<any>([
      model.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a TOEIC Speaking examiner. Provide only valid JSON responses.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: MODEL_NAME,
        temperature: 0.2,
        max_tokens: 1024,
        response_format: { type: "json_object" },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI timeout")), AI_TIMEOUT),
      ),
    ]);

    const text = result.choices[0]?.message?.content || "";

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const scores = JSON.parse(jsonMatch[0]);
    const totalScore =
      scores.pronunciation.score +
      scores.grammar.score +
      scores.vocabulary.score +
      scores.fluency.score +
      scores.taskAchievement.score;

    return {
      pronunciation: scores.pronunciation,
      grammar: scores.grammar,
      vocabulary: scores.vocabulary,
      fluency: scores.fluency,
      taskAchievement: scores.taskAchievement,
      totalScore,
    };
  } catch (error) {
    console.error("Error grading speaking answer:", error);
    // Return default scores on error
    return getDefaultSpeakingScore();
  }
};

/**
 * Grade a single Writing answer
 */
export const gradeWritingAnswer = async (
  question: string,
  partType: string,
  answer: string,
  picture: string = "", // Optional picture description
  passage?: string, // Optional passage context for Parts 5-7, 8-10
): Promise<WritingScore> => {
  try {
    // Build context for Parts 5-7, 8-10
    let passageContext = "";
    let imageContext = "";
    if (answer.trim() === "") {
      // If answer is empty, return default score without calling AI
      return getDefaultWritingScore();
    }
    if (passage) {
      passageContext = `\nContext/Passage:\n${passage}`;
    }

    if (picture) {
      imageContext = `\nNote: The question includes the following image description: ${picture}`;
    }

    const prompt = WRITING_PROMPT.replace("{question}", question)
      .replace("{partType}", partType)
      .replace("{answer}", answer)
      .replace("{passage_context}", passageContext)
      .replace("{image_context}", imageContext);

    const result = await Promise.race<any>([
      model.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a TOEIC Writing examiner. Provide only valid JSON responses.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: MODEL_NAME,
        temperature: 0.7,
        max_tokens: 1024,
        response_format: { type: "json_object" },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI timeout")), AI_TIMEOUT),
      ),
    ]);
    console.log("Grading writing answer with prompt:", prompt);
    console.log("AI response for writing grading:", result);
    const text = result.choices[0]?.message?.content || "";

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const scores = JSON.parse(jsonMatch[0]);
    const totalScore =
      scores.grammar.score +
      scores.vocabulary.score +
      scores.organization.score +
      scores.taskFulfillment.score +
      scores.toneAndStyle.score;

    return {
      grammar: scores.grammar,
      vocabulary: scores.vocabulary,
      organization: scores.organization,
      taskFulfillment: scores.taskFulfillment,
      toneAndStyle: scores.toneAndStyle,
      totalScore,
    };
  } catch (error) {
    console.error("Error grading writing answer:", error);
    // Return default scores on error
    return getDefaultWritingScore();
  }
};

export const calculateSpeakingScaledScore = (
  rawScore: number,
  totalQuestions: number,
): number => {
  const maxRawScore = totalQuestions * 25; // Each question max 25 points (5 criteria × 5)
  const percentage = rawScore / maxRawScore;
  const scaledScore = Math.round(percentage * 190) + 10; // 10-200 range
  return Math.min(Math.max(scaledScore, 10), 200);
};

/**
 * Calculate scaled Writing score (0-40 → 10-200)
 */
export const calculateWritingScaledScore = (
  rawScore: number,
  totalQuestions: number,
): number => {
  const maxRawScore = totalQuestions * 25; // Each question max 25 points (5 criteria × 5)
  const percentage = rawScore / maxRawScore;
  const scaledScore = Math.round(percentage * 190) + 10; // 10-200 range
  return Math.min(Math.max(scaledScore, 10), 200);
};

/**
 * Get default Speaking score (for error cases)
 */
function getDefaultSpeakingScore(): SpeakingScore {
  return {
    pronunciation: { score: 0, feedback: "Unable to assess pronunciation" },
    grammar: { score: 0, feedback: "Unable to assess grammar" },
    vocabulary: { score: 0, feedback: "Unable to assess vocabulary" },
    fluency: { score: 0, feedback: "Unable to assess fluency" },
    taskAchievement: {
      score: 0,
      feedback: "Unable to assess task achievement",
    },
    totalScore: 0,
  };
}

/**
 * Get default Writing score (for error cases)
 */
function getDefaultWritingScore(): WritingScore {
  return {
    grammar: { score: 0, feedback: "Unable to assess grammar" },
    vocabulary: { score: 0, feedback: "Unable to assess vocabulary" },
    organization: { score: 0, feedback: "Unable to assess organization" },
    taskFulfillment: {
      score: 0,
      feedback: "Unable to assess task fulfillment",
    },
    toneAndStyle: { score: 0, feedback: "Unable to assess tone and style" },
    totalScore: 0,
  };
}
