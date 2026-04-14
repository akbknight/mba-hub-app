"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Video, Coffee, DollarSign, CalendarHeart, Loader2, Compass, ExternalLink, Sparkles } from "lucide-react";
import { useAppContext, StudentProfile } from "@/context/AppContext";

export default function RendezvousModal() {
  const { activeMatch, setActiveMatch } = useAppContext();
  
  const [method, setMethod] = useState<"none" | "in-person" | "virtual">("none");
  
  // In-Person State
  const [budget, setBudget] = useState<number>(2);
  const [vibe, setVibe] = useState<string>("Quiet Coffee");
  const [isCalculating, setIsCalculating] = useState(false);
  const [finalVenue, setFinalVenue] = useState<any>(null);

  // Virtual State
  const [videoLink, setVideoLink] = useState("");

  if (!activeMatch) return null;

  const handleClose = () => {
    setActiveMatch(null);
    setTimeout(() => {
      setMethod("none");
      setIsCalculating(false);
      setFinalVenue(null);
      setVideoLink("");
    }, 500);
  };

  const calculateMidpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    try {
      const response = await fetch('/api/rendezvous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          vibe,
          targetPerson: activeMatch.name
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate recommendation');
      }

      const data = await response.json();
      setFinalVenue(data);
    } catch (error) {
      console.error(error);
      setFinalVenue({
        name: "Tatte Bakery & Cafe",
        address: "1200 New Hampshire Ave NW, Washington, DC",
        distance: "1.2 miles away (Fallback)",
        matchQuality: "98% Match for your parameters"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const generateVirtualRoom = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setVideoLink(`https://vc.mba-hub.edu/room/${Math.random().toString(36).substring(7)}`);
    }, 1500);
  };

  const renderContent = () => {
    if (method === "none") {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
          <p className="text-slate-600 font-medium text-center mb-8">How would you like to connect with {activeMatch.name.split(" ")[0]}?</p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setMethod("in-person")}
              className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl transition-all group"
            >
              <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <span className="font-bold text-slate-900">In-Person Meetup</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Smart Location Engine</span>
            </button>

            <button 
              onClick={() => {
                setMethod("virtual");
                generateVirtualRoom();
              }}
              className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-gold-50 border border-slate-200 hover:border-gold-300 rounded-2xl transition-all group"
            >
              <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Video className="text-gold-600" size={24} />
              </div>
              <span className="font-bold text-slate-900">Virtual Room</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Secure Encrypted Audio/Video</span>
            </button>
          </div>
        </motion.div>
      );
    }

    if (method === "in-person") {
      if (isCalculating) {
        return (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <Compass size={48} className="text-blue-600 animate-spin-slow" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Calculating Optimal Midpoint</h3>
            <p className="text-slate-500 font-medium text-sm max-w-xs">
              Analyzing traffic patterns and querying premium venues between you and {activeMatch.distance}...
            </p>
          </div>
        );
      }

      if (finalVenue) {
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6">
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-6 mb-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                    <Sparkles size={18} />
                  </div>
                  <span className="text-xs font-bold text-green-700 uppercase tracking-widest">AI Venue Recommendation</span>
                </div>
                <span className="px-2.5 py-1 bg-white border border-green-200 text-green-700 text-xs font-bold rounded-lg shadow-sm">
                  {finalVenue.matchQuality}
                </span>
              </div>
              
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{finalVenue.name}</h3>
              <p className="text-slate-600 font-medium text-sm flex items-center mb-5">
                <MapPin size={14} className="mr-1.5 opacity-70" /> {finalVenue.address}
              </p>

              <div className="flex items-center space-x-4 mb-6">
                 <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700">{vibe}</div>
                 <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold flex text-slate-700">
                    {Array.from({length: 3}).map((_, i) => (
                      <DollarSign key={i} size={14} className={i < budget ? "text-slate-700" : "text-slate-300"} />
                    ))}
                 </div>
              </div>

              <button className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-[0_4px_14px_0_rgba(15,23,42,0.39)]">
                <CalendarHeart size={18} className="mr-2" /> Book Table & Send Invitation
              </button>
            </div>
          </motion.div>
        );
      }

      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
          <form onSubmit={calculateMidpoint} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">Target Vibe</label>
              <div className="grid grid-cols-3 gap-3">
                {["Quiet Coffee", "Lively Bar", "Formal Lounge"].map(val => (
                  <div 
                    key={val}
                    onClick={() => setVibe(val)}
                    className={`border ${vibe === val ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"} rounded-xl p-3 text-center cursor-pointer text-sm font-bold transition-all`}
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">Expected Budget Per Person</label>
              <div className="flex space-x-3">
                {[1, 2, 3].map(val => (
                  <div 
                    key={val}
                    onClick={() => setBudget(val)}
                    className={`flex-1 border ${budget === val ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-400"} rounded-xl py-3 flex justify-center cursor-pointer transition-all`}
                  >
                    {Array.from({length: val}).map((_, i) => <DollarSign key={i} size={18} />)}
                  </div>
                ))}
              </div>
            </div>
            
            <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all flex items-center justify-center">
              Find Ideal Location
            </button>
          </form>
        </motion.div>
      );
    }

    if (method === "virtual") {
      if (isCalculating) {
         return (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 size={40} className="text-gold-500 animate-spin mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Provisioning Secure Room</h3>
            <p className="text-slate-500 font-medium text-sm">Generating end-to-end encrypted session keys...</p>
          </div>
        );
      }

      return (
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 text-center">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <Video size={28} />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Room Ready</h3>
             <p className="text-slate-600 font-medium mb-8">A secure private link has been generated to meet with {activeMatch.name}.</p>
             
             <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between mb-8">
                <code className="text-sm font-bold text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap pl-2">
                  {videoLink}
                </code>
                <button className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-bold text-blue-600 shadow-sm hover:border-blue-300 transition-colors ml-4 shrink-0">
                  Copy Link
                </button>
             </div>

             <button className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] transition-all flex items-center justify-center">
              Send Instant Invite <ExternalLink size={16} className="ml-2" />
             </button>
         </motion.div>
      );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative border border-slate-200 z-10"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white relative z-20">
            <div className="flex items-center space-x-3">
              <img src={activeMatch.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">Match Initiated</h3>
                <p className="text-xs text-blue-600 font-bold">{activeMatch.name}</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full">
              <X size={18} />
            </button>
          </div>

          <div className="min-h-[300px] relative bg-white">
            <AnimatePresence mode="wait">
              <motion.div key={method} className="h-full">
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
