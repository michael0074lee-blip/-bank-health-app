import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Activity, Brain, Coffee, User, Send, Mic, 
  ChevronRight, Bell, Calendar, Award, Info, 
  Wind, Eye, Dumbbell, Utensils, MessageCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from './lib/utils';

// --- Types ---
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// --- Components ---

const Card = ({ children, className, title, subtitle }: any) => (
  <div className={cn("bg-white rounded-3xl p-6 shadow-sm border border-slate-100", className)}>
    {(title || subtitle) && (
      <div className="mb-4">
        {title && <h3 className="text-lg font-bold text-slate-800">{title}</h3>}
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

const HealthMetric = ({ icon: Icon, label, value, unit, color }: any) => (
  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-sm", color)}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-xl font-bold text-slate-800">{value}<span className="text-xs ml-1 font-normal text-slate-400">{unit}</span></p>
    </div>
  </div>
);

const ChatBot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '伙伴您好！我是您的健康管家康小智。今天感觉怎么样？有什么我可以帮您的吗？', sender: 'ai', timestamp: new Date() }
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
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      const aiMsg: Message = { id: (Date.now() + 1).toString(), text: data.text, sender: 'ai', timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 100 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 100 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col md:inset-auto md:bottom-24 md:right-6 md:w-[400px] md:h-[600px] md:rounded-3xl md:shadow-2xl md:border md:border-slate-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="font-bold">康小智 · AI管家</h3>
                <p className="text-[10px] opacity-80">工会关怀 智慧健康</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
            {messages.map(m => (
              <div key={m.id} className={cn("flex", m.sender === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] p-4 rounded-2xl text-sm shadow-sm",
                  m.sender === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="咨询您的健康问题..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button onClick={handleSend} className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform">
              <Send size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Views ---

const HomeView = ({ onChatOpen }: any) => {
  const data = [
    { name: '周一', val: 65 }, { name: '周二', val: 72 }, { name: '周三', val: 68 },
    { name: '周四', val: 85 }, { name: '周五', val: 90 }, { name: '周六', val: 75 }, { name: '周日', val: 80 }
  ];

  return (
    <div className="space-y-6 pb-24">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">早安，伙伴</h1>
          <p className="text-sm text-slate-500">今天也要元气满满哦！</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
          <Bell size={24} className="text-blue-600" />
        </div>
      </header>

      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">今日健康指数</p>
            <h2 className="text-4xl font-bold">85</h2>
          </div>
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
            <Activity size={24} />
          </div>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-white" style={{ width: '85%' }} />
        </div>
        <p className="text-xs text-blue-50 leading-relaxed">
          您的压力水平适中，建议在下午3点进行一次“工位拉伸”，缓解肩颈疲劳。
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <HealthMetric icon={Heart} label="心率" value="72" unit="bpm" color="bg-rose-500" />
        <HealthMetric icon={Brain} label="压力值" value="42" unit="%" color="bg-amber-500" />
      </div>

      <Card title="本周运动趋势" subtitle="步数统计 (单位: 千步)">
        <div className="h-48 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">工会福利 & 关怀</h3>
          <button className="text-blue-600 text-xs font-bold">查看全部</button>
        </div>
        <div className="space-y-3">
          {[
            { icon: Coffee, title: "下午茶能量补给", desc: "今日15:30 员工休息区", color: "bg-orange-50 text-orange-600" },
            { icon: Dumbbell, title: "健身房团课预约", desc: "瑜伽入门 18:00 开始", color: "bg-emerald-50 text-emerald-600" },
            { icon: Award, title: "步数挑战赛", desc: "您当前排名第12位", color: "bg-purple-50 text-purple-600" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors cursor-pointer">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", item.color)}>
                <item.icon size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ExploreView = () => (
  <div className="space-y-6 pb-24">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">健康探索</h2>
    <div className="grid grid-cols-2 gap-4">
      {[
        { icon: Wind, label: "冥想放松", color: "bg-blue-500" },
        { icon: Eye, label: "护眼训练", color: "bg-indigo-500" },
        { icon: Dumbbell, label: "工位拉伸", color: "bg-emerald-500" },
        { icon: Utensils, label: "营养膳食", color: "bg-orange-500" }
      ].map((item, i) => (
        <Card key={i} className="flex flex-col items-center justify-center p-8 gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform", item.color)}>
            <item.icon size={32} />
          </div>
          <span className="font-bold text-slate-700">{item.label}</span>
        </Card>
      ))}
    </div>
    <Card title="健康小知识" className="bg-blue-50 border-blue-100">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <Info size={24} className="text-blue-600" />
        </div>
        <p className="text-sm text-blue-800 leading-relaxed">
          你知道吗？每工作45分钟远眺窗外1分钟，可以有效缓解视疲劳，提升下午的工作效率。
        </p>
      </div>
    </Card>
  </div>
);

const ProfileView = () => (
  <div className="space-y-8 pb-24">
    <div className="flex flex-col items-center py-8">
      <div className="relative">
        <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-xl">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full rounded-[28px] bg-white" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white">
          <Award size={16} />
        </div>
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-800">张小明</h2>
      <p className="text-sm text-slate-500">零售业务部 · 客户经理</p>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <p className="text-xl font-bold text-slate-800">12</p>
        <p className="text-[10px] text-slate-500 uppercase font-bold">连续打卡</p>
      </div>
      <div className="text-center border-x border-slate-100">
        <p className="text-xl font-bold text-slate-800">2.4k</p>
        <p className="text-[10px] text-slate-500 uppercase font-bold">消耗热量</p>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold text-slate-800">85</p>
        <p className="text-[10px] text-slate-500 uppercase font-bold">健康评分</p>
      </div>
    </div>

    <div className="space-y-3">
      {[
        { icon: User, label: "个人资料" },
        { icon: Calendar, label: "我的预约" },
        { icon: Award, label: "成就勋章" },
        { icon: MessageCircle, label: "意见反馈" }
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <item.icon size={20} />
          </div>
          <span className="flex-1 font-bold text-slate-700">{item.label}</span>
          <ChevronRight size={16} className="text-slate-300" />
        </div>
      ))}
    </div>
  </div>
);

// --- Main App ---

export default function EmployeeApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <main className="max-w-md mx-auto px-6 pt-8">
        {activeTab === 'home' && <HomeView onChatOpen={() => setIsChatOpen(true)} />}
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 p-6 z-50">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[32px] p-2 flex items-center justify-between shadow-lg">
          <button onClick={() => setActiveTab('home')} className={cn("flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all", activeTab === 'home' ? "bg-blue-600 text-white shadow-md" : "text-slate-400")}>
            <Activity size={20} />
            <span className="text-[10px] font-bold">首页</span>
          </button>
          <button onClick={() => setActiveTab('explore')} className={cn("flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all", activeTab === 'explore' ? "bg-blue-600 text-white shadow-md" : "text-slate-400")}>
            <Wind size={20} />
            <span className="text-[10px] font-bold">探索</span>
          </button>
          <div className="relative px-2">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl active:scale-90 transition-transform -mt-10 border-4 border-white"
            >
              <Mic size={24} />
            </button>
          </div>
          <button onClick={() => setActiveTab('profile')} className={cn("flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all", activeTab === 'profile' ? "bg-blue-600 text-white shadow-md" : "text-slate-400")}>
            <User size={20} />
            <span className="text-[10px] font-bold">我的</span>
          </button>
        </div>
      </nav>

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
