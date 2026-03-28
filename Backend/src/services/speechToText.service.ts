import speech from "@google-cloud/speech";
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";
import crypto from "crypto";
interface TranscriptionResult {
  transcript: string;
  confidence: number; // 0 → 1
}
/**
 * Initialize Google Cloud Speech-to-Text client
 */
const speechClient = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
if (!speechClient) {
  throw new Error("Failed to initialize Google Cloud Speech client");
}

/**
 * Initialize Google Cloud Storage client
 */
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucketName = process.env.GOOGLE_STORAGE_BUCKET || "englistcenter";
const bucket = storage.bucket(bucketName);

/**
 * Upload audio file to Google Cloud Storage
 * @param localPath - Path to local audio file
 * @returns GCS URI of the uploaded file
 */
const uploadAudioToGCS = async (localPath: string): Promise<string> => {
  try {
    // Generate unique filename
    const fileName = `audio/${crypto.randomUUID()}-${path.basename(localPath)}`;
    const file = bucket.file(fileName);

    // Upload file using save() method
    await file.save(fs.readFileSync(path.join(process.cwd(), localPath)), {
      contentType: "audio/webm",
    });

    console.log(`Audio uploaded to GCS: gs://${bucketName}/${fileName}`);
    return `gs://${bucketName}/${fileName}`;
  } catch (error) {
    console.error("Error uploading to GCS:", error);
    throw new Error("Failed to upload audio to GCS");
  }
};

/**
 * Delete audio file from Google Cloud Storage
 * @param gcsUri - GCS URI of the file (e.g., gs://bucket/file.webm)
 */
const deleteFromGCS = async (gcsUri: string): Promise<void> => {
  try {
    const fileName = gcsUri.replace(`gs://${bucketName}/`, "");
    const file = bucket.file(fileName);
    await file.delete();
    console.log(`Deleted from GCS: ${gcsUri}`);
  } catch (error) {
    console.error("Error deleting from GCS:", error);
    // Don't throw error if deletion fails - transcription already succeeded
  }
};

/**
 * Transcribe audio file to text
 * Uploads to GCS first to handle audio files of any length
 * @param audioPath - Path to audio file
 * @returns Transcript text
 */
export const transcribeAudio = async (
  audioPath: string,
): Promise<TranscriptionResult> => {
  let gcsUri: string | null = null;
  try {
    // Upload to GCS first
    gcsUri = await uploadAudioToGCS(audioPath);

    const request = {
      audio: {
        uri: gcsUri,
      },
      config: {
        encoding: "WEBM_OPUS" as const,
        languageCode: "en-US",
        alternativeLanguageCodes: ["en-GB", "vi-VN"],
        enableAutomaticPunctuation: true,
        model: "latest_long",
      },
    };

    // Use longRunningRecognize with GCS URI
    console.log(`Starting transcription for audio file: ${audioPath}`);
    const [operation] = await speechClient.longRunningRecognize(request);
    const [response] = await operation.promise();
    let fullTranscript = "";
    let confidences: number[] = [];

    const transcription = response.results
      ?.map((r: any) => {
        const alt = r.alternatives?.[0];
        if (alt) {
          fullTranscript += alt.transcript + "\n";
          confidences.push(alt.confidence);
        }
        return alt?.transcript;
      })
      .join("\n");

    const averageConfidence =
      confidences.length > 0
        ? confidences.reduce((sum, val) => sum + val, 0) / confidences.length
        : 0;

    return {
      transcript: transcription || "",
      confidence: averageConfidence,
    };
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error("Failed to transcribe audio");
  } finally {
    // Clean up: delete from GCS after transcription
    if (gcsUri) {
      await deleteFromGCS(gcsUri);
    }
  }
};

/**
 * Transcribe audio file with automatic language detection
 * Uploads to GCS first to handle audio files of any length
 * @param audioPath - Path to audio file
 * @returns Transcript text with detected language
 */
export const transcribeAudioAutoLanguage = async (
  audioPath: string,
): Promise<{ transcript: string; language: string }> => {
  let gcsUri: string | null = null;
  try {
    // Upload to GCS first
    gcsUri = await uploadAudioToGCS(audioPath);

    const request = {
      audio: {
        uri: gcsUri,
      },
      config: {
        encoding: "WEBM_OPUS" as const,
        sampleRateHertz: 48000,
        languageCode: "en-US",
        alternativeLanguageCodes: ["en-GB", "vi-VN"],
        enableAutomaticPunctuation: true,
        model: "latest_long",
        useEnhanced: true,
      },
    };

    // Use longRunningRecognize with GCS URI
    console.log(
      `Starting auto-language transcription for audio file: ${audioPath}`,
    );
    const [operation] = await speechClient.longRunningRecognize(request);
    const [response] = await operation.promise();

    // Get transcript and detected language
    const transcription = response.results
      ?.map((result: any) => result.alternatives?.[0]?.transcript)
      .join("\n");

    const language = response.results?.[0]?.languageCode || "en-US";

    return {
      transcript: transcription || "",
      language,
    };
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error("Failed to transcribe audio");
  } finally {
    // Clean up: delete from GCS after transcription
    if (gcsUri) {
      await deleteFromGCS(gcsUri);
    }
  }
};
