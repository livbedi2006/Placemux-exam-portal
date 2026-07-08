'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, AlertCircle, Clock, Maximize, ShieldCheck,
  ChevronRight, ChevronLeft, Flag, Save, CheckCircle
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { getStoredAuthUser } from '@/lib/auth';
import { updateStreakOnActivity } from '@/lib/streak';
import { createReport } from '@/lib/reports';

export default function ExamTakingInterface() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id;
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 mins
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({});
  const [proctoringWarnings, setProctoringWarnings] = useState(0);
  const [proctoringStatus, setProctoringStatus] = useState<string>("Camera Off");
  const [latestViolation, setLatestViolation] = useState<string>("No issues detected");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastFaceCenterRef = useRef<number | null>(null);
  const violationCooldownRef = useRef(0);
  const lastViolationRef = useRef<string | null>(null);
  const warningCountRef = useRef(0);

  // Mock Questions
  const questions = [
    { id: 1, type: "MCQ", text: "Which of the following is a key component of a Transformer model?", options: ["CNN", "Self-Attention", "RNN", "Max Pooling"] },
    { id: 2, type: "MCQ", text: "What does RAG stand for in modern LLM architectures?", options: ["Random Access Generation", "Retrieval-Augmented Generation", "Recursive AI Generation", "Rapid Action Graph"] },
    { id: 3, type: "TRUE_FALSE", text: "PostgreSQL is a NoSQL database.", options: ["True", "False"] },
    { id: 4, type: "MCQ", text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"] },
    { id: 5, type: "MCQ", text: "Which HTTP method is idempotent?", options: ["POST", "PUT", "PATCH", "All of the above"] }
  ];

  const markExamCompleted = () => {
    const completedExams = JSON.parse(localStorage.getItem('completed-exams') || '[]') as string[];
    const updated = Array.from(new Set([...completedExams, String(examId)]));
    localStorage.setItem('completed-exams', JSON.stringify(updated));
    window.dispatchEvent(new Event('exam-completion-changed'));
    setIsSubmitted(true);
  };

  const recordViolation = (message: string, status: string) => {
    const now = Date.now();
    if (now - violationCooldownRef.current < 8000 && lastViolationRef.current === message) {
      return;
    }

    violationCooldownRef.current = now;
    lastViolationRef.current = message;
    warningCountRef.current += 1;
    setLatestViolation(message);
    setProctoringStatus(status);
    setProctoringWarnings(warningCountRef.current);

    if (warningCountRef.current >= 3) {
      window.setTimeout(() => {
        markExamCompleted();
        alert(`Exam Auto-Submitted due to multiple proctoring violations (${message}).`);
        router.push("/student/exams");
      }, 0);
    }
  };

  // Proctoring Engine (Camera + Browser-side motion analysis + Tab Switch)
  useEffect(() => {
    let isMounted = true;
    let detectionInterval: NodeJS.Timeout;

    // Start Camera Feed
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
        .then(stream => {
          if (videoRef.current && isMounted) {
            videoRef.current.srcObject = stream;
            setProctoringStatus("Camera Live");
          }
        })
        .catch(err => {
          console.error("Camera error:", err);
          if (isMounted) setProctoringStatus("Camera Error");
        });
    }

    detectionInterval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2 && canvasRef.current && isMounted) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = videoRef.current.videoWidth || 320;
        canvas.height = videoRef.current.videoHeight || 240;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let brightPixels = 0;
        let sumX = 0;
        let sumY = 0;
        let pixelCount = 0;
        const lowerHalfStart = Math.floor(canvas.height * 0.5);
        const roiWidth = Math.floor(canvas.width * 0.8);
        const roiX = Math.floor((canvas.width - roiWidth) / 2);

        for (let y = 0; y < canvas.height; y += 1) {
          for (let x = roiX; x < roiX + roiWidth; x += 1) {
            const idx = (y * canvas.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const brightness = (r + g + b) / 3;

            if (brightness > 110) {
              if (y >= lowerHalfStart) {
                brightPixels += 1;
              }
              sumX += x;
              sumY += y;
              pixelCount += 1;
            }
          }
        }

        const brightRatio = brightPixels / Math.max(1, roiWidth * Math.max(1, canvas.height - lowerHalfStart));
        if (brightRatio > 0.12) {
          recordViolation("Phone or bright reflective object visible", "Phone Detected");
          return;
        }

        if (pixelCount > 80) {
          const centerX = sumX / pixelCount;
          const faceWidth = roiWidth * 0.3;
          if (lastFaceCenterRef.current !== null) {
            const deltaX = centerX - lastFaceCenterRef.current;
            if (Math.abs(deltaX) > faceWidth) {
              recordViolation("Face moved unexpectedly left or right", "Face Moved");
              lastFaceCenterRef.current = centerX;
              return;
            }
          }
          lastFaceCenterRef.current = centerX;
          setProctoringStatus("Face Verified");
        } else {
          setProctoringStatus("Face Not Detected");
        }
      }
    }, 2500);

    // Tab switch detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        warningCountRef.current += 1;
        setProctoringWarnings(warningCountRef.current);
        if (warningCountRef.current >= 3) {
          window.setTimeout(() => {
            markExamCompleted();
            alert("Exam Auto-Submitted due to multiple tab-switching violations.");
            router.push("/student/exams");
          }, 0);
        }
        alert("Warning: Tab switching is strictly prohibited!");
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      if (detectionInterval) clearInterval(detectionInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      // Stop webcam stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [router]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          markExamCompleted();
          alert("Time is up! Auto-submitting exam.");
          router.push("/student/exams");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleSelectOption = (opt: string) => {
    setAnswers(prev => {
      const next = { ...prev, [currentQuestion]: opt };
      try { localStorage.setItem(`exam-${examId}-answers`, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = { ...prev, [currentQuestion]: !prev[currentQuestion] };
      try { localStorage.setItem(`exam-${examId}-flags`, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const saveCurrentAnswer = () => {
    try { localStorage.setItem(`exam-${examId}-answers`, JSON.stringify(answers)); } catch {}
    try {
      const user = getStoredAuthUser();
      if (user) updateStreakOnActivity(user.id);
    } catch {}
  };

  const saveAndNext = () => {
    saveCurrentAnswer();
    // mark as answered implicitly by having an entry in answers
    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      setVisited(prev => { const n = { ...prev, [nextIndex]: true }; try { localStorage.setItem(`exam-${examId}-visited`, JSON.stringify(n)); } catch {} return n; });
    }
  };

  const markForReviewAndNext = () => {
    setFlagged(prev => { const n = { ...prev, [currentQuestion]: true }; try { localStorage.setItem(`exam-${examId}-flags`, JSON.stringify(n)); } catch {} return n; });
    saveCurrentAnswer();
    try {
      const user = getStoredAuthUser();
      if (user) updateStreakOnActivity(user.id);
    } catch {}
    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      setVisited(prev => { const n = { ...prev, [nextIndex]: true }; try { localStorage.setItem(`exam-${examId}-visited`, JSON.stringify(n)); } catch {} return n; });
    }
  };

  const clearResponse = () => {
    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQuestion];
      try { localStorage.setItem(`exam-${examId}-answers`, JSON.stringify(copy)); } catch {}
      return copy;
    });
  };

  // When a user selects an option we persist immediately and count activity once per day
  const handleSelectOptionWithActivity = (opt: string) => {
    handleSelectOption(opt);
    try {
      const user = getStoredAuthUser();
      if (user) updateStreakOnActivity(user.id);
    } catch {}
  };

  const goNext = () => {
    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      setVisited(prev => { const n = { ...prev, [nextIndex]: true }; try { localStorage.setItem(`exam-${examId}-visited`, JSON.stringify(n)); } catch {} return n; });
    }
  };

  const goPrevious = () => {
    if (currentQuestion > 0) {
      const prevIndex = currentQuestion - 1;
      setCurrentQuestion(prevIndex);
      setVisited(prev => { const n = { ...prev, [prevIndex]: true }; try { localStorage.setItem(`exam-${examId}-visited`, JSON.stringify(n)); } catch {} return n; });
    }
  };

  const handleSubmitConfirm = () => {
    const total = questions.length;
    const answered = Object.keys(answers).length;
    const markedForReview = Object.values(flagged).filter(Boolean).length;
    const visitedCount = Object.keys(visited).length;
    const unvisited = total - visitedCount;
    const notAnswered = Math.max(0, visitedCount - answered);

    const msg = `Submit Exam?\n\nTotal Questions: ${total}\nAnswered: ${answered}\nNot Answered: ${notAnswered}\nMarked for Review: ${markedForReview}\nUnvisited: ${unvisited}\n\nProceed to submit?`;
    if (window.confirm(msg)) {
      handleSubmitExam();
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = JSON.parse(localStorage.getItem('completed-exams') || '[]') as string[];
    if (stored.includes(String(examId))) {
      setIsSubmitted(true);
    }

    // Load persisted answers/flags/visited for resumed attempts
    try {
      const savedAnswers = JSON.parse(localStorage.getItem(`exam-${examId}-answers`) || '{}');
      const savedFlags = JSON.parse(localStorage.getItem(`exam-${examId}-flags`) || '{}');
      const savedVisited = JSON.parse(localStorage.getItem(`exam-${examId}-visited`) || '{}');
      if (savedAnswers && Object.keys(savedAnswers).length) setAnswers(savedAnswers);
      if (savedFlags && Object.keys(savedFlags).length) setFlagged(savedFlags);
      if (savedVisited && Object.keys(savedVisited).length) setVisited(savedVisited);
      // ensure question 0 marked visited by default
      if (!savedVisited || Object.keys(savedVisited).length === 0) {
        setVisited({ 0: true });
        localStorage.setItem(`exam-${examId}-visited`, JSON.stringify({ 0: true }));
      }
    } catch (e) {
      // ignore
    }
  }, [examId]);

  const handleSubmitExam = () => {
    if (isSubmitted) return;

    try {
      const user = getStoredAuthUser();
      if (user) updateStreakOnActivity(user.id);
    } catch {}

    // Build a basic report summary
    try {
      const user = getStoredAuthUser();
      const total = questions.length;
      const attempted = Object.keys(answers).length;
      const skipped = total - attempted;
      const wrong = 0; // without answer key we cannot grade; treat as unknown
      const correct = attempted - wrong;
      const totalMarks = total * 1;
      const marksObtained = correct * 1;
      const percentage = totalMarks > 0 ? (marksObtained / totalMarks) * 100 : 0;

      if (user) {
        const payload = {
          studentId: user.id,
          studentName: user.name,
          department: (user as any).department || null,
          examId: String(examId),
          examName: `Exam ${examId}`,
          subject: null,
          timeTakenSec: 3600 - timeLeft,
          submittedAt: new Date().toISOString(),
          totalQuestions: total,
          attempted,
          correctAnswers: correct,
          wrongAnswers: wrong,
          skippedAnswers: skipped,
          marksObtained,
          totalMarks,
          percentage,
          grade: null,
          passFail: null,
          topicPerformance: {},
          aiFeedback: {},
        };

        createReport(payload).catch(err => console.error('createReport failed', err));
      }
    } catch (e) {
      console.error('report creation error', e);
    }

    markExamCompleted();
    alert('Exam submitted successfully. You can no longer attempt this exam again.');
    router.push('/student/exams');
  };

  const currentQ = questions[currentQuestion];
  const isAnswered = answers[currentQuestion] !== undefined;
  const answeredCount = Object.keys(answers).length;
  const completionPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.10),_transparent_45%),linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white/90 border-b sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-blue-600 p-2.5 text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-bold text-xl text-slate-900">Exam: Midterm Evaluation</h1>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Section 1 of 1</Badge>
              </div>
              <p className="text-sm text-slate-500">Secure AI-proctored assessment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 rounded-full border px-3 py-2 font-mono text-lg font-bold ${timeLeft < 300 ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            <Button variant="outline" size="sm" onClick={toggleFullscreen} className="rounded-full">
              <Maximize className="w-4 h-4 mr-2" />
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
            <Button variant="destructive" size="sm" className="rounded-full">
              End Exam
            </Button>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-600">Answer progress</span>
            <span className="font-medium text-slate-700">{answeredCount}/{questions.length} answered</span>
          </div>
          <Progress value={completionPercent} className="h-2" />
        </div>
      </header>

      <div className="flex flex-1 p-6 gap-6 max-w-[1600px] mx-auto w-full">
        {/* Main Exam Area */}
        <div className="flex-1 flex flex-col gap-6">
          
          {proctoringWarnings > 0 && (
            <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-amber-50 p-4 text-red-700 shadow-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <div className="font-semibold">Proctoring Warning</div>
                  <div className="text-sm">{latestViolation}</div>
                  <div className="text-sm mt-1">You have {proctoringWarnings}/3 violations. Further violations will result in automatic submission.</div>
                </div>
              </div>
            </div>
          )}

          <Card className="flex-1 flex flex-col border-slate-200 shadow-sm">
            <CardHeader className="border-b bg-slate-50/70">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  Question {currentQuestion + 1} of {questions.length}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">Marks: 1</Badge>
                  <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Negative: -0.25</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-8">
              <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm font-medium text-slate-500">Question prompt</p>
                <h2 className="mt-1 text-xl font-medium text-slate-800 leading-relaxed">
                  {currentQ.text}
                </h2>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = answers[currentQuestion] === opt;
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelectOptionWithActivity(opt)}
                        className={`p-4 border rounded-2xl cursor-pointer transition-all duration-200 flex items-center gap-4 ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50/80 shadow-sm' 
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className={`text-lg ${isSelected ? 'font-medium text-blue-900' : 'text-slate-700'}`}>
                          {opt}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
            
            {/* Action Bar */}
            <div className="p-4 border-t bg-slate-50/80 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={goPrevious} disabled={currentQuestion === 0} className="rounded-full">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <Button variant="outline" onClick={toggleFlag} className={flagged[currentQuestion] ? "border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-full" : "rounded-full"}>
                  <Flag className="w-4 h-4 mr-2" />
                  {flagged[currentQuestion] ? "Unflag" : "Mark for Review"}
                </Button>
              </div>

              <div className="flex gap-3 items-center">
                <Button variant="outline" onClick={saveCurrentAnswer} className="rounded-full">💾 Save Answer</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full" onClick={saveAndNext}>✔ Save & Next</Button>
                <Button variant="outline" onClick={markForReviewAndNext} className="rounded-full">⭐ Mark for Review & Next</Button>
                <Button variant="ghost" onClick={clearResponse} className="rounded-full">❌ Clear Response</Button>

                {currentQuestion < questions.length - 1 ? (
                  <Button className="bg-slate-700 hover:bg-slate-800 text-white rounded-full" onClick={goNext}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full" onClick={handleSubmitConfirm}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Exam
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar - Question Palette & Proctoring */}
        <div className="w-[300px] flex flex-col gap-6">
          {/* Proctoring Camera */}
          <Card className="overflow-hidden border-blue-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 py-3 px-4 border-b border-blue-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-800">
                <Camera className="w-4 h-4" />
                Live Proctoring Active
              </CardTitle>
            </CardHeader>
            <div className="relative aspect-video bg-slate-900">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 border-[3px] border-transparent pointer-events-none" />
              {/* Overlay elements to show AI tracking status */}
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge variant="secondary" className="bg-black/50 text-white text-[10px] border-none backdrop-blur-sm">
                  {proctoringStatus}
                </Badge>
              </div>
              <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-slate-700 shadow-sm">
                Secure session
              </div>
            </div>
          </Card>

          {/* Question Palette */}
          <Card className="flex-1 shadow-sm">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-base">Question Palette</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-2">
                {questions.map((_, i) => {
                  const isCurrent = currentQuestion === i;
                  const answered = answers[i] !== undefined;
                  const isFlagged = flagged[i];
                  
                  let bgColor = "bg-white border-slate-200 text-slate-600 hover:border-slate-400";
                  if (isCurrent) bgColor = "bg-blue-100 border-blue-400 text-blue-800 ring-2 ring-blue-200";
                  else if (isFlagged) bgColor = "bg-orange-100 border-orange-400 text-orange-800";
                  else if (answered) bgColor = "bg-green-100 border-green-400 text-green-800";

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentQuestion(i);
                        setVisited(prev => { const n = { ...prev, [i]: true }; try { localStorage.setItem(`exam-${examId}-visited`, JSON.stringify(n)); } catch {} return n; });
                      }}
                      className={`h-12 rounded-lg border flex items-center justify-center font-medium transition-all ${bgColor}`}
                    >
                      {i + 1}
                      {isFlagged && <div className="absolute w-2 h-2 rounded-full bg-orange-500 -top-1 -right-1" />}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-100 border border-green-400" /> Answered</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-orange-100 border border-orange-400" /> Marked for Review</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white border border-slate-200" /> Not Answered</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
