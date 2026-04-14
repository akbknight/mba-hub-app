"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Settings, LogOut, CheckCircle2 } from "lucide-react";
import { useAppContext, TabState } from "@/context/AppContext";
import MatchGrid from "./MatchGrid";
import RendezvousModal from "./RendezvousModal";

export default function HubDashboard() {
  const { activeTab, setActiveTab, userEmail, setUserEmail, setIsAuthenticated } = useAppContext();

  React.useEffect(() => {
    const fetchUser = async () => {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        setIsAuthenticated(true);
      }
    };
    fetchUser();
  }, [setUserEmail, setIsAuthenticated]);

  const handleLogout = async () => {
    const { createClient } = await import("@/utils/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  const tabs: TabState[] = ["Dashboard", "My Matches", "Study Groups", "Social"];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Premium ambient background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[300px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none -mr-40 -mt-20"></div>
      
      {/* Top Navbar */}
      <nav className="w-full bg-white border-b border-slate-200 relative z-20 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Search */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-blue-600 shadow-md flex items-center justify-center">
                <span className="text-white font-extrabold text-xl">M</span>
              </div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">MBA Hub</span>
            </div>
            
            <div className="hidden md:flex relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search alumni, skills, courses..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right Nav Actions */}
          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
              <span className="text-emerald-700 text-xs font-bold font-mono">
                124 Active Users Nearby (Georgetown / AU Campus)
              </span>
            </div>
            
            <div className="flex items-center space-x-4 border-l border-slate-200 pl-6 ml-2">
               <button className="text-slate-400 hover:text-blue-600 transition-colors relative">
                 <Bell size={22} />
                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               
               <div className="group relative cursor-pointer">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=MyAvatarlol" alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-200 bg-slate-50 group-hover:border-blue-500 transition-colors object-cover" />
                 <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100 mb-2">
                       <p className="text-sm font-bold text-slate-900 truncate">Premium Account</p>
                       <p className="text-xs text-slate-500 font-medium truncate flex items-center mt-1">
                          <CheckCircle2 size={12} className="text-blue-600 mr-1" />
                          {userEmail}
                       </p>
                    </div>
                    <button className="flex items-center px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600">
                      <Settings size={16} className="mr-2" /> Account Settings
                    </button>
                    <button onClick={handleLogout} className="flex items-center px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 mt-1 border-t border-slate-100">
                      <LogOut size={16} className="mr-2" /> Disconnect
                    </button>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </nav>

      {/* Main Layout Area */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8 flex flex-col relative z-10">
        
        {/* Tab Navigation */}
        <div className="flex space-x-8 border-b border-slate-200 mb-8 relative">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab ? "text-blue-600" : "text-slate-500 hover:text-slate-800"}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="tabIndicator" 
                  className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeTab === "Dashboard" && <MatchGrid />}
              {activeTab !== "Dashboard" && (
                <div className="w-full h-[400px] flex items-center justify-center text-center">
                   <div>
                      <div className="w-20 h-20 bg-slate-100 rounded-2xl mx-auto mb-4 border border-slate-200 flex items-center justify-center">
                         <span className="text-slate-400 font-bold text-2xl">M</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">Module Offline</h3>
                      <p className="text-slate-500 font-medium">The {activeTab} feature is currently locked for this demo phase.</p>
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <RendezvousModal />
    </div>
  );
}
