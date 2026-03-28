import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertTriangle, ImageIcon, FileText } from "lucide-react";
import { SpeakingQuestion } from "./SpeakingQuestion";
import {
  loadSpeakingQuestions,
  saveSpeakingAnswer,
  submitSpeaking,
} from "../../../services/entranceExam.candidate.service";
import type { SpeakingQuestion as SpeakingQuestionType } from "../../../types/entrance-exam/speaking.types";
import type { SpeakingSubmitResponse } from "../../../types/entrance-exam/speaking.types";

interface SpeakingExamProps {
  accessToken: string;
  onComplete: (results: SpeakingSubmitResponse) => void;
  onCancel: () => void;
}

export const SpeakingExam: React.FC<SpeakingExamProps> = ({
  accessToken,
  onComplete,
  onCancel,
}) => {
  const [questions, setQuestions] = useState<SpeakingQuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes
  const [savedQuestions, setSavedQuestions] = useState<Set<number>>(new Set());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    loadQuestions();
  }, [accessToken]);

  useEffect(() => {
    if (timeRemaining > 0 && !submitting) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining, submitting]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await loadSpeakingQuestions(accessToken);
      if (response.success && response.data) {
       
        setQuestions(response.data.questions);
        const initialSaved = new Set<number>();
        response.data.questions.forEach((q) => {
          if (q.audioRecord) {
            initialSaved.add(q.questionIndex);
          }
        });
        setSavedQuestions(initialSaved);
        setError(null);
      } else {
        setError("Không thể tải câu hỏi Speaking. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error loading Speaking questions:", err);
      setError("Lỗi khi tải câu hỏi Speaking.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnswer = async (questionIndex: number, audioBlob: Blob): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("questionIndex", questionIndex.toString());
      
      // Create File from Blob with valid filename
      const audioFile = new File([audioBlob], `recording-${questionIndex}.webm`, {
        type: 'audio/webm'
      });
      formData.append("audio", audioFile);
    
      const response = await saveSpeakingAnswer(accessToken, formData);
      if (response.success) {
        setSavedQuestions((prev) => new Set([...prev, questionIndex]));
      } else {
        alert("Lỗi khi lưu câu trả lời");
      }
    } catch (err) {
      console.error("Error saving Speaking answer:", err);
      alert("Lỗi khi lưu câu trả lời");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setShowSubmitDialog(false);

    try {
      const response = await submitSpeaking(accessToken);
      if (response.success && response.data) {
        onComplete(response.data);
      } else {
        alert("Lỗi khi nộp bài. Vui lòng thử lại.");
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting Speaking exam:", err);
      alert("Lỗi khi nộp bài. Vui lòng thử lại.");
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getUnansweredCount = () => {
    return questions.filter((q) => !savedQuestions.has(q.questionIndex)).length;
  };

  const scrollToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải câu hỏi Speaking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg border-2 border-red-200">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">Lỗi</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadQuestions}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const unansweredCount = getUnansweredCount();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">TOEIC Speaking</h1>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <span
                  className={`font-mono text-xl font-bold ${
                    timeRemaining < 300 ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">
                  {savedQuestions.size}
                </span>
                /{questions.length} câu đã trả lời
              </div>
              <button
                onClick={() => setShowSubmitDialog(true)}
                disabled={submitting}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {submitting ? "Đang nộp..." : "Nộp bài"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-white border-b sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {questions.map((question, idx) => (
              <button
                key={question.questionIndex}
                onClick={() => scrollToQuestion(idx)}
                className={`flex-shrink-0 w-12 h-12 rounded-lg font-semibold transition-colors ${
                  savedQuestions.has(question.questionIndex)
                    ? "bg-green-600 text-white"
                    : currentQuestionIndex === idx
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {questions.map((question, idx) => {
          // Check if this is the first question in a group (5 or 8)
          const isFirstInGroup = question.questionIndex === 5 || question.questionIndex === 8;
          
          return (
            <div key={question.questionIndex} id={`question-${idx}`}>
              {/* Show shared passage/images for first question of each group */}
              {isFirstInGroup && question.questionIndex >= 5 && question.questionIndex <= 10 && (
                <>
                  {/* Images (for questions 8, 9, 10) */}
                  {question.images && question.images.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3 text-gray-600">
                        <ImageIcon className="w-5 h-5" />
                        <span className="font-medium">Hình ảnh (Câu 8, 9, 10):</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {question.images.map((img: string, imgIdx: number) => (
                          <div key={imgIdx} className="relative">
                            <img
                              src={img}
                              alt={`Hình ${imgIdx + 1}`}
                              className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                              {imgIdx + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Passage */}
                  {question.passage && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3 text-gray-600">
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">
                          Đoạn văn {question.questionIndex <= 7 ? '(Câu 5, 6, 7)' : '(Câu 8, 9, 10)'}:
                        </span>
                      </div>
                      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {question.passage}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <SpeakingQuestion
                question={question}
                onSave={(audioBlob) => handleSaveAnswer(question.questionIndex, audioBlob)}
                saved={savedQuestions.has(question.questionIndex)}
              />
            </div>
          );
        })}
      </div>

      {/* Submit Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {unansweredCount === 0 ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                )}
                <h2 className="text-xl font-bold text-gray-800">
                  Xác nhận nộp bài
                </h2>
              </div>

              <div className="mb-6">
                {unansweredCount === 0 ? (
                  <p className="text-gray-700">
                    Bạn đã hoàn thành tất cả {questions.length} câu hỏi. Bạn có chắc chắn muốn nộp bài?
                  </p>
                ) : (
                  <div>
                    <p className="text-gray-700 mb-2">
                      Bạn chưa trả lời{" "}
                      <span className="font-bold text-yellow-600">
                        {unansweredCount}
                      </span>{" "}
                      câu hỏi.
                    </p>
                    <p className="text-gray-700">
                      Bạn có chắc chắn muốn nộp bài ngay?
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitDialog(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {submitting ? "Đang nộp..." : "Nộp bài"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Dialog */}
      {showSubmitDialog && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Hủy thi
          </button>
        </div>
      )}
    </div>
  );
};