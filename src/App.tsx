import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Brain, 
  Stethoscope, 
  ShieldCheck, 
  Activity, 
  BarChart3, 
  User, 
  ChevronRight, 
  Mic, 
  Video, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Award,
  MessageSquare,
  Send,
  X,
  Loader2,
  Baby,
  Sparkles,
  HeartPulse,
  Zap,
  ShieldAlert,
  Pill,
  UserPlus,
  Home,
  Settings,
  FileText,
  Users,
  CreditCard,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from './lib/utils';
import { GoogleGenAI } from "@google/genai";

// --- Gemini Initialization ---
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// --- Mock Data ---
const healthData = [
  { name: '1月', score: 78 },
  { name: '2月', score: 82 },
  { name: '3月', score: 80 },
  { name: '4月', score: 85 },
  { name: '5月', score: 88 },
  { name: '6月', score: 92 },
];

const riskDistribution = [
  { name: '低风险', value: 65, color: '#10b981' },
  { name: '中风险', value: 25, color: '#f59e0b' },
  { name: '高风险', value: 10, color: '#ef4444' },
];

// --- Components ---

const ChatModal = ({ isOpen, onClose }: any) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: '您好！我是您的健康助手康小智。您可以问我关于您的健康分、血压或如何缓解工作压力的问题。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const messageToSend = textOverride || input;
    if (!messageToSend.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      });
      
      const data = await response.json();
      const aiText = data.text || "抱歉，我现在无法回答这个问题，请稍后再试。";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "连接助手失败，请检查网络设置。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages(prev => [...prev, { role: 'ai', text: "您的浏览器不支持语音识别，请尝试手动输入。" }]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        handleSend(transcript);
      }
    };

    recognition.start();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-md h-[85vh] sm:h-[600px] rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative z-10 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Brain size={24} />
                </div>
                <div>
                  <h3 className="font-bold">康小智 AI 助手</h3>
                  <p className="text-[10px] opacity-70">实时健康咨询与数据分析</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={16} />
                    <span className="text-xs text-slate-400">正在思考中...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-400 transition-colors">
                <button 
                  onClick={toggleListening}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    isListening ? "bg-red-500 text-white animate-pulse" : "bg-white text-slate-400 hover:text-blue-600"
                  )}
                >
                  <Mic size={20} />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? "正在倾听..." : "问问您的健康数据或建议..."}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 text-slate-800 outline-none"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-opacity shadow-md shadow-blue-100"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-3">AI 建议仅供参考，不作为医疗诊断依据</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Header = () => (
  <header className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">康</div>
      <h1 className="text-xl font-bold text-slate-800 tracking-tight">银行康小智 <span className="text-blue-600">· 智慧工会</span></h1>
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
        <AlertCircle size={20} />
      </button>
      <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
        <img src="https://picsum.photos/seed/banker/100/100" alt="Avatar" referrerPolicy="no-referrer" />
      </div>
    </div>
  </header>
);

const QuickAction = ({ icon: Icon, label, sublabel, color, onClick }: any) => (
  <motion.button 
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group"
  >
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors", color)}>
      <Icon className="text-white" size={24} />
    </div>
    <span className="text-sm font-semibold text-slate-800">{label}</span>
    <span className="text-[10px] text-slate-400 mt-1">{sublabel}</span>
  </motion.button>
);

const ServiceCard = ({ title, description, icon: Icon, badge, color, onClick }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
    <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-transform group-hover:scale-110", color)} />
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2.5 rounded-xl", color)}>
        <Icon className="text-white" size={20} />
      </div>
      {badge && (
        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
          {badge}
        </span>
      )}
    </div>
    <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    <button 
      onClick={onClick}
      className="mt-4 flex items-center text-xs font-bold text-blue-600 group-hover:gap-2 transition-all"
    >
      立即开启 <ChevronRight size={14} />
    </button>
  </div>
);

