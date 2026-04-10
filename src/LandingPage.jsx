import React from 'react';
import { Code, Zap, BarChart2, Shield } from 'lucide-react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accentBlue/20 blur-[120px] rounded-full pointer-events-none"></div>

      <nav className="relative z-10 px-8 py-6 flex justify-between items-center bg-background/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="AlgoInsight Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accentBlue to-accentGreen">AlgoInsight</span>
        </div>
      </nav>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Analyze Code <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentBlue to-accentGreen">Complexity</span> Instantly
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-12">
          AI-inspired insights powered by smart pattern detection. Understand the time and space complexity of your algorithms in milliseconds.
        </p>

        <button 
          onClick={onStart}
          className="group relative px-8 py-4 bg-accentBlue/10 border border-accentBlue/50 rounded-lg overflow-hidden transition-all hover:scale-105 hover:bg-accentBlue/20 hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accentBlue/20 to-accentGreen/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative text-accentBlue font-semibold text-lg drop-shadow-[0_0_10px_rgba(0,240,255,1)]">Start Analyzing</span>
        </button>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {[
            { icon: <Zap className="text-accentBlue" />, title: "Real-time Detection", desc: "Get O(n) estimations instantly as you type your code." },
            { icon: <BarChart2 className="text-accentGreen" />, title: "Visual Comparisons", desc: "Compare different complexity classes with beautiful interactive graphs." },
            { icon: <Shield className="text-purple-400" />, title: "Multi-Language", desc: "Supports Python, Java, C++, and JavaScript seamless analysis." },
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6 flex flex-col items-center text-center transition-all hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <div className="p-3 bg-white/5 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 py-6 border-t border-white/5 flex justify-center text-sm text-gray-500">
        <span>© 2026 AlgoInsight. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default LandingPage;
