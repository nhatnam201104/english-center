import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { WritingQuestion } from "./WritingQuestion";
import {
  loadWritingQuestions,
  saveWritingAnswer,
  submitWriting,
} from "../../../services/entranceExam.candidate.service";
import type { WritingQuestion as WritingQuestionType } from "../../../types/entrance-exam/writing.types";
import type { WritingSubmitResponse } from "../../../types/entrance-exam/writing.types";

interface WritingExamProps {
  accessToken: string;
  speakingScore?: number;
  onComplete: (results: WritingSubmitResponse) => void;
  onCancel: () => void;
}

export const WritingExam: React.FC<WritingExamProps> = ({
  accessToken,
  speakingScore,
  onComplete,
  onCancel,
}) => {
  const [questions, setQuestions] = useState<WritingQuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [savedQuestions, setSavedQuestions] = useState<Set<number>>(new Set());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [autoSaving, setAutoSaving] = useState<number | null>(null);

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
      const response = await loadWritingQuestions(accessToken);
      if (response.success && response.data) {
        setQuestions(response.data.questions);
        // Initialize answers with existing data
        const initialAnswers: Record<number, string> = {};
        response.data.questions.forEach((q) => {
          if (q.answer) {
            initialAnswers[q.questionIndex] = q.answer;
            setSavedQuestions((prev) => new Set([...prev, q.questionIndex]));
          }
        });
        setAnswers(initialAnswers);
        setError(null);
      } else {
        setError("Không thể tải câu hỏi Writing. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error loading Writing questions:", err);
      setError("Lỗi khi tải câu hỏi Writing.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSaveAnswer = async (questionIndex: number, answer: string): Promise<void> => {
    if (!answer.trim()) {
      alert("Vui lòng nhập câu trả lời");
      return;
    }

    setAutoSaving(questionIndex);
    try {
      const response = await saveWritingAnswer(accessToken, {
        questionIndex,
        answer,
      });
      if (response.success) {
        setSavedQuestions((prev) => new Set([...prev, questionIndex]));
      } else {
        alert("Lỗi khi lưu câu trả lời");
      }
    } catch (err) {
      console.error("Error saving Writing answer:", err);
      alert("Lỗi khi lưu câu trả lời");
    } finally {
      setAutoSaving(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setShowSubmitDialog(false);

    try {
      const response = await submitWriting(accessToken);
      if (response.success && response.data) {
        onComplete(response.data);
      } else {
        alert("Lỗi khi nộp bài. Vui lòng thử lại.");
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting Writing exam:", err);
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
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải câu hỏi Writing...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">TOEIC Writing</h1>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
                <span
                  className={`font-mono text-xl font-bold ${
                    timeRemaining < 300 ? "text-red-600" : "text-purple-600"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
              {speakingScore !== undefined && (
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                  Speaking: {speakingScore}/200
                </div>
              )}
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
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-save Indicator */}
      {autoSaving !== null && (
        <div className="fixed top-[140px] right-4 z-50">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border-2 border-yellow-300 rounded-lg shadow-lg">
            <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-yellow-800 font-medium text-sm">
              Đang lưu câu {autoSaving}...
            </span>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {questions.map((question, idx) => (
          <div key={question.questionIndex} id={`question-${idx}`}>
            <WritingQuestion
              question={question}
              answer={answers[question.questionIndex] || ""}
              onAnswerChange={(answer) =>
                handleAnswerChange(question.questionIndex, answer)
              }
              onSave={() =>
                handleSaveAnswer(
                  question.questionIndex,
                  answers[question.questionIndex] || ""
                )
              }
              saved={savedQuestions.has(question.questionIndex)}
            />
          </div>
        ))}
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
                    Bạn đã hoàn thành tất cả {questions.length} câu hỏi. Bạn có chắc
                    chắn muốn nộp bài?
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

      {/* Cancel Button */}
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