const SuperPowerModal = ({ isOpen, onClose }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10"
        >
          <div className="p-8">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <ShieldCheck className="text-indigo-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">“超能宝” 癌症预警方案</h2>
            <p className="text-slate-500 text-sm mb-8">整合AICRL预警技术，提前3-5年锁定风险。</p>
            
            <div className="grid grid-cols-1 gap-4 mb-8">
              {[
                { icon: BarChart3, title: "深度筛查", desc: "多维代谢分析与基因组学扫描", color: "text-indigo-600", bg: "bg-indigo-50" },
                { icon: User, title: "名医解读", desc: "三甲专家 1对1 深度报告解析", color: "text-purple-600", bg: "bg-purple-50" },
                { icon: ShieldCheck, title: "全程托管", desc: "专属管家提供全流程健康随访", color: "text-blue-600", bg: "bg-blue-50" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                    <item.icon className={item.color} size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={onClose}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
            >
              预约专家咨询
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const HypertensionModal = ({ isOpen, onClose }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10"
        >
          <div className="p-8">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Heart className="text-rose-500" size={32} fill="currentColor" fillOpacity={0.2} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">“稳赢 120/80” 血压管理</h2>
            <p className="text-slate-500 text-sm mb-8">针对职场高压环境，实现血压平稳达标。</p>
            
            <div className="grid grid-cols-1 gap-4 mb-8">
              {[
                { icon: Activity, title: "智能同步", desc: "专业级设备，数据自动上传云端", color: "text-rose-500", bg: "bg-rose-50" },
                { icon: AlertCircle, title: "异常预警", desc: "数值异常，AI与管家双重提醒", color: "text-orange-500", bg: "bg-orange-50" },
                { icon: Stethoscope, title: "膳食处方", desc: "营养师定制低盐减压食谱", color: "text-blue-500", bg: "bg-blue-50" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                    <item.icon className={item.color} size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={onClose}
              className="w-full py-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 active:scale-[0.98]"
            >
              立即加入计划
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const DiabetesModal = ({ isOpen, onClose }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10"
        >
          <div className="p-8">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <TrendingUp className="text-amber-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">“糖稳保” 血糖管理</h2>
            <p className="text-slate-500 text-sm mb-8">全周期血糖管理，让控糖科学有效。</p>
            
            <div className="grid grid-cols-1 gap-4 mb-8">
              {[
                { icon: Activity, title: "动态监测", desc: "支持CGM监测，掌握波动规律", color: "text-amber-500", bg: "bg-amber-50" },
                { icon: TrendingUp, title: "运动干预", desc: "AI推荐最佳运动时机与强度", color: "text-emerald-500", bg: "bg-emerald-50" },
                { icon: ShieldCheck, title: "并发症筛查", desc: "定期眼底、肾脏等关键指标评估", color: "text-blue-500", bg: "bg-blue-50" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                    <item.icon className={item.color} size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={onClose}
              className="w-full py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-100 active:scale-[0.98]"
            >
              开启控糖之旅
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const PersonalizationModal = ({ isOpen, onClose, onSelect }: any) => {
  const options = [
    { id: 'weight', label: '体重管理', icon: '⚖️', desc: '关注 BMI 与体脂率' },
    { id: 'belly', label: '腹部减脂', icon: '🏃', desc: '告别“大肚子”，关注腰围' },
    { id: 'sleep', label: '睡眠改善', icon: '🌙', desc: '提升深度睡眠质量' },
    { id: 'eye', label: '视力保护', icon: '👁️', desc: '缓解长时间用眼疲劳' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">定制您的关注点</h2>
              <p className="text-slate-500 text-sm mb-6">选择您最关心的健康维度，我们将为您优先呈现相关数据。</p>
              <div className="grid grid-cols-1 gap-3">
                {options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { onSelect(opt); onClose(); }}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-blue-600">{opt.label}</p>
                      <p className="text-xs text-slate-400">{opt.desc}</p>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-slate-300 group-hover:text-blue-400" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AIMentalModal = ({ isOpen, onClose }: any) => {
  const [step, setStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAssessment = async () => {
    setIsRecording(false);
    setStep(1);
    setIsLoading(true);

    // Mock transcription for demo purposes
    const mockTranscription = "最近支行任务比较重，感觉压力有点大，晚上睡不好。";
    
    try {
      const response = await fetch('/api/mental-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription: mockTranscription })
      });
      const data = await response.json();
      setAssessmentResult(data.text || "评估失败，请稍后再试。");
      setStep(2);
    } catch (error) {
      console.error("Assessment Error:", error);
      setAssessmentResult("连接评估中心失败，请检查网络。");
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { title: "AI 压力评估", desc: "请按住麦克风，描述您最近的工作状态（约30秒）" },
    { title: "分析中...", desc: "正在通过语音特征识别您的情绪压力水平..." },
    { title: "评估结果", desc: assessmentResult }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => { onClose(); setStep(0); }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="text-blue-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{steps[step].title}</h2>
              <p className="text-slate-500 mb-8">{steps[step].desc}</p>

              {step === 0 && (
                <div className="flex flex-col items-center">
                  <motion.button
                    animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    onMouseDown={() => setIsRecording(true)}
                    onMouseUp={handleAssessment}
                    onTouchStart={() => setIsRecording(true)}
                    onTouchEnd={handleAssessment}
                    className={cn(
                      "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg",
                      isRecording ? "bg-red-500 shadow-red-200" : "bg-blue-600 shadow-blue-200"
                    )}
                  >
                    <Mic className="text-white" size={32} />
                  </motion.button>
                  <span className="mt-4 text-xs text-slate-400 font-medium">长按开始语音评估</span>
                </div>
              )}

              {step === 1 && (
                <div className="flex justify-center gap-1 h-8 items-end">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: [10, 32, 10] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      className="w-1.5 bg-blue-600 rounded-full"
                    />
                  ))}
                </div>
              )}

              {step === 2 && (
                <button 
                  onClick={() => { onClose(); setStep(0); }}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  我知道了
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const InsuranceModal = ({ isOpen, onClose, data }: any) => {
  if (!data) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10"
          >
            <div className="p-8">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner", data.bg)}>
                <data.icon className={data.color} size={32} />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-slate-900">{data.title}</h2>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded uppercase">{data.age}</span>
              </div>
              <p className="text-slate-500 text-sm mb-8">专属保险保障与健康干预条款</p>
              
              <div className="space-y-4 mb-8">
                {data.benefits.map((b: any, i: number) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 group hover:border-blue-200 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <b.icon className="text-blue-500" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 mb-1">{b.term}</p>
                      <p className="text-[10px] text-slate-400">保障范围：{b.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">{b.amount}</p>
                      <p className="text-[9px] text-slate-400 uppercase font-bold">保额/价值</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
              >
                我知道了
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const HardwarePlanModal = ({ isOpen, onClose, plan }: any) => {
  if (!plan) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10"
          >
            <div className="p-8">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner", plan.bg)}>
                <Calendar className={plan.color} size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{plan.title}</h2>
              <p className="text-slate-500 text-sm mb-8">{plan.subtitle}</p>
              
              <div className="space-y-3 mb-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">包含硬件与服务</p>
                <div className="grid grid-cols-1 gap-3">
                  {plan.services.map((s: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span className="text-sm text-slate-700 font-medium">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5 mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">月租金 (工会专项价格)</p>
                  <p className="text-2xl font-bold text-white">¥{plan.price}<span className="text-xs font-normal opacity-60">/月</span></p>
                </div>
                <div className="px-3 py-1 bg-blue-600 rounded-lg text-[10px] font-bold text-white uppercase">
                  零采购压力
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
              >
                立即申请方案演示
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const PersonalHealthReport = () => {
  const metrics = [
    { label: '血压 (mmHg)', personal: 118, normal: 120, unit: '收缩压', status: '理想' },
    { label: '心率 (bpm)', personal: 72, normal: 75, unit: '次/分', status: '稳定' },
    { label: 'BMI 指数', personal: 22.5, normal: 22, unit: '指数', status: '标准' },
    { label: '睡眠时长 (h)', personal: 7.5, normal: 8, unit: '小时', status: '充足' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">个人健康报告</h2>
            <p className="text-xs text-slate-400">基于您的实时监测数据分析</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-2xl">
            <BarChart3 className="text-orange-600" size={24} />
          </div>
        </div>

        <div className="space-y-6">
          {metrics.map((m, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-700">{m.label}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">{m.status}</span>
              </div>
              <div className="relative h-12 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center px-4">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-bold">您的数值</p>
                    <p className="text-sm font-bold text-blue-600">{m.personal} <span className="text-[10px] font-normal opacity-60">{m.unit}</span></p>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <p className="text-[9px] text-slate-400 uppercase font-bold">参考标准</p>
                    <p className="text-sm font-bold text-slate-600">{m.normal} <span className="text-[10px] font-normal opacity-60">{m.unit}</span></p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-blue-500" style={{ width: `${(m.personal / (m.normal * 1.2)) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Brain size={20} className="text-blue-400" />
          </div>
          <h3 className="font-bold">AI 健康总结</h3>
        </div>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            您的整体健康资产评估为 <span className="text-white font-bold">“优秀”</span>。血压与心率均处于理想区间，体现了良好的心血管调节能力。
          </p>
          <p>
            <span className="text-blue-400 font-bold">建议：</span>近期工作强度适中，建议继续保持当前的规律作息。您的 BMI 指数非常标准，可适当增加力量训练以进一步提升基础代谢。
          </p>
        </div>
        <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold transition-all">
          下载完整 PDF 报告
        </button>
      </div>
    </div>
  );
};

const ProfileDetailModal = ({ isOpen, onClose, data }: any) => {
  if (!data) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10"
          >
            <div className="p-8">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner", data.bg)}>
                <data.icon className={data.color} size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{data.label}</h2>
              <p className="text-slate-500 text-sm mb-8">{data.sub}</p>
              
              <div className="space-y-4 mb-8">
                {data.details.map((item: any, i: number) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 mb-1">{item.title}</p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                        item.statusColor || "bg-blue-100 text-blue-600"
                      )}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
              >
                返回
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ProfileView = ({ onMenuClick }: any) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* User Header */}
    <section className="flex items-center gap-4 p-2">
      <div className="relative">
        <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-lg shadow-blue-100">
          <img 
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" 
            alt="Avatar" 
            className="w-full h-full rounded-[24px] object-cover border-2 border-white bg-blue-50"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg border-2 border-white flex items-center justify-center">
          <ShieldCheck size={12} className="text-white" />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">张建国</h2>
        <p className="text-xs text-slate-500 font-medium">某国有银行 · 某支行行长</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">工会精英会员</span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">已认证</span>
        </div>
      </div>
    </section>

    {/* Stats Grid */}
    <section className="grid grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">累计健康积分</p>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold text-slate-900">12,840</span>
          <span className="text-[10px] text-emerald-500 font-bold mb-1">+120</span>
        </div>
      </div>
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">健康打卡天数</p>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold text-slate-900">156</span>
          <span className="text-[10px] text-slate-400 font-bold mb-1">天</span>
        </div>
      </div>
    </section>

    {/* Menu List */}
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {[
        { 
          icon: Calendar, label: '我的预约', sub: '3个待执行', color: 'text-blue-500', bg: 'bg-blue-50',
          details: [
            { title: '专家门诊挂号', desc: '北京协和医院 - 心内科', status: '待就诊', statusColor: 'bg-amber-100 text-amber-600' },
            { term: '年度深度体检', desc: '美年大健康 - 旗舰店', status: '已预约', statusColor: 'bg-blue-100 text-blue-600' },
            { title: '工作室方案演示', desc: '支行健康工作室 (方案B)', status: '进行中', statusColor: 'bg-emerald-100 text-emerald-600' }
          ]
        },
        { 
          icon: FileText, label: '健康档案', sub: '电子病历/体检报告', color: 'text-emerald-500', bg: 'bg-emerald-50',
          details: [
            { title: '2025年度体检报告', desc: '综合评分：92分', status: '已生成' },
            { title: '电子病历档案', desc: '包含近3年就诊记录', status: '已加密' },
            { title: '实时监测数据', desc: '血压/心率历史趋势', status: '同步中' }
          ]
        },
        { 
          icon: Users, label: '家属管理', sub: '已关联 2 位家属', color: 'text-purple-500', bg: 'bg-purple-50',
          details: [
            { title: '配偶：李芳', desc: '已开启“超能宝”预警方案', status: '保障中' },
            { title: '父亲：张大山', desc: '已开启“金色晚年”居家康养', status: '保障中' },
            { title: '家属体检权益', desc: '剩余 1 次免费体检名额', status: '可使用', statusColor: 'bg-orange-100 text-orange-600' }
          ]
        },
        { 
          icon: CreditCard, label: '我的保单', sub: '工会专属保障计划', color: 'text-orange-500', bg: 'bg-orange-50',
          details: [
            { title: '重大疾病专项险', desc: '保额：50.0万', status: '有效' },
            { title: '职场意外伤害险', desc: '保额：100.0万', status: '有效' },
            { title: '慢病长期护理险', desc: '保额：20.0万', status: '有效' }
          ]
        },
        { 
          icon: Settings, label: '个人设置', sub: '账号与隐私安全', color: 'text-slate-500', bg: 'bg-slate-50',
          details: [
            { title: '账号安全', desc: '手机号/邮箱已绑定', status: '安全' },
            { title: '隐私控制', desc: '健康数据仅限本人可见', status: '已开启' },
            { title: '消息通知', desc: '实时预警推送已开启', status: '正常' }
          ]
        },
      ].map((item, i) => (
        <button key={i} onClick={() => onMenuClick(item)} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
            <item.icon className={item.color} size={20} />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-bold text-slate-800 text-sm">{item.label}</h4>
            <p className="text-[10px] text-slate-400">{item.sub}</p>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>
      ))}
    </section>

    {/* Logout Button */}
    <button className="w-full py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 hover:text-rose-500 transition-all">
      <LogOut size={18} />
      <span>退出登录</span>
    </button>
  </div>
);

const ServiceView = ({ onPlanSelect, onInsuranceSelect }: any) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <section>
      <h2 className="text-lg font-bold text-slate-800 mb-4">全生命周期管理</h2>
      <div className="space-y-3">
        {[
          { 
            age: '25-34岁', title: '生育备孕期', desc: '优生优育指导，职场心理调适', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50',
            benefits: [
              { term: '优生优育保障', amount: '50.0万', desc: '孕期并发症及新生儿健康保障', icon: Baby },
              { term: '职场心理咨询', amount: '1.0万/年', desc: '专业心理导师 1对1 职场压力调适', icon: Brain },
              { term: '产后康复补贴', amount: '2.0万', desc: '工会专属产后身心康复专项基金', icon: Sparkles }
            ]
          },
          { 
            age: '35-44岁', title: '抗衰启动期', desc: '代谢管理，心血管风险早筛', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50',
            benefits: [
              { term: '代谢疾病专项险', amount: '30.0万', desc: '针对糖尿病、高血脂等代谢类疾病', icon: Activity },
              { term: '心血管风险筛查', amount: '5000/年', desc: '年度深度心脏及血管功能评估', icon: HeartPulse },
              { term: '亚健康调理金', amount: '1.0万', desc: '用于工会指定的亚健康干预疗程', icon: Zap }
            ]
          },
          { 
            age: '45-54岁', title: '慢病干预组', desc: '三高精准管理，更年期关怀', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50',
            benefits: [
              { term: '三高并发症保险', amount: '20.0万', desc: '覆盖高血压、高血糖引发的并发症', icon: ShieldAlert },
              { term: '慢病用药补贴', amount: '3000/年', desc: '工会指定药房慢病用药专属补贴', icon: Pill },
              { term: '长期护理保障', amount: '50.0万', desc: '针对重大慢病导致的长期护理需求', icon: UserPlus }
            ]
          },
          { 
            age: '退休人员', title: '金色晚年组', desc: '居家康养，视频医生定期随访', icon: Award, color: 'text-purple-500', bg: 'bg-purple-50',
            benefits: [
              { term: '居家康养服务包', amount: '5.0万/年', desc: '包含居家适老化改造及上门护理', icon: Home },
              { term: '视频医生随访', amount: '无限次', desc: '全天候三甲医生在线视频咨询', icon: Video },
              { term: '意外骨折专项险', amount: '10.0万', desc: '针对老年人高发的意外骨折保障', icon: Stethoscope }
            ]
          },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => onInsuranceSelect(item)}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all text-left"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
              <item.icon className={item.color} size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{item.age}</span>
              </div>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-800 mb-4">工会健康工作室 (硬件租赁)</h2>
      <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Calendar size={100} />
        </div>
        <h3 className="text-xl font-bold mb-2">轻量化落地模式</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">提供多功能医疗床、血氧灯、多维导入仪等硬件配置。工会仅需支付月租金，零采购压力。</p>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onPlanSelect({
              title: '方案 A：基础健康站',
              subtitle: '满足支行日常基础检测需求',
              services: ['智能血压计 (实时同步)', '基础体检包 (血氧/心率)', '远程医生视频终端'],
              price: '2,999',
              color: 'text-blue-400',
              bg: 'bg-blue-400/10'
            })}
            className="p-3 bg-white/10 rounded-xl border border-white/10 text-left hover:bg-white/20 transition-all"
          >
            <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">方案 A</p>
            <p className="text-sm font-bold">基础健康站</p>
          </button>
          <button 
            onClick={() => onPlanSelect({
              title: '方案 B：全能工作室',
              subtitle: '打造支行旗舰级健康空间',
              services: ['多功能医疗床 (康复理疗)', '多维导入仪 (缓解疲劳)', 'AI 心理评估终端', '智能血氧灯 (环境感知)'],
              price: '5,999',
              color: 'text-purple-400',
              bg: 'bg-purple-400/10'
            })}
            className="p-3 bg-white/10 rounded-xl border border-white/10 text-left hover:bg-white/20 transition-all"
          >
            <p className="text-[10px] font-bold text-purple-400 uppercase mb-1">方案 B</p>
            <p className="text-sm font-bold">全能工作室</p>
          </button>
        </div>
        <button className="w-full mt-6 py-3 bg-blue-600 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
          预约方案演示
        </button>
      </div>
    </section>
  </div>
);

export default function App() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSuperPowerOpen, setIsSuperPowerOpen] = useState(false);
  const [isHypertensionOpen, setIsHypertensionOpen] = useState(false);
  const [isDiabetesOpen, setIsDiabetesOpen] = useState(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [isHardwarePlanOpen, setIsHardwarePlanOpen] = useState(false);
  const [isInsuranceOpen, setIsInsuranceOpen] = useState(false);
  const [isProfileDetailOpen, setIsProfileDetailOpen] = useState(false);
  const [selectedHardwarePlan, setSelectedHardwarePlan] = useState<any>(null);
  const [selectedInsuranceData, setSelectedInsuranceData] = useState<any>(null);
  const [selectedProfileMenu, setSelectedProfileMenu] = useState<any>(null);
  const [userFocus, setUserFocus] = useState({ id: 'weight', label: '体重管理', icon: '⚖️' });
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      <Header />
      
      <main className="max-w-md mx-auto px-6 pt-6 space-y-8">
        
        {activeTab === 'home' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* User Health Status Summary */}
            <section className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <ShieldCheck size={80} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold backdrop-blur-md">个人健康资产</span>
                  <span className="text-xs opacity-80">更新于: 今日 09:30</span>
                </div>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-5xl font-bold tracking-tighter">92</span>
                  <span className="text-lg opacity-80 mb-1">健康分</span>
                  <div className="ml-auto flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-full">
                    <TrendingUp size={12} /> +2.4%
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider mb-1">心率</p>
                    <p className="font-bold">72 <span className="text-[10px] opacity-60 font-normal">bpm</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider mb-1">血压</p>
                    <p className="font-bold">118/76 <span className="text-[10px] opacity-60 font-normal">mmHg</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider mb-1">心理</p>
                    <p className="font-bold">良好</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Personalized Focus Section */}
            <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">
                  {userFocus.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">当前关注：{userFocus.label}</h3>
                  <p className="text-[10px] text-slate-400">数据已同步，点击右侧定制</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPersonalizeOpen(true)}
                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                定制关注
              </button>
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-4 gap-3">
              <QuickAction 
                icon={Brain} 
                label="AI心理" 
                sublabel="5min评估" 
                color="bg-purple-500" 
                onClick={() => setIsAIModalOpen(true)}
              />
              <QuickAction 
                icon={MessageSquare} 
                label="健康咨询" 
                sublabel="AI问答" 
                color="bg-indigo-500" 
                onClick={() => setIsChatOpen(true)}
              />
              <QuickAction 
                icon={Calendar} 
                label="挂号绿通" 
                sublabel="三甲直通" 
                color="bg-emerald-500" 
              />
              <QuickAction 
                icon={BarChart3} 
                label="健康报告" 
                sublabel="个人指标分析" 
                color="bg-orange-500" 
                onClick={() => setActiveTab('report')}
              />
            </section>

            {/* Core Services */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">专项健康模块</h2>
                <button onClick={() => setActiveTab('service')} className="text-xs font-bold text-blue-600">全部服务</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <ServiceCard 
                  title="“超能宝”癌症预警"
                  description="针对银行精英人群的高端预防医学方案，整合AICRL预警评估与细胞技术咨询。"
                  icon={ShieldCheck}
                  badge="高端预防"
                  color="bg-indigo-600"
                  onClick={() => setIsSuperPowerOpen(true)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <ServiceCard 
                    title="稳赢 120/80"
                    description="高血压职场干预，智能设备同步，专业团队膳食指导。"
                    icon={Heart}
                    color="bg-rose-500"
                    onClick={() => setIsHypertensionOpen(true)}
                  />
                  <ServiceCard 
                    title="糖稳保"
                    description="血糖全生命周期管理，个性化运动方案，控糖无忧。"
                    icon={Activity}
                    color="bg-amber-500"
                    onClick={() => setIsDiabetesOpen(true)}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'report' && <PersonalHealthReport />}
        {activeTab === 'service' && <ServiceView 
          onPlanSelect={(plan: any) => {
            setSelectedHardwarePlan(plan);
            setIsHardwarePlanOpen(true);
          }} 
          onInsuranceSelect={(data: any) => {
            setSelectedInsuranceData(data);
            setIsInsuranceOpen(true);
          }}
        />}
        {activeTab === 'profile' && <ProfileView onMenuClick={(item: any) => {
          setSelectedProfileMenu(item);
          setIsProfileDetailOpen(true);
        }} />}


        {/* Footer Info */}
        <footer className="text-center pb-8">
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">由 宝丽上元 提供全流程数字化健康托管服务</p>
          <div className="flex justify-center gap-4 mt-4 opacity-20 grayscale">
            <div className="w-12 h-4 bg-slate-300 rounded" />
            <div className="w-12 h-4 bg-slate-300 rounded" />
            <div className="w-12 h-4 bg-slate-300 rounded" />
          </div>
        </footer>

      </main>


      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-8 py-3 flex justify-between items-center z-50">
        <button onClick={() => setActiveTab('home')} className={cn("flex flex-col items-center gap-1", activeTab === 'home' ? "text-blue-600" : "text-slate-400")}>
          <Heart size={20} fill={activeTab === 'home' ? "currentColor" : "none"} />
          <span className="text-[10px] font-bold">首页</span>
        </button>
        <button onClick={() => setActiveTab('service')} className={cn("flex flex-col items-center gap-1", activeTab === 'service' ? "text-blue-600" : "text-slate-400")}>
          <ShieldCheck size={20} />
          <span className="text-[10px] font-bold">服务</span>
        </button>
        <div className="relative -mt-12">
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 border-4 border-white"
          >
            <MessageSquare size={24} />
          </button>
        </div>
        <button onClick={() => setActiveTab('report')} className={cn("flex flex-col items-center gap-1", activeTab === 'report' ? "text-blue-600" : "text-slate-400")}>
          <BarChart3 size={20} />
          <span className="text-[10px] font-bold">数据</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={cn("flex flex-col items-center gap-1", activeTab === 'profile' ? "text-blue-600" : "text-slate-400")}>
          <User size={20} />
          <span className="text-[10px] font-bold">我的</span>
        </button>
      </nav>

      <AIMentalModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <SuperPowerModal isOpen={isSuperPowerOpen} onClose={() => setIsSuperPowerOpen(false)} />
      <HypertensionModal isOpen={isHypertensionOpen} onClose={() => setIsHypertensionOpen(false)} />
      <DiabetesModal isOpen={isDiabetesOpen} onClose={() => setIsDiabetesOpen(false)} />
      <PersonalizationModal 
        isOpen={isPersonalizeOpen} 
        onClose={() => setIsPersonalizeOpen(false)} 
        onSelect={(opt: any) => setUserFocus(opt)}
      />
      <HardwarePlanModal 
        isOpen={isHardwarePlanOpen} 
        onClose={() => setIsHardwarePlanOpen(false)} 
        plan={selectedHardwarePlan}
      />
      <InsuranceModal 
        isOpen={isInsuranceOpen} 
        onClose={() => setIsInsuranceOpen(false)} 
        data={selectedInsuranceData}
      />
      <ProfileDetailModal 
        isOpen={isProfileDetailOpen} 
        onClose={() => setIsProfileDetailOpen(false)} 
        data={selectedProfileMenu}
      />
    </div>
  );
}
