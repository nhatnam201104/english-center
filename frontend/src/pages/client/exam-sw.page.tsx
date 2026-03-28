import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Spinner } from "@material-tailwind/react";
import { toast } from "react-toastify";
import {
  startSpeakingAttempt,
  getAttemptState,
  cancelAttempt,
} from "../../services/entranceExam.candidate.service";
import { SpeakingExam } from "../../components/client/exam/SpeakingExam";
import { WritingExam } from "../../components/client/exam/WritingExam";
import { useAntiCheat } from "../../components/client/exam/use-anti-cheat.hook";

type Step = "speaking" | "writing" | "complete" | "error";

const ExamSWPage = () => {
  const { accessToken } = useParams<{ accessToken: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("speaking");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial state
  useEffect(() => {
    if (!accessToken) {
      setError("Không tìm thấy mã truy cập");
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const stateRes = await getAttemptState(accessToken);
        if (!stateRes.success || !stateRes.data) {
          setError(stateRes.message || "Không tìm thấy bài thi");
          setLoading(false);
          return;
        }

        const state = stateRes.data;
        
        // Determine current step based on exam type and status
        if (state.type !== "SPEAKING_WRITING") {
          setError("Loại bài thi không hợp lệ");
          setLoading(false);
          return;
        }

        if (state.status === "COMPLETED") {
          // Load results from store or API
          setStep("complete");
          // TODO: Load results from backend
        } else if (state.status === "WRITING_DONE" || state.status === "WRITING") {
          setStep("writing");
        } else {
          // REGISTERED, PENDING, LISTENING → start speaking
          // Start speaking attempt first
          const startRes = await startSpeakingAttempt(accessToken);
          if (!startRes.success || !startRes.data) {
            setError("Không thể bắt đầu phần Speaking");
          } else {
            setStep("speaking");
          }
        }
      } catch (err) {
        console.error("Error loading SW exam:", err);
        setError("Đã xảy ra lỗi khi tải bài thi");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [accessToken]);

  const handleSpeakingComplete = () => {
    // Skip showing SpeakingResult, go directly to Writing
    setStep("writing");
  };

  const handleWritingComplete = () => {
    // Skip showing WritingResult, go directly to complete
    setStep("complete");
  };

  const handleComplete = () => {
    toast.success("Đã hoàn thành bài thi Speaking & Writing!");
    navigate("/");
  };

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy bài thi?")) {
      toast.error("Bài thi đã bị hủy");
      navigate("/");
    }
  };

  // Anti-cheat: warn on violations, cancel on 3rd
  const handleWarning = useCallback((count: number) => {
    if (count === 1) {
      toast.warning("⚠️ Cảnh báo 1/3: Không được chuyển tab hoặc thu nhỏ cửa sổ trong khi thi!");
    } else if (count === 2) {
      toast.warning("⚠️ Cảnh báo 2/3: Lần tiếp theo sẽ hủy bài thi!", { autoClose: 5000 });
    }
  }, []);

  const handleAntiCheatCancel = useCallback(async () => {
    if (!accessToken) return;
    try {
      await cancelAttempt(accessToken);
      toast.error("Bài thi đã bị hủy do vi phạm quy chế thi (3/3).");
      navigate("/");
    } catch {
      navigate("/");
    }
  }, [accessToken, navigate]);

  useAntiCheat({
    enabled: step === "speaking" || step === "writing",
    onWarning: handleWarning,
    onCancel: handleAntiCheatCancel,
    maxViolations: 3,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 mx-auto" color="blue" />
          <Typography color="gray">Đang tải bài thi Speaking & Writing...</Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 bg-white rounded-xl shadow-lg p-8 max-w-md">
          <Typography variant="h5" color="red" className="font-bold mb-4">
            Lỗi
          </Typography>
          <Typography color="gray" className="mb-6">
            {error}
          </Typography>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Speaking Exam */}
      {step === "speaking" && accessToken && (
        <SpeakingExam
          accessToken={accessToken}
          onComplete={handleSpeakingComplete}
          onCancel={handleCancel}
        />
      )}

      {/* Writing Exam */}
      {step === "writing" && accessToken && (
        <WritingExam
          accessToken={accessToken}
          onComplete={handleWritingComplete}
          onCancel={handleCancel}
        />
      )}

      {/* Complete Result */}
      {step === "complete" && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-6 bg-white rounded-xl shadow-lg p-8 max-w-md">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Đã hoàn thành bài thi!
            </h2>
            <p className="text-gray-600 mb-6">
              Kết quả bài thi Speaking & Writing sẽ được gửi về email của bạn trong vài phút tới.
            </p>
            <button
              onClick={handleComplete}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamSWPage;