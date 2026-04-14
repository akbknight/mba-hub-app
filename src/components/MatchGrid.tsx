"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Briefcase, GraduationCap, Sparkles, MessageSquareHeart } from "lucide-react";
import { useAppContext, StudentProfile } from "@/context/AppContext";

const mockProfiles: StudentProfile[] = [
  {
    id: "p1",
    name: "Sarah Jenkins",
    role: "Ex-McKinsey Consultant",
    university: "Georgetown University",
    degree: "MBA '25",
    tags: ["Looking for Co-founder", "FinTech", "Available for Coffee"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ",
    distance: "1.2 miles away"
  },
  {
    id: "p2",
    name: "David Chen",
    role: "Product Manager @ Google",
    university: "American University",
    degree: "MS Data Science '24",
    tags: ["Study Group", "Machine Learning", "Case Prep"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DavidC",
    distance: "0.8 miles away"
  },
  {
    id: "p3",
    name: "Elena Rodriguez",
    role: "Startup Founder",
    university: "George Washington Univ.",
    degree: "MBA '26",
    tags: ["Seed Funding", "EdTech", "Networking"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaR",
    distance: "2.5 miles away"
  },
  {
    id: "p4",
    name: "Marcus Johnson",
    role: "IB Summer Associate",
    university: "Howard University",
    degree: "MBA '25",
    tags: ["Private Equity", "Available for Coffee", "Mentorship"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusJ",
    distance: "3.1 miles away"
  }
];

export default function MatchGrid() {
  const { setActiveMatch } = useAppContext();

  const handleConnect = (profile: StudentProfile) => {
    setActiveMatch(profile);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Curated Matches</h2>
          <p className="text-slate-500 font-medium mt-1 text-sm bg-slate-100 inline-flex items-center px-2 py-0.5 rounded-full">
            <Sparkles size={12} className="text-blue-500 mr-1.5" />
            AI prioritized based on your goals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProfiles.map((profile, i) => (
          <motion.div 
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all group flex flex-col h-full"
          >
            {/* Header / Avatar Area */}
            <div className="relative h-24 bg-gradient-to-r from-blue-50 to-slate-100 flex justify-center">
              <div className="absolute -bottom-10 w-20 h-20 rounded-full border-4 border-white bg-white shadow-sm overflow-hidden z-10 transition-transform group-hover:scale-105">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover bg-slate-50" />
              </div>
            </div>

            {/* Content Area */}
            <div className="pt-12 pb-6 px-6 flex-1 flex flex-col text-center">
              <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{profile.name}</h3>
              <p className="text-xs font-bold text-blue-600 mb-3">{profile.role}</p>

              <div className="flex flex-col space-y-2 mb-5">
                <div className="flex items-center justify-center text-xs text-slate-500 font-medium">
                  <GraduationCap size={14} className="mr-1.5 text-slate-400" />
                  {profile.university} • {profile.degree}
                </div>
                <div className="flex items-center justify-center text-xs text-slate-500 font-medium">
                  <MapPin size={14} className="mr-1.5 text-slate-400" />
                  {profile.distance}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-1.5 mb-6 mt-auto">
                {profile.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <button 
                onClick={() => handleConnect(profile)}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-600 border border-blue-100 hover:border-blue-600 text-blue-700 hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center group/btn"
              >
                <MessageSquareHeart size={16} className="mr-2 group-hover/btn:scale-110 transition-transform" />
                Connect
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
