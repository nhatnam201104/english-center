import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CheckCircle, Clock, AlertCircle, Camera, X, Lock } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import 'react-toastify/dist/ReactToastify.css';

const DAYS_EN = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

interface AttendanceButtonProps {
  classStartTime: string;
  classEndTime: string;
  dayOfWeek: string;
  sessionId: number;
  onCheckIn: (sessionId: number, qrCode: string) => Promise<void>;
  isCheckedIn: boolean;
}

export const AttendanceButton = ({
  classStartTime,
  classEndTime,
  dayOfWeek,
  sessionId,
  onCheckIn,
  isCheckedIn,
}: AttendanceButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedCode, setScannedCode] = useState<string>('');
  const scannerRef = useRef<HTMLDivElement>(null);
  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Get current time in Vietnam timezone (UTC+7) in minutes since midnight
  const getCurrentVietnamTime = () => {
    const now = new Date();
    const localOffset = now.getTimezoneOffset(); // Local timezone offset in minutes (negative for UTC+)
    const vietnamOffset = -7 * 60; // Vietnam is UTC+7, so offset is -420 minutes
    
    // Calculate the difference between local timezone and Vietnam timezone
    const diffMinutes = localOffset - vietnamOffset;
    
    // Create a new date adjusted to Vietnam time
    const vietnamTime = new Date(now.getTime() + diffMinutes * 60 * 1000);
    
    return vietnamTime.getHours() * 60 + vietnamTime.getMinutes();
  };

  // Convert time string (e.g., "08:00") to minutes
  const timeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Check if session is for today (using Vietnam timezone)
  const isSessionToday = () => {
    const now = new Date();
    const localOffset = now.getTimezoneOffset(); // Local timezone offset in minutes
    const vietnamOffset = -7 * 60; // Vietnam is UTC+7
    
    // Adjust date to Vietnam timezone
    const diffMinutes = localOffset - vietnamOffset;
    const vietnamTime = new Date(now.getTime() + diffMinutes * 60 * 1000);
    
    const today = vietnamTime.getDay();
    const todayDayName = DAYS_EN[today === 0 ? 6 : today - 1];
    
    console.log('[ATTENDANCE] Day check:', {
      localDay: now.getDay(),
      vietnamDay: today,
      todayDayName,
      sessionDay: dayOfWeek,
      isToday: dayOfWeek === todayDayName
    });
    
    return dayOfWeek === todayDayName;
  };

  // Check if session day is in the past (before today)
  const isSessionPast = () => {
    const now = new Date();
    const localOffset = now.getTimezoneOffset();
    const vietnamOffset = -7 * 60;
    
    // Adjust date to Vietnam timezone
    const diffMinutes = localOffset - vietnamOffset;
    const vietnamTime = new Date(now.getTime() + diffMinutes * 60 * 1000);
    
    const today = vietnamTime.getDay();
    const todayIndex = today === 0 ? 6 : today - 1;
    
    const sessionIndex = DAYS_EN.indexOf(dayOfWeek);
    
    console.log('[ATTENDANCE] Past check:', {
      todayIndex,
      sessionIndex,
      isPast: sessionIndex < todayIndex
    });
    
    return sessionIndex < todayIndex;
  };

  // Check if button should be enabled
  const isWithinCheckInWindow = () => {
    const currentMinutes = getCurrentVietnamTime();
    const startMinutes = timeToMinutes(classStartTime);
    const endMinutes = timeToMinutes(classEndTime);
    
    // Enable: 15 minutes before start until class ends
    const earlyThreshold = 15;
    
    return (
      currentMinutes >= startMinutes - earlyThreshold &&
      currentMinutes <= endMinutes
    );
  };

  const getButtonState = () => {
    if (isCheckedIn) {
      return {
        disabled: true,
        text: 'Đã điểm danh',
        icon: <CheckCircle size={16} />,
        bgColor: 'bg-green-500',
        textColor: 'text-white',
      };
    }

    // Check if session is in the PAST
    if (isSessionPast()) {
      return {
        disabled: true,
        text: 'Đã quá giờ',
        icon: <AlertCircle size={16} />,
        bgColor: 'bg-gray-300',
        textColor: 'text-gray-600',
      };
    }

    // Check if session is for today
    if (!isSessionToday()) {
      return {
        disabled: true,
        text: 'Chưa mở lớp',
        icon: <Lock size={16} />,
        bgColor: 'bg-gray-300',
        textColor: 'text-gray-600',
      };
    }

    // Session is today, check time
    if (isWithinCheckInWindow()) {
      return {
        disabled: false,
        text: 'Điểm danh',
        icon: <Camera size={16} />,
        bgColor: 'bg-blue-600 hover:bg-blue-700',
        textColor: 'text-white',
      };
    }

    const currentMinutes = getCurrentVietnamTime();
    const startMinutes = timeToMinutes(classStartTime);
    
    if (currentMinutes < startMinutes - 15) {
      return {
        disabled: true,
        text: 'Chưa đến giờ',
        icon: <Clock size={16} />,
        bgColor: 'bg-gray-300',
        textColor: 'text-gray-600',
      };
    }

    return {
      disabled: true,
      text: 'Đã quá giờ',
      icon: <AlertCircle size={16} />,
      bgColor: 'bg-gray-300',
      textColor: 'text-gray-600',
    };
  };

  // Handle QR code scanning
  const handleScanSuccess = (decodedText: string) => {
    console.log('[QR SCANNER] Scan success:', {
      decodedText,
      timestamp: new Date().toISOString()
    });
    setScannedCode(decodedText);
  };

  // Initialize QR scanner when modal opens
  useEffect(() => {
    if (showScanner && scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      qrScannerRef.current = scanner;

      const success = (decodedText: string) => {
        handleScanSuccess(decodedText);
      };

      const error = () => {
        // Silent failure - QR scanner handles retries
      };

      scanner.render(success, error);
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear();
        qrScannerRef.current = null;
      }
    };
  }, [showScanner]);

  const handleCheckIn = async () => {
    console.log('[ATTENDANCE] Check-in button clicked:', {
      sessionId,
      scannedCode: scannedCode?.substring(0, 30),
      timestamp: new Date().toISOString()
    });

    if (!scannedCode) {
      console.log('[ATTENDANCE] No QR code scanned');
      toast.error('Vui lòng quét mã QR trước khi điểm danh!', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (isLoading) {
      console.log('[ATTENDANCE] Already loading, ignoring click');
      return;
    }
    
    // Stop scanner immediately to prevent multiple scans
    console.log('[ATTENDANCE] Stopping scanner...');
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.clear();
        qrScannerRef.current = null;
        console.log('[ATTENDANCE] Scanner stopped successfully');
      } catch (err) {
        console.error('[ATTENDANCE] Error clearing scanner:', err);
      }
    }

    setIsLoading(true);
    console.log('[ATTENDANCE] Calling onCheckIn...');
    try {
      await onCheckIn(sessionId, scannedCode);
      console.log('[ATTENDANCE] Check-in successful!', {
        sessionId,
        timestamp: new Date().toISOString()
      });
      toast.success('Điểm danh thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setShowScanner(false);
      setScannedCode('');
    } catch (error) {
      console.error('[ATTENDANCE] Check-in failed:', {
        error,
        errorResponse: (error as any)?.response?.data,
        errorMessage: (error as any)?.message,
        timestamp: new Date().toISOString()
      });
      const errorMessage = (error as any)?.response?.data?.message || 'Điểm danh thất bại. Vui lòng thử lại!';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
      console.log('[ATTENDANCE] Check-in process completed');
    }
  };

  const handleOpenScanner = () => {
    setShowScanner(true);
    setScannedCode('');
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    setScannedCode('');
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
    }
  };

  const buttonState = getButtonState();

  return (
    <>
      <button
        onClick={handleOpenScanner}
        disabled={buttonState.disabled || isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium
          transition-all duration-200
          ${buttonState.bgColor} ${buttonState.textColor}
          ${buttonState.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${isLoading ? 'opacity-75' : ''}
        `}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : (
          buttonState.icon
        )}
        <span>{buttonState.text}</span>
      </button>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quét mã QR</h3>
              <button
                onClick={handleCloseScanner}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* QR Scanner Container */}
            <div className="flex justify-center mb-4" ref={scannerRef}>
              <div id="qr-reader" className="w-full"></div>
            </div>

            {/* Scanned Code Display */}
            {scannedCode && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  Đã quét: {scannedCode.substring(0, 20)}...
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseScanner}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleCheckIn}
                disabled={!scannedCode || isLoading}
                className={`
                  flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                  ${scannedCode && !isLoading
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    <span>Đang điểm danh...</span>
                  </div>
                ) : (
                  <span>Xác nhận điểm danh</span>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Hướng dẫn:</span> Đưa camera vào mã QR điểm danh do giáo viên cung cấp.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};