import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Activity, 
  Brain, 
  User, 
  ChevronRight, 
  Mic, 
  Send, 
  ArrowLeft,
  Smile,
  ShieldCheck,
  Calendar,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Components ---

const Card = ({ children, className, onClick }: any) => (
  <div 
    onClick={onClick}
    className={cn("bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer", className)}
  >
    {children}
  </div>
);

const Button = ({ children, className, onClick, variant = 'primary' }: any) => {
  const variants: any = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    outline: "bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50"
  };
  return (
    <button 
      onClick={onClick}
      className={cn("px-4 py-2 rounded-xl font-medium transition-colors text-sm", variants[variant], className)}
    >
      {children}
    </button>
  );
};

// --- Views ---

const HomeView = ({ onNavigate }: any) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-[32px] p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">您好，工会伙伴</h2>
          <p className="text-blue-100 text-sm mb-6">银行康小智，您的智慧健康助手</p>
          <div className="flex gap-3">
            <Button variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-md" onClick={() => onNavigate('chat')}>
              立即咨询 AI
            </Button>
            <Button variant="secondary" className="bg-white text-blue-600" onClick={() => onNavigate('mental')}>
              心理评估
            </Button>
          </div>
        </div>
        <Heart className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12" />
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">今日步数</p>
            <p className="text-lg font-bold">8,432</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
            <Brain size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">压力指数</p>
            <p className="text-lg font-bold">正常</p>
          </div>
        </Card>
      </div>

      {/* Main Services */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800">工会健康服务</h3>
          <span className="text-xs text-blue-600 font-medium">查看全部</span>
        </div>
        <div className="space-y-3">
          {[
            { title: "AI 健康咨询", desc: "全天候解答您的健康疑问", icon: MessageCircle, color: "text-blue-600", bg: "bg-blue-50", view: 'chat' },
            { title: "心理压力评估", desc: "语音识别情绪，科学调节压力", icon: Brain, color: "text-purple-600", bg: "bg-purple-50", view: 'mental' },
            { title: "健康体检报告", desc: "历年体检数据对比分析", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", view: 'reports' },
            { title: "工会福利预约", desc: "预约理疗、健身房等福利", icon: Calendar, color: "text-orange-600", bg: "bg-orange-50", view: 'booking' }
          ].map((s, i) => (
            <Card key={i} onClick={() => onNavigate(s.view)} className="flex items-center gap-4 p-3">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", s.bg)}>
                <s.icon size={24} className={s.color} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{s.title}</h4>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

const ChatView = ({ onBack }: any) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: '您好！我是您的健康管家康小智。今天有什么可以帮您的吗？' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, version: 'employee' })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: '抱歉，我遇到了一点问题，请稍后再试。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500">
      <div className="p-4 bg-white border-b flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h3 className="font-bold text-slate-800">康小智 AI 咨询</h3>
          <p className="text-[10px] text-emerald-500 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            在线为您服务
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
              m.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none"
            )}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75" />
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="描述您的症状或健康疑问..."
            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-opacity"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const MentalView = ({ onBack }: any) => {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const simulateAssessment = async () => {
    setLoading(true);
    // Simulate voice to text and API call
    setTimeout(async () => {
      try {
        const response = await fetch('/api/mental-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcription: "最近工作压力有点大，感觉有点焦虑。" })
        });
        const data = await response.json();
        setResult(data.text);
      } catch (error) {
        setResult("压力指数：中等。建议：尝试深呼吸。");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500">
      <div className="p-4 bg-white border-b flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h3 className="font-bold text-slate-800">心理压力评估</h3>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-8">
        {!result ? (
          <>
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 relative">
              <Brain size={48} />
              {isRecording && (
                <div className="absolute inset-0 border-4 border-purple-400 rounded-full animate-ping opacity-50" />
              )}
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-800">倾诉您的心情</h4>
              <p className="text-sm text-slate-500 px-8">点击下方按钮并说话，康小智将通过语音情绪识别为您分析压力状态</p>
            </div>
            
            <button 
              onClick={() => {
                if (isRecording) {
                  setIsRecording(false);
                  simulateAssessment();
                } else {
                  setIsRecording(true);
                }
              }}
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95",
                isRecording ? "bg-red-500 text-white" : "bg-blue-600 text-white"
              )}
            >
              {isRecording ? <div className="w-6 h-6 bg-white rounded-sm" /> : <Mic size={32} />}
            </button>
            <p className="text-xs text-slate-400">{isRecording ? "正在倾听... 点击结束" : "点击开始录音"}</p>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
            <Card className="p-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Smile size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-800">评估结果</h4>
                <p className="text-blue-600 font-medium">{result}</p>
              </div>
            </Card>
            <Button variant="primary" className="w-full py-4 text-base" onClick={() => setResult(null)}>
              重新评估
            </Button>
          </motion.div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-slate-600">康小智正在深度分析中...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---

const EmployeeApp = ({ onSwitch }: any) => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'chat': return <ChatView onBack={() => setCurrentView('home')} />;
      case 'mental': return <MentalView onBack={() => setCurrentView('home')} />;
      default: return (
        <div className="flex flex-col h-full bg-slate-50">
          {/* Header */}
          <header className="p-4 bg-white flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Heart size={18} />
              </div>
              <h1 className="text-lg font-bold text-slate-800">银行康小智</h1>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <Search size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors relative">
                <Bell size={20} />
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 pb-24">
            {activeTab === 'home' && <HomeView onNavigate={setCurrentView} />}
            {activeTab === 'activity' && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                <Activity size={48} className="opacity-20" />
                <p>健康动态建设中...</p>
              </div>
            )}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">张经理</h3>
                    <p className="text-sm text-slate-500">零售业务部 | 黄金会员</p>
                  </div>
                </Card>
                <div className="space-y-2">
                  {['个人资料', '我的预约', '健康档案', '设置'].map((item, i) => (
                    <Card key={i} className="flex items-center justify-between p-3">
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                      <ChevronRight size={16} className="text-slate-300" />
                    </Card>
                  ))}
                  <Card onClick={onSwitch} className="flex items-center justify-between p-3 border-blue-100 bg-blue-50/30">
                    <span className="text-sm font-bold text-blue-600">切换至 VIP 版</span>
                    <ChevronRight size={16} className="text-blue-600" />
                  </Card>
                </div>
              </div>
            )}
          </main>

          {/* Tab Bar */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 pb-6 z-20">
            {[
              { id: 'home', icon: Heart, label: '首页' },
              { id: 'activity', icon: Activity, label: '动态' },
              { id: 'profile', icon: User, label: '我的' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors",
                  activeTab === tab.id ? "text-blue-600" : "text-slate-400"
                )}
              >
                <tab.icon size={20} />
                <span className="text-[10px] font-bold">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      );
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-slate-50 shadow-2xl overflow-hidden font-sans">
      {renderView()}
    </div>
  );
};

export default EmployeeApp;
