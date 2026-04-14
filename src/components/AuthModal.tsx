"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, CheckCircle2, AlertCircle, ShieldCheck, KeyRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "loading" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!email.trim().toLowerCase().endsWith(".edu")) {
      setStatus("error");
      setErrorMsg("MBA Hub is currently restricted to verified university emails.");
      return;
    }

    setStatus("loading");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true
      }
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    setStatus("idle");
    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setStatus("error");
      setErrorMsg("Please enter the 6-digit code.");
      return;
    }

    setStatus("loading");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email"
    });

    if (error) {
      setStatus("error");
      setErrorMsg("Invalid or expired code.");
      return;
    }

    setStatus("success");
    
    // Complete Auth and route to Dashboard
    setTimeout(() => {
      onClose();
      router.push("/dashboard");
      // Reset state for next time
      setTimeout(() => {
        setStep("email");
        setEmail("");
        setOtp("");
        setStatus("idle");
      }, 500);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={status === "loading" ? undefined : onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-200 z-10"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>

          <div className="p-6 pt-8 pb-4 relative overflow-hidden">
            <button 
              onClick={status === "loading" ? undefined : onClose} 
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 z-20"
              disabled={status === "loading"}
            >
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {step === "email" ? (
                <motion.div 
                  key="step-email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 mx-auto">
                    <ShieldCheck size={28} />
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 text-center mb-2 tracking-tight">
                    Verify Credentials
                  </h2>
                  <p className="text-slate-500 font-medium text-center text-sm mb-6 px-4">
                    MBA Hub is a closed network. Please provide your active university email to continue.
                  </p>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === "error") setStatus("idle");
                          }}
                          placeholder="name@university.edu"
                          disabled={status === "loading" || status === "success"}
                          className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${status === "error" ? "border-red-300 ring-1 ring-red-300" : "border-slate-200"} rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-60`}
                        />
                      </div>
                      
                      <AnimatePresence mode="wait">
                        {status === "error" && (
                          <motion.div 
                            key="error-email"
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: "auto" }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="text-red-500 text-xs font-bold mt-2 flex items-center px-1"
                          >
                            <AlertCircle size={12} className="mr-1" />
                            {errorMsg}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button 
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all flex justify-center items-center disabled:opacity-80"
                    >
                      {status === "loading" ? (
                        <span className="flex items-center">
                          <Loader2 size={18} className="animate-spin mr-2" />
                          Sending Code...
                        </span>
                      ) : (
                        "Send Secure Code"
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="step-otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-100 text-gold-600 flex items-center justify-center mb-5 mx-auto">
                    <KeyRound size={28} />
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 text-center mb-2 tracking-tight">
                    Enter Access Code
                  </h2>
                  <p className="text-slate-500 font-medium text-center text-sm mb-6 px-4">
                    We sent a secure code to <span className="font-bold text-slate-800">{email}</span>.
                  </p>

                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, ''));
                          if (status === "error") setStatus("idle");
                        }}
                        placeholder="000000"
                        disabled={status === "loading" || status === "success"}
                        className={`w-full text-center tracking-[0.5em] text-2xl py-3 bg-slate-50 border ${status === "error" ? "border-red-300 ring-1 ring-red-300" : "border-slate-200"} rounded-xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-60`}
                      />
                      
                      <AnimatePresence mode="wait">
                        {status === "error" && (
                          <motion.div 
                            key="error-otp"
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: "auto" }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="text-red-500 text-xs font-bold mt-2 flex justify-center items-center px-1"
                          >
                            <AlertCircle size={12} className="mr-1" />
                            {errorMsg}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button 
                      type="submit"
                      disabled={status === "loading" || status === "success"}
                      className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-base shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] transition-all flex justify-center items-center disabled:opacity-80"
                    >
                      {status === "loading" ? (
                        <span className="flex items-center">
                          <Loader2 size={18} className="animate-spin mr-2" />
                          Verifying...
                        </span>
                      ) : status === "success" ? (
                        <span className="flex items-center">
                          <CheckCircle2 size={18} className="mr-2" />
                          Verified
                        </span>
                      ) : (
                        "Verify & Connect"
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                        setStatus("idle");
                      }}
                      className="w-full text-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors mt-2"
                    >
                      Use a different email
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-slate-50 border-t border-slate-100 p-4 text-center z-20 relative">
            <p className="text-xs text-slate-500 font-medium">By connecting, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> & <a href="#" className="text-blue-600 hover:underline">Community Guidelines</a>.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
