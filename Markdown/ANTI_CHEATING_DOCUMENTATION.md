# Tài liệu Hướng dẫn Tính năng Chống Gian lận (Anti-Cheating)

## Mục lục

1. [Tổng quan](#tổng-quan)
2. [Cơ chế Chống Gian lận hiện có trong Listening/Reading](#cơ-chế-chống-gian-lận-hiện-có-trong-listeningreading)
3. [Hướng dẫn áp dụng cho Speaking Exam](#hướng-dẫn-áp-dụng-cho-speaking-exam)
4. [Hướng dẫn áp dụng cho Writing Exam](#hướng-dẫn-áp-dụng-cho-writing-exam)
5. [Code mẫu &amp; Implementation Steps](#code-mẫu--implementation-steps)
6. [Testing &amp; Verification](#testing--verification)

---

## Tổng quan

Tài liệu này cung cấp hướng dẫn chi tiết về các tính năng chống gian lận đã được triển khai trong các bài thi Listening/Reading (LR) và cách áp dụng chúng cho Speaking và Writing exams.

### Tại sao cần chống gian lận?

Các bài thi trực tuyến cần đảm bảo tính công bằng và trinh phi bằng cách:

- Ngăn học viên chuyển sang tab khác để tìm kiếm câu trả lời
- Đảm bảo học viên tập trung vào bài thi
- Phát hiện hành vi gian lận có thể
- Bảo vệ tính toàn vẹn của bài thi

---

## Cơ chế Chống Gian lận hiện có trong Listening/Reading

### 1. Backend Mechanisms

**File**: `Backend/src/middleware/attemptAccess.middleware.ts`

#### Inactivity Detection

```typescript
// Kiểm tra hoạt động và phát hiện gian lận
const checkInactivity = async (attemptId: number) => {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId }
  });

  if (!attempt) return;

  const timeSinceLastAccess = Date.now() - new Date(attempt.lastAccessedAt || Date.now()).getTime();

  // Cảnh báo: không hoạt động > 5 phút (có thể đang chuyển tab)
  if (timeSinceLastAccess > 5 * 60 * 1000) {
    console.log(`⚠️ Warning: Student inactive for ${timeSinceLastAccess / 60000} minutes`);
  }

  // Đánh dấu gian lận: không hoạt động > 10 phút
  if (timeSinceLastAccess > 10 * 60 * 1000) {
    await prisma.attempt.update({
      where: { id: attemptId },
      data: { cheated: true, cheatReason: 'Long inactivity detected' }
    });
  }
};
```

**Cơ chế hoạt động**:

- **5 phút inactivity**: Log cảnh báo (có thể học viên đang chuyển tab)
- **10 phút inactivity**: Tự động đánh dấu `cheated = true` với lý do rõ ràng
- Giáo viên có thể xem `lastAccessedAt` và `cheatReason` trong database

### 2. Frontend Mechanisms

**File**: `frontend/src/hooks/use-anti-cheat.hook`

#### a. Tab Switching Detection

```typescript
const handleVisibilityChange = () => {
  if (document.hidden) {
    // Học viên chuyển sang tab khác
    setTabSwitchCount(prev => prev + 1);
    addViolation('Tab switched');
  
    if (onTabSwitch) {
      onTabSwitch(tabSwitchCount + 1);
    }
  }
};

useEffect(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);
```

**Mục đích**: Phát hiện khi học viên rời khỏi trang bài thi

#### b. Fullscreen Enforcement

```typescript
const enterFullscreen = () => {
  try {
    document.documentElement.requestFullscreen().catch(err => {
      console.log('Fullscreen error:', err);
    });
  } catch (err) {
    console.error('Fullscreen failed:', err);
  }
};

const handleFullscreenChange = () => {
  const isFullscreen = !!document.fullscreenElement;
  setIsFullscreen(isFullscreen);
  
  if (!isFullscreen && enforceFullscreen) {
    // Học viên thoát khỏi fullscreen - cảnh báo
    addViolation('Exited fullscreen');
  }
};
```

**Mục đích**: Đảm bảo học viên làm bài trong chế độ toàn màn hình, tránh chuyển tab

#### c. Clipboard Blocking

```typescript
const handleCopyPaste = (e: ClipboardEvent) => {
  e.preventDefault();
  addViolation('Clipboard access blocked');
  
  if (onCheatDetected) {
    onCheatDetected({
      type: 'clipboard',
      message: 'Attempted to access clipboard'
    });
  }
};

useEffect(() => {
  if (disableClipboard) {
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
  }
  
  return () => {
    document.removeEventListener('copy', handleCopyPaste);
    document.removeEventListener('paste', handleCopyPaste);
    document.removeEventListener('cut', handleCopyPaste);
  };
}, [disableClipboard]);
```

**Mục đích**: Ngăn học viên copy câu hỏi hoặc paste câu trả lời từ nguồn khác

#### d. Console Blocking

```typescript
const blockConsole = () => {
  const originalConsole = { ...console };
  
  // Ẩn console output
  ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
    (console as any)[method] = () => {};
  });
  
  // Chặn devtools
  const devtoolsChecker = new Error();
  (devtoolsChecker as any).toString = () => {
    if (onCheatDetected) {
      onCheatDetected({
        type: 'devtools',
        message: 'Devtools opened'
      });
    }
  };
  
  console.log('%c', devtoolsChecker);
};
```

**Mục đích**: Ngăn học viên mở DevTools để inspect code hoặc tìm câu trả lời

#### e. Keyboard Shortcuts Blocking

```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  const blockedKeys = [
    'F12',           // Open devtools
    'Control+Shift+I', // Open devtools
    'Control+Shift+J', // Open console
    'Control+Shift+C', // Inspect element
    'Control+U',      // View source
    'Alt+F4',         // Close tab
  ];
  
  // Check if key combination is blocked
  const isBlocked = blockedKeys.some(key => {
    const parts = key.split('+');
    return parts.every(part => {
      if (part === 'Control') return e.ctrlKey;
      if (part === 'Shift') return e.shiftKey;
      if (part === 'Alt') return e.altKey;
      return e.key === part;
    });
  });
  
  if (isBlocked) {
    e.preventDefault();
    e.stopPropagation();
    addViolation(`Blocked key: ${e.key}`);
  }
};
```

**Mục đích**: Chặn các phím tắt để mở DevTools hoặc thực hiện hành vi gian lận

---

## Hướng dẫn áp dụng cho Speaking Exam

### Phân tích Speaking Exam hiện tại

**File**: `frontend/src/components/client/exam/SpeakingExam.tsx`

**Tính năng hiện có**:

- ✅ Timer đếm ngược
- ✅ Recording audio
- ✅ Auto-save audio
- ✅ UI navigation

**Thiếu**:

- ❌ Không có tab switching detection
- ❌ Không có fullscreen enforcement
- ❌ Không có clipboard blocking
- ❌ Không có console blocking
- ❌ Không có keyboard shortcuts blocking

### Cách tích hợp use-anti-cheat hook

#### Step 1: Import hook

```typescript
import { useAntiCheat } from "../../hooks/use-anti-cheat.hook";
```

#### Step 2: Add state variables

```typescript
const [tabSwitches, setTabSwitches] = useState(0);
const [violations, setViolations] = useState<string[]>([]);
```

#### Step 3: Initialize hook in component

```typescript
export const SpeakingExam: React.FC<SpeakingExamProps> = ({
  accessToken,
  onComplete,
  onCancel,
}) => {
  // ... existing code ...

  // Initialize anti-cheat hook
  useAntiCheat({
    enabled: true,
    disableClipboard: true,          // Ngăn copy/paste
    enforceFullscreen: false,         // Speaking có thể không cần fullscreen (vì cần camera/microphone)
    blockKeyboard: false,             // Không block keyboard (cần để test mic)
    onTabSwitch: (count) => {
      setTabSwitches(count);
      // Warn student
      if (count === 1) {
        alert('⚠️ Cảnh báo: Bạn đã chuyển tab 1 lần. Việc này sẽ được ghi lại.');
      }
    },
    onCheatDetected: (violation) => {
      setViolations(prev => [...prev, `${violation.type}: ${violation.message}`]);
      console.warn('Cheat detected:', violation);
    },
  });

  // ... rest of component ...
};
```

#### Step 4: Add UI warnings

**Trong header, thêm warning indicator**:

```typescript
{tabSwitches > 0 && (
  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-300 rounded-lg">
    <AlertTriangle className="w-5 h-5 text-yellow-600" />
    <span className="text-yellow-800 font-medium">
      Đã chuyển tab {tabSwitches} lần
    </span>
  </div>
)}
```

**Trong status bar, thêm violations display**:

```typescript
{violations.length > 0 && (
  <div className="flex flex-col gap-1 mt-4">
    <h3 className="font-semibold text-red-600">Vi phạm quy định:</h3>
    {violations.map((v, idx) => (
      <div key={idx} className="text-sm text-red-700">• {v}</div>
    ))}
  </div>
)}
```

#### Step 5: Update backend (nếu cần)

**Trong `SpeakingExamLR.controller.ts` hoặc service tương ứng**, thêm tracking:

```typescript
// Khi submit speaking exam
const attempt = await prisma.attempt.update({
  where: { id: attemptId },
  data: {
    submittedAt: new Date(),
    // Ghi nhận số lần chuyển tab từ frontend
    metadata: {
      tabSwitchCount: tabSwitchesFromFrontend,
      violations: violationsFromFrontend
    }
  }
});
```

### Tùy chỉnh cho Speaking

**Những tính năng nên BẬT**:

- ✅ Tab switching detection
- ✅ Clipboard blocking (ngăn copy câu hỏi)
- ✅ Console blocking

**Những tính năng nên TẮT/ĐIỀU CHỈNH**:

- ❌ Fullscreen enforcement - Speaking cần camera/microphone, fullscreen có thể gây khó khăn
- ❌ Keyboard blocking - Học viên có thể cần test mic/speaker
- ❌ Chuột phải block - Học viên có thể cần click chuột phải để test

### Code mẫu đầy đủ cho SpeakingExam

```typescript
import React, { useState, useEffect } from "react";
import { useAntiCheat } from "../../hooks/use-anti-cheat.hook";
import { AlertTriangle } from "lucide-react";

// ... other imports ...

export const SpeakingExam: React.FC<SpeakingExamProps> = ({
  accessToken,
  onComplete,
  onCancel,
}) => {
  const [questions, setQuestions] = useState<SpeakingQuestionType[]>([]);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [violations, setViolations] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  // Initialize anti-cheat hook
  useAntiCheat({
    enabled: true,
    disableClipboard: true,          // Ngăn copy/paste
    enforceFullscreen: false,         // Speaking không cần fullscreen bắt buộc
    blockKeyboard: false,             // Không block keyboard
    onTabSwitch: (count) => {
      setTabSwitches(count);
      if (count > 0) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 5000);
      }
    },
    onCheatDetected: (violation) => {
      setViolations(prev => [...prev, `${violation.type}: ${violation.message}`]);
    },
  });

  // ... rest of existing SpeakingExam code ...

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">TOEIC Speaking</h1>
        
            {/* Anti-cheat warnings */}
            {tabSwitches > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-300 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">
                  Đã chuyển tab {tabSwitches} lần
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Warning banner */}
      {showWarning && (
        <div className="bg-yellow-100 border-b-2 border-yellow-400 px-4 py-3">
          <p className="text-center text-yellow-800 font-medium">
            ⚠️ Cảnh báo: Việc chuyển tab sẽ được ghi lại và có thể ảnh hưởng đến điểm số của bạn.
          </p>
        </div>
      )}

      {/* ... rest of SpeakingExam UI ... */}
    </div>
  );
};
```

---

## Hướng dẫn áp dụng cho Writing Exam

### Phân tích Writing Exam hiện tại

**File**: `frontend/src/components/client/exam/WritingExam.tsx`

**Tính năng hiện có**:

- ✅ Timer đếm ngược (60 phút)
- ✅ Auto-save text answers
- ✅ Question navigation
- ✅ Save indicator "Đang lưu câu..."

**Thiếu**:

- ❌ Không có tab switching detection
- ❌ Không có fullscreen enforcement
- ❌ Không có clipboard blocking (quan trọng!)
- ❌ Không có console blocking
- ❌ Không có keyboard shortcuts blocking

### Cách tích hợp use-anti-cheat hook

#### Step 1: Import hook

```typescript
import { useAntiCheat } from "../../hooks/use-anti-cheat.hook";
import { AlertTriangle, Shield } from "lucide-react";
```

#### Step 2: Add state variables

```typescript
const [tabSwitches, setTabSwitches] = useState(0);
const [violations, setViolations] = useState<string[]>([]);
const [showCheatingDialog, setShowCheatingDialog] = useState(false);
const [warningCount, setWarningCount] = useState(0);
```

#### Step 3: Initialize hook (đây là QUAN TRỌNG)

```typescript
export const WritingExam: React.FC<WritingExamProps> = ({
  accessToken,
  speakingScore,
  onComplete,
  onCancel,
}) => {
  // ... existing code ...

  // Initialize anti-cheat hook với FULL FEATURES
  useAntiCheat({
    enabled: true,
    disableClipboard: true,          // NGƯỜI CỰC QUAN TRỌNG cho Writing!
    enforceFullscreen: true,          // Writing nên làm trong fullscreen
    blockKeyboard: true,              // Chặn F12, Ctrl+Shift+I, v.v.
    onTabSwitch: (count) => {
      setTabSwitches(count);
  
      // Warning system: 3 warnings then block
      if (count === 1) {
        alert('⚠️ CẢNH BÁO 1/3: Đừng chuyển tab! Việc này sẽ bị ghi lại.');
      } else if (count === 2) {
        alert('⚠️ CẢNH BÁO 2/3: Lần cuối cùng! Hãy tiếp tục tập trung.');
      } else if (count >= 3) {
        // Tự động nộp bài hoặc khóa
        setShowCheatingDialog(true);
        handleSubmit(); // Auto-submit
      }
    },
    onCheatDetected: (violation) => {
      setViolations(prev => [...prev, `${violation.type}: ${violation.message}`]);
      setWarningCount(prev => prev + 1);
  
      console.warn('Cheat detected:', violation);
  
      // Log to backend
      logViolationToBackend(violation);
    },
  });

  // ... rest of component ...
};
```

#### Step 4: Add backend logging function

```typescript
const logViolationToBackend = async (violation: any) => {
  try {
    // Gọi API để log violation
    await axios.post('/api/exam/violation', {
      type: 'writing',
      violation: violation.type,
      message: violation.message,
      timestamp: new Date().toISOString(),
      // Có thể gửi attemptId nếu có
    });
  } catch (err) {
    console.error('Failed to log violation:', err);
  }
};
```

#### Step 5: Add UI warnings and indicators

**Trong header, thêm comprehensive status**:

```typescript
<div className="flex items-center gap-4">
  {/* Tab switch warning */}
  {tabSwitches > 0 && (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
      tabSwitches >= 3 
        ? 'bg-red-100 border-red-400' 
        : 'bg-yellow-100 border-yellow-300'
    }`}>
      <AlertTriangle className={`w-5 h-5 ${tabSwitches >= 3 ? 'text-red-600' : 'text-yellow-600'}`} />
      <span className={`font-medium ${tabSwitches >= 3 ? 'text-red-800' : 'text-yellow-800'}`}>
        Chuyển tab: {tabSwitches}/3
      </span>
    </div>
  )}

  {/* Violations indicator */}
  {violations.length > 0 && (
    <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-300 rounded-lg">
      <Shield className="w-5 h-5 text-orange-600" />
      <span className="font-medium text-orange-800">
        Vi phạm: {violations.length}
      </span>
    </div>
  )}
</div>
```

**Trong question list, thêm violations display**:

```typescript
{violations.length > 0 && (
  <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
    <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
      <AlertTriangle className="w-5 h-5" />
      Các vi phạm đã phát hiện:
    </h3>
    <ul className="space-y-1">
      {violations.map((v, idx) => (
        <li key={idx} className="text-red-700 text-sm">
          {idx + 1}. {v}
        </li>
      ))}
    </ul>
  </div>
)}
```

#### Step 6: Add cheating dialog

```typescript
{/* Auto-submit dialog khi phát hiện gian lận */}
{showCheatingDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full">
      <div className="p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-red-800 mb-4">
          Phát hiện hành vi gian lận
        </h2>

        <div className="space-y-3 mb-6 text-gray-700">
          <p>• Chuyển tab: <strong>{tabSwitches}</strong> lần (giới hạn: 3)</p>
          <p>• Các vi phạm khác: <strong>{violations.length}</strong></p>
          <p className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm">
            <strong>⚠️ Lưu ý:</strong> Bài thi của bạn sẽ được tự động nộp và giáo viên sẽ được thông báo về các vi phạm này.
          </p>
        </div>

        <button
          onClick={() => {
            setShowCheatingDialog(false);
            onCancel(); // Exit exam
          }}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Đóng và thoát
        </button>
      </div>
    </div>
  </div>
)}
```

### Tùy chỉnh cho Writing

**Những tính năng nên BẬT (Mandatory)**:

- ✅ **Tab switching detection** - QUAN TRỌNG
- ✅ **Clipboard blocking** - RẤT QUAN TRỌNG (ngăn copy/paste)
- ✅ **Console blocking** - Ngăn inspect
- ✅ **Keyboard shortcuts blocking** - Chặn F12, Ctrl+U, v.v.
- ✅ **Fullscreen enforcement** - Tùy chọn (nên BẬT)

**Lý do**:

- Writing là bài thi văn bản, dễ dàng copy/paste từ internet
- Học viên có thể tìm kiếm câu trả lời nhanh
- Cần bảo vệ nghiêm ngặt hơn

### Code mẫu đầy đủ cho WritingExam

```typescript
import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertTriangle, Shield } from "lucide-react";
import { useAntiCheat } from "../../hooks/use-anti-cheat.hook";
import type { WritingQuestion as WritingQuestionType } from "../../../types/entrance-exam/writing.types";

// ... other imports ...

export const WritingExam: React.FC<WritingExamProps> = ({
  accessToken,
  speakingScore,
  onComplete,
  onCancel,
}) => {
  const [questions, setQuestions] = useState<WritingQuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [savedQuestions, setSavedQuestions] = useState<Set<number>>(new Set());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [autoSaving, setAutoSaving] = useState<number | null>(null);

  // Anti-cheat states
  const [tabSwitches, setTabSwitches] = useState(0);
  const [violations, setViolations] = useState<string[]>([]);
  const [showCheatingDialog, setShowCheatingDialog] = useState(false);

  // Initialize anti-cheat hook
  useAntiCheat({
    enabled: true,
    disableClipboard: true,          // QUAN TRỌNG: Ngăn copy/paste
    enforceFullscreen: true,          // Writing nên fullscreen
    blockKeyboard: true,              // Chặn F12, devtools
    onTabSwitch: (count) => {
      setTabSwitches(count);
  
      // 3-strike system
      if (count === 1) {
        alert('⚠️ CẢNH BÁO 1/3: Đừng chuyển tab! Việc này sẽ bị ghi lại.');
      } else if (count === 2) {
        alert('⚠️ CẢNH BÁO 2/3: Lần cuối cùng! Hãy tiếp tục tập trung.');
      } else if (count >= 3) {
        setShowCheatingDialog(true);
        handleSubmit(); // Auto-submit
      }
    },
    onCheatDetected: (violation) => {
      setViolations(prev => [...prev, `${violation.type}: ${violation.message}`]);
      console.warn('Cheat detected:', violation);
    },
  });

  // ... rest of existing WritingExam code ...

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header với anti-cheat warnings */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">TOEIC Writing</h1>
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="font-mono text-xl font-bold text-purple-600">
                {formatTime(timeRemaining)}
              </span>
          
              {/* Tab switch warning */}
              {tabSwitches > 0 && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                  tabSwitches >= 3 
                    ? 'bg-red-100 border-red-400' 
                    : 'bg-yellow-100 border-yellow-300'
                }`}>
                  <AlertTriangle className={`w-4 h-4 ${
                    tabSwitches >= 3 ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    tabSwitches >= 3 ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    Tab: {tabSwitches}/3
                  </span>
                </div>
              )}
          
              {/* Violations count */}
              {violations.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 border border-orange-300 rounded-lg">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    Vi phạm: {violations.length}
                  </span>
                </div>
              )}
            </div>

            {/* ... existing header code ... */}
          </div>
        </div>
      </div>

      {/* ... rest of WritingExam UI ... */}

      {/* Cheating dialog */}
      {showCheatingDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full">
            <div className="p-8">
              {/* Dialog content as shown above */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## Code mẫu & Implementation Steps

### Step-by-Step Implementation Checklist

#### 1. Speaking Exam

- [ ] Import `useAntiCheat` hook
- [ ] Import icons (AlertTriangle, Shield)
- [ ] Add state variables (tabSwitches, violations, showWarning)
- [ ] Initialize `useAntiCheat` hook với config:
  - enabled: true
  - disableClipboard: true
  - enforceFullscreen: false (Speaking có thể không cần)
  - blockKeyboard: false
- [ ] Add `onTabSwitch` callback (1st time warning)
- [ ] Add `onCheatDetected` callback (log violations)
- [ ] Add warning UI in header (tab switch count)
- [ ] Add warning banner after tab switch
- [ ] Test: Try switching tabs
- [ ] Test: Try copying text
- [ ] Test: Try opening console

#### 2. Writing Exam

- [ ] Import `useAntiCheat` hook
- [ ] Import icons (AlertTriangle, Shield, CheckCircle)
- [ ] Add state variables (tabSwitches, violations, showCheatingDialog)
- [ ] Initialize `useAntiCheat` hook với config:
  - enabled: true
  - disableClipboard: true (**QUAN TRỌNG**)
  - enforceFullscreen: true
  - blockKeyboard: true
- [ ] Add `onTabSwitch` callback với 3-strike system:
  - 1st: Warning 1/3
  - 2nd: Warning 2/3
  - 3rd: Auto-submit and show dialog
- [ ] Add `onCheatDetected` callback
- [ ] Add warning UI in header (tab switch count/3)
- [ ] Add violations UI (count and list)
- [ ] Add cheating dialog (auto-submit message)
- [ ] Test: Try switching tabs (should auto-submit on 3rd)
- [ ] Test: Try copying text (should be blocked)
- [ ] Test: Try pasting text (should be blocked)
- [ ] Test: Try opening F12 (should be blocked)
- [ ] Test: Try Ctrl+Shift+I (should be blocked)
- [ ] Test: Try exiting fullscreen (should warn)

#### 3. Backend (nếu cần)

- [ ] Add `lastAccessedAt` tracking cho Writing/Speaking attempts
- [ ] Add endpoint để log violations từ frontend
- [ ] Update Attempt model để store metadata (tabSwitchCount, violations)
- [ ] Create admin view để view violations
- [ ] Add logic để flag cheaters dựa trên violations

### Code Snippets cho Common Tasks

#### Creating API endpoint để log violations

**Backend - `routes/entranceExamLR.routes.ts`**:

```typescript
router.post('/violation', authenticate, async (req: Request, res: Response) => {
  try {
    const { attemptId, type, violation, message, timestamp } = req.body;

    // Lưu violation vào database
    await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        lastAccessedAt: new Date(),
        // Nếu có field metadata hoặc JSON
        metadata: {
          violations: {
            type,
            message,
            timestamp
          }
        }
      }
    });

    customResponse.success(res, 'Violation logged');
  } catch (error) {
    customResponse.error(res, 'Failed to log violation');
  }
});
```

#### Updating frontend service để log violations

**Frontend - `services/entranceExam.candidate.service.ts`**:

```typescript
export const logExamViolation = async (
  accessToken: string,
  violation: {
    attemptId?: number;
    type: string;
    message: string;
  }
) => {
  try {
    const response = await axios.post(
      '/api/entranceExamLR/violation',
      violation,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to log violation'
    };
  }
};
```

---

## Testing & Verification

### Testing Checklist cho Speaking Exam

#### Tab Switching

```bash
# Test steps:
1. Mở Speaking Exam
2. Recording một câu trả lời
3. Chuyển sang tab khác (Ctrl+Tab hoặc Cmd+Tab)
4. Quay lại tab bài thi
5. Kiểm tra: Warning banner có hiện không?
6. Kiểm tra: Tab switch counter có tăng không?
```

**Expected**:

- ✅ Warning banner appears
- ✅ Tab switch counter increments
- ✅ Không auto-submit (Speaking cho phép vài lần)

#### Copy/Paste Blocking

```bash
# Test steps:
1. Mở Speaking Exam
2. Bôi đen câu hỏi
3. Thử: Ctrl+C (Right-click → Copy)
4. Kiểm tra: Có message cảnh báo không?

# Test paste:
1. Copy text từ source khác
2. Focus vào textarea input (nếu có)
3. Thử: Ctrl+V (Right-click → Paste)
4. Kiểm tra: Có paste thành công không?
```

**Expected**:

- ✅ Copy bị block
- ✅ Paste bị block (nếu có text input)

#### Console Blocking

```bash
# Test steps:
1. Mở Speaking Exam
2. Thử: F12
3. Thử: Ctrl+Shift+I
4. Thử: Right-click → Inspect
5. Kiểm tra: Devtools có mở không?
```

**Expected**:

- ✅ Devtools không mở được
- ❌ Console.log bị ẩn

### Testing Checklist cho Writing Exam

#### Tab Switching (3-Strike System)

```bash
# Test steps:
1. Mở Writing Exam
2. Chuyển tab lần 1
   → Kiểm tra: Warning 1/3?
3. Chuyển tab lần 2
   → Kiểm tra: Warning 2/3?
4. Chuyển tab lần 3
   → Kiểm tra: Cheating dialog hiện?
   → Kiểm tra: Bài thi auto-submit?
   → Kiểm ra: Exam đóng?
```

**Expected**:

- ✅ 1st switch: Warning 1/3
- ✅ 2nd switch: Warning 2/3
- ✅ 3rd switch: Auto-submit + dialog + exit

#### Copy/Paste Blocking (CRITICAL)

```bash
# Test steps:
1. Mở Writing Exam
2. Mở tab khác với câu trả lời mẫu
3. Copy câu trả lời mẫu
4. Quay lại tab Writing Exam
5. Thử: Ctrl+V vào textarea
6. Kiểm tra: Text có paste được không?

# Test copy:
1. Bôi đen câu hỏi trong Writing Exam
2. Thử: Ctrl+C
3. Kiểm tra: Có copy được không?
```

**Expected**:

- ❌ **PASTE PHẢI BỊ BLOCK** (quan trọng nhất!)
- ❌ Copy bị block
- ⚠️ Show violation message

#### Fullscreen Enforcement

```bash
# Test steps:
1. Mở Writing Exam
2. Exam tự động vào fullscreen?
3. Thử: Nhấn Esc để thoát fullscreen
4. Kiểm tra: Có cảnh báo không?
5. Thử: Nhấn lại để vào fullscreen
```

**Expected**:

- ✅ Auto-enter fullscreen khi bắt đầu
- ✅ Warn khi thoát fullscreen
- ✅ Cho phép quay lại fullscreen

#### Keyboard Blocking

```bash
# Test steps:
1. Mở Writing Exam
2. Thử: F12 → Blocked?
3. Thử: Ctrl+Shift+I → Blocked?
4. Thử: Ctrl+U → Blocked?
5. Thử: Alt+F4 → Blocked?
6. Thử: Right-click → Inspect → Blocked?
```

**Expected**:

- ✅ Tất cả keyboard shortcuts bị block
- ✅ Devtools không mở được

### Edge Cases để Lưu ý

#### Network Disconnection

**Problem**: Nếu mất mạng, backend không nhận được `lastAccessedAt` updates

**Solution**:

- Frontend vẫn hoạt động offline (có thể cache)
- Khi re-connect, sync tất cả violations
- Hiển thị thông báo "Đã mất kết nối mạng" thay vì "Gian lận"

#### Browser Crashes

**Problem**: Nếu browser crash, học viên có thể gian lận không bị phát hiện

**Solution**:

- Backend có thể dựa trên `lastAccessedAt`太久不活动
- Nếu crash và reopen, timer tiếp tục nhưng violations reset
- Document rõ ràng trong quy định

#### Multiple Monitors

**Problem**: Học viên có thể mở câu trả lời trên monitor khác

**Solution**:

- Fullscreen enforcement sẽ làm tất cả monitors fullscreen
- Khó thực hiện nhưng có thể bypass bằng external device
- Giáo viên cần monitor video proctoring nếu có

#### Virtual Machine

**Problem**: Học viên có thể dùng VM để bypass restrictions

**Solution**:

- Phát hiện VM bằng browser fingerprint
- Cần integration với proctoring tool
- Nâng cao: AI video monitoring

### Verification Checklist

Trước khi deploy, kiểm tra:

**Speaking Exam**:

- [ ] Hook không crash component
- [ ] Timer vẫn hoạt động bình thường
- [ ] Recording vẫn hoạt động bình thường
- [ ] Auto-save vẫn hoạt động bình thường
- [ ] Tab switch detection hoạt động
- [ ] Copy/paste blocking hoạt động
- [ ] Console blocking hoạt động
- [ ] UI warnings hiển thị đúng
- [ ] Không false positives

**Writing Exam**:

- [ ] Hook không crash component
- [ ] Timer vẫn hoạt động bình thường
- [ ] Auto-save text vẫn hoạt động
- [ ] Tab switch 3-strike system hoạt động
- [ ] Auto-submit on 3rd switch
- [ ] Copy/paste blocking hoạt động (**CRITICAL**)
- [ ] Fullscreen enforcement hoạt động
- [ ] Keyboard blocking hoạt động
- [ ] Cheating dialog hiển thị đúng
- [ ] Violations log thành công
- [ ] Không false positives

---

## Kết luận

### Tóm tắt

1. **Speaking Exam**:

   - Bật: Tab switching, Clipboard blocking, Console blocking
   - Tắt/Điều chỉnh: Fullscreen, Keyboard blocking
   - Warning: 1 time, sau đó chỉ monitor
2. **Writing Exam**:

   - Bật: TẤT CẢ features (đặc biệt là clipboard blocking!)
   - 3-strike system cho tab switching
   - Auto-submit on 3rd violation
   - Fullscreen enforcement recommended

### Lợi ích

- ✅ Tăng tính toàn vẹn của bài thi
- ✅ Phát hiện gian lận nhanh
- ✅ Tạo deterrent cho học viên
- ✅ Log evidence cho giáo viên
- ✅ Giảm công việc manual review

### Giới hạn

- ⚠️ Không phát hiện external devices
- ⚠️ Không phát hiện VM/VNC
- ⚠️ Không phát hiện proctoring video (cần add-on)
- ⚠️ Có thể bypass bằng advanced techniques

### Tiếp theo (Future Improvements)

- [ ] AI video proctoring
- [ ] Browser fingerprinting để detect VM
- [ ] Network monitoring
- [ ] Multi-device detection
- [ ] Real-time teacher monitoring dashboard

---

**Tài liệu được tạo**: 24/03/2026
**Phiên bản**: 1.0
**Tác giả**: Development Team
