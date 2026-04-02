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
  Award
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

const ServiceCard = ({ title, description, icon: Icon, badge, color }: any) => (
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
    <button className="mt-4 flex items-center text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
      立即开启 <ChevronRight size={14} />
    </button>
  </div>
);

const AIMentalModal = ({ isOpen, onClose }: any) => {
  const [step, setStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const steps = [
    { title: "AI 压力评估", desc: "请按住麦克风，描述您最近的工作状态（约30秒）" },
    { title: "分析中...", desc: "正在通过语音特征识别您的情绪压力水平..." },
    { title: "评估结果", desc: "压力指数：中等。建议：碎片化冥想5分钟。" }
  ];

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
                    onMouseUp={() => { setIsRecording(false); setStep(1); setTimeout(() => setStep(2), 3000); }}
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
                  onClick={onClose}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  查看详细报告
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ManagementDashboard = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">全行健康资产概览</h2>
          <p className="text-xs text-slate-400">数据驱动的工会福利 ROI 洞察</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-2xl">
          <Award className="text-blue-600" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-blue-600 rounded-2xl text-white">
          <p className="text-[10px] opacity-70 font-bold uppercase mb-1">人均健康资产</p>
          <p className="text-2xl font-bold">¥12,400</p>
          <div className="flex items-center gap-1 text-[10px] mt-2 text-emerald-300">
            <TrendingUp size={10} /> +8.2% 较去年
          </div>
        </div>
        <div className="p-4 bg-slate-900 rounded-2xl text-white">
          <p className="text-[10px] opacity-70 font-bold uppercase mb-1">福利投入 ROI</p>
          <p className="text-2xl font-bold">1 : 3.4</p>
          <div className="flex items-center gap-1 text-[10px] mt-2 text-blue-300">
            <ShieldCheck size={10} /> 风险规避价值
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800">风险分布 (Risk Distribution)</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6">
          {riskDistribution.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-bold text-slate-500">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">季度健康干预成效</h3>
      <div className="space-y-4">
        {[
          { label: '高血压受控率', value: 88, color: 'bg-rose-500', trend: '+12%' },
          { label: 'AI心理干预覆盖', value: 94, color: 'bg-purple-500', trend: '+24%' },
          { label: '重大疾病早筛率', value: 72, color: 'bg-emerald-500', trend: '+18%' },
        ].map(item => (
          <div key={item.label}>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-600">{item.label}</span>
              <span className="text-blue-600">{item.value}% <span className="text-[10px] text-emerald-500 ml-1">{item.trend}</span></span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn("h-full rounded-full", item.color)} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ServiceView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <section>
      <h2 className="text-lg font-bold text-slate-800 mb-4">全生命周期管理</h2>
      <div className="space-y-3">
        {[
          { age: '25-34岁', title: '生育备孕期', desc: '优生优育指导，职场心理调适', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
          { age: '35-44岁', title: '抗衰启动期', desc: '代谢管理，心血管风险早筛', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50' },
          { age: '45-54岁', title: '慢病干预组', desc: '三高精准管理，更年期关怀', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
          { age: '退休人员', title: '金色晚年组', desc: '居家康养，视频医生定期随访', icon: Award, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
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
          </div>
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
          <div className="p-3 bg-white/10 rounded-xl border border-white/10">
            <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">方案 A</p>
            <p className="text-sm font-bold">基础健康站</p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl border border-white/10">
            <p className="text-[10px] font-bold text-purple-400 uppercase mb-1">方案 B</p>
            <p className="text-sm font-bold">全能工作室</p>
          </div>
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
                icon={Video} 
                label="视频医生" 
                sublabel="7x24在线" 
                color="bg-blue-500" 
              />
              <QuickAction 
                icon={Calendar} 
                label="挂号绿通" 
                sublabel="三甲直通" 
                color="bg-emerald-500" 
              />
              <QuickAction 
                icon={BarChart3} 
                label="资产报告" 
                sublabel="ROI分析" 
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
                />
                <div className="grid grid-cols-2 gap-4">
                  <ServiceCard 
                    title="稳赢 120/80"
                    description="高血压职场干预，智能设备同步，专业团队膳食指导。"
                    icon={Heart}
                    color="bg-rose-500"
                  />
                  <ServiceCard 
                    title="糖稳保"
                    description="血糖全生命周期管理，个性化运动方案，控糖无忧。"
                    icon={Activity}
                    color="bg-amber-500"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'report' && <ManagementDashboard />}
        {activeTab === 'service' && <ServiceView />}


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


      {/* Bottom Navigation */}
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
            onClick={() => setIsAIModalOpen(true)}
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 border-4 border-white"
          >
            <Brain size={24} />
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
    </div>
  );
}
