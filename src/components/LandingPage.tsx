"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { GraduationCap, Users, Coffee, Sparkles } from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const containerVars: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const childVars: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Premium ambient background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none -mr-40 -mt-20"></div>
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[100px] pointer-events-none -ml-20"></div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 shadow-md flex items-center justify-center">
            <span className="text-white font-extrabold text-xl">M</span>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">MBA Hub</span>
        </div>
        <button 
          onClick={() => setIsAuthOpen(true)}
          className="text-slate-600 font-semibold hover:text-blue-600 transition-colors"
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10 py-16">
        <motion.div variants={containerVars} initial="hidden" animate="show" className="max-w-4xl mx-auto">
          
          <motion.div variants={childVars} className="inline-flex items-center space-x-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm mb-8">
            <Sparkles size={14} className="text-gold-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Premium University Network</span>
          </motion.div>

          <motion.h1 variants={childVars} className="text-6xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            The Private Network <br/><span className="text-blue-600">for the Ambitious.</span>
          </motion.h1>

          <motion.p variants={childVars} className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            Connect, study, and socialize with verified university peers. Join the exclusive hub designed for the sharpest minds in the country.
          </motion.p>

          <motion.div variants={childVars} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-0.5"
            >
              Join with .edu Email
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-lg shadow-sm hover:border-slate-300 transition-all">
              Learn More
            </button>
          </motion.div>

          {/* Value Props */}
          <motion.div variants={childVars} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Study Sync</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Find classmates for shared courses instantly. Form power groups and organize your next massive study session.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center mb-6">
                <Coffee size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Network & Coffee</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Unlock professional opportunities. Schedule casual coffee chats or formal meetups with founders and future executives.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gold-50 to-white p-8 rounded-2xl border border-gold-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-gold-500/20 transition-colors"></div>
              <div className="w-12 h-12 rounded-xl bg-white border border-gold-200 text-gold-600 flex items-center justify-center mb-6 relative z-10 shadow-sm">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">The Spark</h3>
              <p className="text-slate-600 font-medium leading-relaxed relative z-10">
                Curated dating exclusively for graduate students. Match with verified, ambitious peers on the same trajectory.
              </p>
            </div>

          </motion.div>
        </motion.div>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
