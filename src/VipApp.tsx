import React, { useState } from 'react';
import { 
  Crown, Globe, HeartPulse, UserCheck, ChevronRight, Award, PhoneCall, Activity, Star, Menu, Gem, 
  Calendar, ShieldCheck, Settings, Users, ArrowRight, X, Clock, MapPin, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from './lib/utils';

// --- Components ---

const PremiumCard = ({ children, className, onClick }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    onClick={onClick}
    className={cn("bg-[#1A1A1A] border border-[#333] rounded-[32px] p-6 shadow-2xl relative overflow-hidden group cursor-pointer", className)}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {children}
  </motion.div>
);

const GoldButton = ({ children, onClick, className }: any) => (
  <button 
    onClick={onClick}
    className={cn("bg-gradient-to-r from-[#D4AF37] to-[#F5E0A3] text-black font-bold py-4 px-8 rounded-2xl shadow-[0_8px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_12px_25px_rgba(212,175,55,0.4)] transition-all active:scale-95", className)}
  >
    {children}
  </button>
);

const ServiceModal = ({ isOpen, onClose, service }: any) => {
  if (!service) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-[#1A1A1A] w-full max-w-md rounded-[40px] border border-[#333] overflow-hidden shadow-2xl relative z-10">
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2E] rounded-2xl flex items-center justify-center mb-6 shadow-xl"><service.icon size={32} className="text-black" /></div>
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-2">{service.title}</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">{service.longDesc}</p>
              <div className="space-y-4 mb-10">
                {service.features.map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-slate-200"><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /><span className="text-sm font-medium">{f}</span></div>
                ))}
              </div>
              <GoldButton onClick={onClose} className="w-full">立即预约私享服务</GoldButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const DietaryPlanModal = ({ isOpen, onClose }: any) => {
  const plan = {
    title: "高净值私享膳食方案",
    subtitle: "基于您的基因组学与代谢组学定制",
    categories: [
      {
        name: "早餐 · 能量唤醒",
        items: ["有机奇亚籽燕麦碗", "野生蓝莓与麦卢卡蜂蜜", "冷萃低酸咖啡"],
        time: "07:30 - 08:30"
      },
      {
        name: "午餐 · 精准营养",
        items: ["深海银鳕鱼配芦笋", "藜麦牛油果沙拉", "喜马拉雅岩盐调味"],
        time: "12:00 - 13:00"
      },
      {
        name: "晚餐 · 修复滋养",
        items: ["慢炖走地鸡清汤", "清蒸时令有机时蔬", "少量复合碳水"],
        time: "18:00 - 19:00"
      }
    ],
    supplements: ["定制化复合维生素 (AM/PM)", "高纯度 Omega-3", "益生菌精准配方"]
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-[#1A1A1A] w-full max-w-md rounded-[40px] border border-[#333] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]">
            <div className="p-8 overflow-y-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2E] rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <HeartPulse size={32} className="text-black" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-2">{plan.title}</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">{plan.subtitle}</p>
              
              <div className="space-y-6 mb-10">
                {plan.categories.map((cat, i) => (
                  <div key={i} className="p-5 bg-[#0A0A0A] rounded-3xl border border-[#333]">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                      <span className="text-[10px] text-[#D4AF37] font-mono">{cat.time}</span>
                    </div>
                    <ul className="space-y-2">
                      {cat.items.map((item, j) => (
                        <li key={j} className="text-xs text-slate-400 flex items-center gap-2">
                          <div className="w-1 h-1 bg-[#D4AF37] rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                <div className="p-5 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-3xl border border-[#D4AF37]/20">
                  <h4 className="text-sm font-bold text-[#D4AF37] mb-3 flex items-center gap-2">
                    <Gem size={16} /> 专属补剂建议
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.supplements.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-[#1A1A1A] text-[10px] text-slate-300 rounded-full border border-[#333]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <GoldButton onClick={onClose} className="w-full">确认并同步至私享厨师</GoldButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Tiers Definition ---
const VIP_TIERS = [
  { id: 'gold', name: '黄金会员', aum: '500万+', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' },
  { id: 'diamond', name: '钻石会员', aum: '1000万+', color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10', border: 'border-[#D4AF37]/20' },
  { id: 'private', name: '私行客户', aum: '5000万+', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' }
];

const TierComparisonModal = ({ isOpen, onClose, currentTier }: any) => {
  const tiers = [
    { 
      name: "黄金会员", 
      aum: "500万+", 
      services: ["国内三甲绿通 (3次/年)", "年度深度体检", "AI健康管家"],
      style: "border-slate-500/30 text-slate-400"
    },
    { 
      name: "钻石会员", 
      aum: "1000万+", 
      services: ["全球医疗绿通", "24h 私人医生", "长寿管理基础版", "家属健康共享 (2人)"],
      style: "border-[#D4AF37]/50 text-[#D4AF37] bg-[#D4AF37]/5"
    },
    { 
      name: "私行客户", 
      aum: "5000万+", 
      services: ["全球顶级名医会诊", "家族健康传承计划", "全球紧急救援 (包机)", "细胞级抗衰疗程", "1对1 驻场医生"],
      style: "border-purple-500/50 text-purple-400 bg-purple-500/5"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#1A1A1A] w-full max-w-lg rounded-[40px] border border-[#333] overflow-hidden shadow-2xl relative z-10 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-white">权益等级差异化服务</h2>
              <button onClick={onClose} className="p-2 text-slate-500"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              {tiers.map((t, i) => (
                <div key={i} className={cn("p-6 rounded-3xl border transition-all", t.style)}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{t.name}</h3>
                      <p className="text-[10px] opacity-60 uppercase tracking-widest">AUM 门槛: {t.aum}</p>
                    </div>
                    {currentTier === t.name.toLowerCase() && <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">当前等级</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {t.services.map((s, j) => (
                      <div key={j} className="flex items-center gap-2 text-[11px]">
                        <div className="w-1 h-1 rounded-full bg-current" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-[10px] text-slate-500 text-center leading-relaxed">
              * 健康服务作为银行核心非金融权益，旨在为您提供全方位的生命守护。<br />
              资产配置越高，享有的全球医疗资源优先级越高。
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Views ---

const HomeView = ({ onServiceClick, onDietClick, onTierClick }: any) => {
  const currentTier = VIP_TIERS[1]; // Default to Diamond

  const services = [
    { title: "全球医疗绿通", desc: "直通梅奥诊所、约翰霍普金斯等全球顶尖医疗机构。", longDesc: "为您在全球范围内整合最优质的医疗资源。提供全流程的管家式陪同。", icon: Globe, features: ["全球Top 10医院直通车", "国内百强名医48小时预约", "专属医疗翻译与海外陪诊"], tier: '钻石及以上' },
    { title: "长寿管理中心", desc: "基于基因组学的精准抗衰与细胞健康管理方案。", longDesc: "通过深度基因检测、端粒长度评估及细胞活性分析，为您定制个性化的长寿干预方案。", icon: Gem, features: ["全基因组深度测序评估", "端粒长度动态监测", "定制化细胞活化疗程"], tier: '钻石及以上' },
    { title: "家族健康传承", desc: "财富可以传承，健康更应延续。为家族成员提供全方位管理。", longDesc: "专为私行客户定制，涵盖家族遗传病筛查、多代成员健康档案托管及专属家庭医生。", icon: Users, features: ["家族遗传风险图谱", "三代成员联合健康管理", "专属家庭医生驻场咨询"], tier: '私行专属' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Tier Indicator */}
      <section onClick={onTierClick} className="cursor-pointer">
        <div className={cn("p-4 rounded-2xl border flex items-center justify-between", currentTier.bg, currentTier.border)}>
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", currentTier.bg)}>
              <Award size={18} className={currentTier.color} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">当前权益等级</p>
              <h4 className={cn("text-sm font-bold", currentTier.color)}>{currentTier.name} (AUM {currentTier.aum})</h4>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
            查看等级差异 <ChevronRight size={12} />
          </div>
        </div>
      </section>

      <section className="relative h-64 rounded-[40px] overflow-hidden shadow-2xl">
        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" alt="Luxury" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <h2 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">尊享健康，<span className="text-[#D4AF37]">传承生命之美</span></h2>
          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">Your Health, Our Legacy</p>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-serif font-bold text-[#D4AF37]">健康资产概览</h3>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Updated: Just Now</span>
        </div>
        <PremiumCard onClick={onDietClick} className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10"><HeartPulse className="text-[#D4AF37]" size={24} /></div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">健康综合指数</p>
              <p className="text-3xl font-serif font-bold text-white">98.5</p>
            </div>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5E0A3]" style={{ width: '98.5%' }} />
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">您的各项生理指标均处于巅峰状态。建议继续保持当前的<span className="text-[#D4AF37] underline decoration-dotted underline-offset-4">高净值膳食方案</span>。</p>
        </PremiumCard>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between"><h3 className="text-lg font-serif font-bold text-[#D4AF37]">私享核心服务</h3><Award size={20} className="text-[#D4AF37] opacity-50" /></div>
        <div className="space-y-4">
          {services.map((s, i) => (
            <PremiumCard key={i} onClick={() => onServiceClick(s)} className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2E] rounded-2xl flex items-center justify-center shrink-0 shadow-lg"><s.icon size={28} className="text-black" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-serif font-bold text-white text-base">{s.title}</h4>
                  <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] text-[#D4AF37] font-bold uppercase">{s.tier}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
              <ChevronRight size={20} className="text-[#D4AF37] opacity-30" />
            </PremiumCard>
          ))}
        </div>
      </section>
    </div>
  );
};

const AssetsView = () => {
  const data = [
    { name: 'Jan', value: 92 }, { name: 'Feb', value: 94 }, { name: 'Mar', value: 93 },
    { name: 'Apr', value: 96 }, { name: 'May', value: 97 }, { name: 'Jun', value: 98.5 }
  ];
  const riskData = [{ name: 'Low', value: 85 }, { name: 'Med', value: 10 }, { name: 'High', value: 5 }];
  const COLORS = ['#D4AF37', '#333', '#1A1A1A'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h3 className="text-2xl font-serif font-bold text-[#D4AF37] mb-6">健康资产分析</h3>
      
      <PremiumCard className="h-64">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">资产增值趋势</p>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis hide domain={[90, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }} />
            <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
          </AreaChart>
        </ResponsiveContainer>
      </PremiumCard>

      <div className="grid grid-cols-2 gap-4">
        <PremiumCard className="flex flex-col items-center justify-center text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">风险暴露水平</p>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskData} innerRadius={30} outerRadius={45} paddingAngle={5} dataKey="value">
                  {riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-lg font-serif font-bold text-emerald-500">极低风险</p>
        </PremiumCard>
        <PremiumCard className="flex flex-col justify-between">
          <p className="text-[10px] text-slate-500 font-bold uppercase">核心指标</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center"><span className="text-[10px] text-slate-400">心血管</span><span className="text-xs font-bold text-white">优秀</span></div>
            <div className="flex justify-between items-center"><span className="text-[10px] text-slate-400">代谢</span><span className="text-xs font-bold text-white">理想</span></div>
            <div className="flex justify-between items-center"><span className="text-[10px] text-slate-400">睡眠</span><span className="text-xs font-bold text-white">充足</span></div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
};

const ScheduleView = () => {
  const events = [
    { title: "私人医生视频随访", time: "明天 10:00", location: "线上视频会议", icon: UserCheck },
    { title: "年度深度基因检测", time: "下周三 09:30", location: "上海长寿管理中心", icon: Gem },
    { title: "全球名医联合会诊", time: "4月15日 14:00", location: "梅奥诊所 (远程)", icon: Globe }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h3 className="text-2xl font-serif font-bold text-[#D4AF37] mb-6">私享日程</h3>
      <div className="space-y-4">
        {events.map((e, i) => (
          <PremiumCard key={i} className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#333] rounded-2xl flex items-center justify-center shrink-0"><e.icon size={20} className="text-[#D4AF37]" /></div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-sm mb-1">{e.title}</h4>
              <div className="flex items-center gap-3 text-[10px] text-slate-500">
                <div className="flex items-center gap-1"><Clock size={10} /> {e.time}</div>
                <div className="flex items-center gap-1"><MapPin size={10} /> {e.location}</div>
              </div>
            </div>
            <button className="p-2 text-[#D4AF37] opacity-50"><ChevronRight size={16} /></button>
          </PremiumCard>
        ))}
      </div>
      <GoldButton className="w-full">预约新服务</GoldButton>
    </div>
  );
};

const MoreView = ({ onSwitch }: any) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <section className="flex items-center gap-4 p-2">
      <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#D4AF37] to-[#AA8B2E] p-1 shadow-xl">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=VIP" alt="Avatar" className="w-full h-full rounded-[24px] bg-slate-800" />
      </div>
      <div>
        <h2 className="text-xl font-serif font-bold text-white">尊敬的客户</h2>
        <p className="text-xs text-[#D4AF37] font-medium tracking-widest uppercase">Diamond VIP Member</p>
        <div className="mt-2 flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[10px] text-slate-500">专属管家在线</span></div>
      </div>
    </section>

    <section className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-[32px] p-6 border border-[#D4AF37]/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-serif font-bold text-[#D4AF37] uppercase tracking-widest">您的专属私行顾问</h3>
        <div className="px-2 py-0.5 bg-[#D4AF37] rounded text-[8px] text-black font-bold uppercase">已就绪</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#333]">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Manager" alt="Manager" className="bg-slate-800" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-bold text-base">林雅静</h4>
          <p className="text-[10px] text-slate-500">资深财富管理专家 · 私行部</p>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#333] flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all">
            <PhoneCall size={18} />
          </button>
          <button className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#333] flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all">
            <MessageSquare size={18} />
          </button>
        </div>
      </div>
      <p className="mt-4 text-[10px] text-slate-400 leading-relaxed italic">
        "作为您的专属顾问，我不仅关注您的财富增值，更致力于为您协调全球最顶尖的健康资源，守护您的家族基业。"
      </p>
    </section>

    <section className="space-y-4">
      {[
        { icon: Users, label: '家族成员管理', sub: '已关联 4 位家族成员' },
        { icon: ShieldCheck, label: '隐私与安全设置', sub: '最高级别数据加密已开启' },
        { icon: Award, label: '会员权益手册', sub: '查看您的专属私享特权' },
        { icon: Settings, label: '系统设置', sub: '个性化您的私享体验' }
      ].map((item, i) => (
        <button key={i} className="w-full flex items-center gap-4 p-5 bg-[#1A1A1A] rounded-3xl border border-[#333] hover:bg-[#222] transition-colors">
          <div className="w-10 h-10 bg-[#0A0A0A] rounded-xl flex items-center justify-center text-[#D4AF37]"><item.icon size={20} /></div>
          <div className="flex-1 text-left"><h4 className="font-bold text-white text-sm">{item.label}</h4><p className="text-[10px] text-slate-500">{item.sub}</p></div>
          <ChevronRight size={16} className="text-slate-700" />
        </button>
      ))}
    </section>

    <button onClick={onSwitch} className="w-full py-4 bg-rose-500/10 text-rose-500 font-bold rounded-2xl border border-rose-500/20 hover:bg-rose-500/20 transition-all">退出私享系统</button>
  </div>
);

// --- Main App ---

export default function VipApp({ onSwitch }: any) {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'home': return (
        <HomeView 
          onServiceClick={(s: any) => { setSelectedService(s); setIsModalOpen(true); }} 
          onDietClick={() => setIsDietModalOpen(true)}
          onTierClick={() => setIsTierModalOpen(true)}
        />
      );
      case 'assets': return <AssetsView />;
      case 'schedule': return <ScheduleView />;
      case 'more': return <MoreView onSwitch={onSwitch} />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 font-sans pb-32">
      <header className="px-6 py-8 flex items-center justify-between bg-[#0A0A0A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2E] rounded-xl flex items-center justify-center shadow-lg"><Crown size={20} className="text-black" /></div>
          <div><h1 className="text-lg font-serif font-bold text-[#D4AF37] tracking-wider uppercase">Private Health</h1><p className="text-[10px] text-slate-500 font-medium tracking-[0.2em] uppercase">Exclusively for Diamond VIP</p></div>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] p-0.5"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=VIP" alt="Avatar" className="w-full h-full rounded-full bg-slate-800" /></div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-4">{renderView()}</main>

      <nav className="fixed bottom-0 left-0 right-0 p-6 z-50">
        <div className="max-w-md mx-auto bg-[#1A1A1A]/80 backdrop-blur-2xl border border-[#333] rounded-[32px] p-4 flex items-center justify-between shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <button onClick={() => setActiveTab('home')} className={cn("flex flex-col items-center gap-1", activeTab === 'home' ? "text-[#D4AF37]" : "text-slate-500")}>
            <Star size={20} fill={activeTab === 'home' ? "currentColor" : "none"} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">私享</span>
          </button>
          <button onClick={() => setActiveTab('assets')} className={cn("flex flex-col items-center gap-1", activeTab === 'assets' ? "text-[#D4AF37]" : "text-slate-500")}>
            <Activity size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">资产</span>
          </button>
          <div className="relative -mt-16">
            <button className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2E] rounded-full flex items-center justify-center text-black shadow-[0_10px_30px_rgba(212,175,55,0.4)] border-4 border-[#0A0A0A] active:scale-90 transition-transform"><PhoneCall size={28} /></button>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0A0A0A] animate-pulse" />
          </div>
          <button onClick={() => setActiveTab('schedule')} className={cn("flex flex-col items-center gap-1", activeTab === 'schedule' ? "text-[#D4AF37]" : "text-slate-500")}>
            <Calendar size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">日程</span>
          </button>
          <button onClick={() => setActiveTab('more')} className={cn("flex flex-col items-center gap-1", activeTab === 'more' ? "text-[#D4AF37]" : "text-slate-500")}>
            <Menu size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">更多</span>
          </button>
        </div>
      </nav>

      <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} service={selectedService} />
      <DietaryPlanModal isOpen={isDietModalOpen} onClose={() => setIsDietModalOpen(false)} />
      <TierComparisonModal isOpen={isTierModalOpen} onClose={() => setIsTierModalOpen(false)} currentTier="钻石会员" />
    </div>
  );
}
