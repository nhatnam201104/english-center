import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Typography, Spinner } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useExamStore } from "../../stores/exam.store";
import {
  getAttemptState,
  loadListeningQuestions,
  loadReadingQuestions,
  saveAnswer,
  submitListening,
  submitReading,
  cancelAttempt,
} from "../../services/entranceExam.candidate.service";
import { useAntiCheat } from "../../components/client/exam/use-anti-cheat.hook";
import ListeningSection from "../../components/client/exam/listening/listening-section";
import ReadingSection from "../../components/client/exam/reading/reading-section";
import ExamResult from "../../components/client/exam/exam-result";

const ExamPage = () => {
  const { accessToken } = useParams<{ accessToken: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    phase,
    answers,
    listeningParts,
    readingParts,
    readingTimeMinutes,
    scoreResult,
    restoreState,
    setListeningData,
    setReadingData,
    setAnswer,
    finishListening,
    finishExam,
    cancelExam,
    reset,
  } = useExamStore();

  // Anti-cheat: warn on violations, cancel on 3rd
  const handleWarning = useCallback((count: number) => {
    if (count === 1) {
      toast.warning("⚠️ Cảnh báo 1/3: Không được chuyển tab hoặc thu nhỏ cửa sổ trong khi thi!");
    } else if (count === 2) {
      toast.warning("⚠️ Cảnh báo 2/3: Lần tiếp theo sẽ hủy bài thi!", { autoClose: 5000 });
    }
  }, []);

  const handleCancel = useCallback(async () => {
    if (!accessToken) return;
    try {
      await cancelAttempt(accessToken);
      cancelExam();
      toast.error("Bài thi đã bị hủy do vi phạm quy chế thi (3/3).");
    } catch {
      cancelExam();
    }
  }, [accessToken, cancelExam]);

  useAntiCheat({
    enabled: phase === "listening" || phase === "reading",
    onWarning: handleWarning,
    onCancel: handleCancel,
    maxViolations: 3,
  });

  // Load initial state
  useEffect(() => {
    if (!accessToken) return;

    const init = async () => {
      try {
        // Reset store first to clear any stale answers / parts from a previous attempt
        reset();
        const stateRes = await getAttemptState(accessToken);
        if (!stateRes.success || !stateRes.data) {
          setError(stateRes.message || "Không tìm thấy bài thi");
          return;
        }

        const state = stateRes.data;
        restoreState(state);

        // Load appropriate section based on status
        if (
          state.status === "REGISTERED" ||
          state.status === "PENDING" ||
          state.status === "LISTENING"
        ) {
          const lRes = await loadListeningQuestions(accessToken);
          if (lRes.success && lRes.data) {
            setListeningData(lRes.data.parts);
            // Restore saved answers
            lRes.data.parts.forEach((part) => {
              if (part.type === "single" && part.questions) {
                part.questions.forEach((q) => {
                  if (q.savedAnswer) setAnswer("L", q.index, q.savedAnswer);
                });
              }
              if (part.type === "group" && part.groups) {
                part.groups.forEach((g) => {
                  g.questions.forEach((q) => {
                    if (q.savedAnswer) setAnswer("L", q.index, q.savedAnswer);
                  });
                });
              }
            });
          }
        } else if (state.status === "LISTENING_DONE" || state.status === "READING") {
          const rRes = await loadReadingQuestions(accessToken);
          if (rRes.success && rRes.data) {
            setReadingData(rRes.data.parts, rRes.data.readingTimeMinutes);
            // Restore saved answers
            rRes.data.parts.forEach((part) => {
              if (part.type === "single" && part.questions) {
                part.questions.forEach((q) => {
                  if (q.savedAnswer) setAnswer("R", q.index, q.savedAnswer);
                });
              }
              if (part.type === "group" && part.groups) {
                part.groups.forEach((g) => {
                  g.questions.forEach((q) => {
                    if (q.savedAnswer) setAnswer("R", q.index, q.savedAnswer);
                  });
                });
              }
            });
          }
        }
        // COMPLETED / CANCELLED → phase set by restoreState, will render result or message
      } catch {
        setError("Đã xảy ra lỗi khi tải bài thi");
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // Handle answer selection  
  const handleAnswer = async (
    section: "L" | "R",
    questionIndex: number,
    answerId: number,
  ) => {
    if (!accessToken) return;
    setAnswer(section, questionIndex, answerId);

    // Save to server (fire-and-forget)
    saveAnswer(accessToken, {
      section: section === "L" ? "LISTENING" : "READING",
      questionIndex,
      answerId,
    }).catch(() => {
      // Silently fail — answer is saved locally, server sync may retry
    });
  };

  // Submit listening
  const handleSubmitListening = async () => {
    if (!accessToken) return;
    setSubmitting(true);
    try {
      const res = await submitListening(accessToken);
      if (res.success && res.data) {
        finishListening(res.data.totalListening);
        toast.success("Đã nộp phần Listening! Chuyển sang Reading...");

        // Load reading section
        const rRes = await loadReadingQuestions(accessToken);
        if (rRes.success && rRes.data) {
          setReadingData(rRes.data.parts, rRes.data.readingTimeMinutes);
        }
      } else {
        toast.error(res.message || "Nộp phần Listening thất bại");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi nộp phần Listening");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit reading (final)
  const handleSubmitReading = async () => {
    if (!accessToken) return;
    setSubmitting(true);
    try {
      const res = await submitReading(accessToken);
      if (res.success && res.data) {
        finishExam(res.data);
        toast.success("Đã hoàn thành bài thi!");
      } else {
        toast.error(res.message || "Nộp bài thi thất bại");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi nộp bài thi");
    } finally {
      setSubmitting(false);
    }
  };

  // Time up for reading
  const handleReadingTimeUp = async () => {
    toast.warning("Hết thời gian! Bài thi sẽ được tự động nộp.");
    await handleSubmitReading();
  };

  // ── Render ──

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 mx-auto" color="blue" />
          <Typography color="gray">Đang tải bài thi...</Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Typography variant="h5" color="red">
            {error}
          </Typography>
        </div>
      </div>
    );
  }

  if (phase === "cancelled") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 bg-white rounded-xl shadow-lg p-8">
          <Typography variant="h4" color="red" className="font-bold">
            Bài thi đã bị hủy
          </Typography>
          <Typography color="gray">
            Bài thi của bạn đã bị hủy do vi phạm quy chế thi.
          </Typography>
        </div>
      </div>
    );
  }

  if (phase === "completed" && scoreResult) {
    return <ExamResult result={scoreResult} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Listening phase */}
        {phase === "listening" && (
          <ListeningSection
            parts={listeningParts}
            answers={answers}
            onAnswer={(qi, ai) => handleAnswer("L", qi, ai)}
            onSubmit={handleSubmitListening}
            submitting={submitting}
          />
        )}

        {/* Transition: listening done, loading reading */}
        {phase === "listening_done" && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <Spinner className="h-12 w-12 mx-auto" color="green" />
              <Typography color="gray">
                Đang chuyển sang phần Reading...
              </Typography>
            </div>
          </div>
        )}

        {/* Reading phase */}
        {phase === "reading" && readingTimeMinutes && (
          <ReadingSection
            parts={readingParts}
            answers={answers}
            readingTimeMinutes={readingTimeMinutes}
            onAnswer={(qi, ai) => handleAnswer("R", qi, ai)}
            onSubmit={handleSubmitReading}
            onTimeUp={handleReadingTimeUp}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
};

export default ExamPage;
