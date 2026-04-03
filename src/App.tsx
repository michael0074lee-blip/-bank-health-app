import React, { useState } from 'react';
import VipApp from './VipApp';
import EmployeeApp from './EmployeeApp';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, User, ChevronRight, Heart, Star } from 'lucide-react';
import { cn } from './lib/utils';

function App() {
  const [version, setVersion] = useState<'select' | 'employee' | 'vip'>('select');

  if (version === 'employee') return <EmployeeApp onSwitch={() => setVersion('select')} />;
  if (version === 'vip') return <VipApp onSwitch={() => setVersion('select')} />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">银行健康服务平台</h1>
          <p className="text-slate-500">请选择您的身份进入专属版本</p>
        </div>

        <div className="grid gap-6">
          {/* Employee Version Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setVersion('employee')}
            className="bg-white p-6 rounded-[32px] shadow-xl shadow-blue-500/5 border border-blue-100 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <User size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800">银行员工版</h3>
                <p className="text-sm text-slate-500">智慧工会 · 康小智健康助手</p>
              </div>
              <ChevronRight className="text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-blue-50 text-[10px] font-bold text-blue-600 rounded-full">AI 咨询</span>
              <span className="px-3 py-1 bg-blue-50 text-[10px] font-bold text-blue-600 rounded-full">心理评估</span>
              <span className="px-3 py-1 bg-blue-50 text-[10px] font-bold text-blue-600 rounded-full">工会福利</span>
            </div>
          </motion.div>

          {/* VIP Version Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setVersion('vip')}
            className="bg-[#1A1A1A] p-6 rounded-[32px] shadow-2xl shadow-black/20 border border-[#D4AF37]/20 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#D4AF37]/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2E] rounded-2xl flex items-center justify-center text-black shadow-lg shadow-[#D4AF37]/20">
                <Star size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">私享健康 · VIP版</h3>
                <p className="text-sm text-slate-400">高端定制 · 全球医疗资源</p>
              </div>
              <ChevronRight className="text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-white/5 text-[10px] font-bold text-[#D4AF37] rounded-full border border-[#D4AF37]/20">全球绿通</span>
              <span className="px-3 py-1 bg-white/5 text-[10px] font-bold text-[#D4AF37] rounded-full border border-[#D4AF37]/20">长寿管理</span>
              <span className="px-3 py-1 bg-white/5 text-[10px] font-bold text-[#D4AF37] rounded-full border border-[#D4AF37]/20">家族传承</span>
            </div>
          </motion.div>
        </div>

        <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest">
          © 2026 Private Banking Health Service
        </p>
      </div>
    </div>
  );
}

export default App;
