import React, { useState } from 'react';
import { Search, Code2, Activity, Clock, Settings, User, Play, FileCode2, BarChart2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-tomorrow.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SAMPLE_CODE = `function findDuplicates(arr) {
  let duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}`;

// ─── COMPARE MODE ───
function CompareView() {
  const [visible, setVisible] = useState({ on: true, onlogn: true, on2: true, on3: false, ologn: true });
  const data = [];
  for (let i = 1; i <= 20; i++) {
    data.push({
      n: i * 5,
      'O(n)': i * 5,
      'O(n log n)': Math.round(i * 5 * Math.log2(i * 5 + 1)),
      'O(n²)': (i * 5) * (i * 5),
      'O(n³)': Math.min((i * 5) ** 3, 100000),
      'O(log n)': Math.round(Math.log2(i * 5 + 1) * 10),
    });
  }
  const lines = [
    { key: 'on', dataKey: 'O(n)', color: '#00f0ff' },
    { key: 'onlogn', dataKey: 'O(n log n)', color: '#a78bfa' },
    { key: 'on2', dataKey: 'O(n²)', color: '#39ff14' },
    { key: 'on3', dataKey: 'O(n³)', color: '#f43f5e' },
    { key: 'ologn', dataKey: 'O(log n)', color: '#facc15' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accentBlue to-accentGreen">Compare Complexities</h2>
      <div className="flex flex-wrap gap-3">
        {lines.map(l => (
          <button key={l.key} onClick={() => setVisible(v => ({ ...v, [l.key]: !v[l.key] }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${visible[l.key] ? 'border-white/20 bg-white/10 text-white' : 'border-white/5 bg-white/[0.02] text-gray-500'}`}>
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: visible[l.key] ? l.color : '#555' }}></span>
            {l.dataKey}
          </button>
        ))}
      </div>
      <div className="glass-panel p-6 flex-1 min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="n" stroke="#ffffff40" tick={{ fill: '#ffffff40', fontSize: 12 }} label={{ value: 'Input Size (n)', position: 'insideBottom', offset: -5, fill: '#ffffff40' }} />
            <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff40', fontSize: 12 }} label={{ value: 'Operations', angle: -90, position: 'insideLeft', fill: '#ffffff40' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a24', borderColor: '#ffffff20', borderRadius: '8px' }} />
            {lines.map(l => visible[l.key] && (
              <Line key={l.key} type="monotone" dataKey={l.dataKey} stroke={l.color} strokeWidth={2} dot={false} animationDuration={1200} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── HISTORY VIEW ───
function HistoryView({ history, onSelect, onClear }) {
  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accentBlue to-accentGreen">History</h2>
        {history.length > 0 && (
          <button onClick={onClear} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 italic">No analysis history yet. Analyze some code to see it here.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item, i) => (
            <button key={i} onClick={() => onSelect(item)} className="glass-panel p-5 text-left hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all">
              <pre className="text-xs text-gray-400 mb-3 line-clamp-3 font-mono overflow-hidden">{item.code}</pre>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-accentBlue">{item.timeComplexity}</span>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-gray-300">{item.spaceComplexity}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS VIEW ───
function SettingsView({ darkMode, setDarkMode, animations, setAnimations }) {
  const [language, setLanguage] = useState('javascript');

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accentBlue to-accentGreen">Settings</h2>
      <div className="glass-panel p-6 space-y-6 max-w-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Dark Mode</h3>
            <p className="text-sm text-gray-400">{darkMode ? 'Currently: Dark theme' : 'Currently: Light theme'}</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="text-accentBlue hover:scale-110 transition-transform">
            {darkMode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-gray-500" />}
          </button>
        </div>
        <hr className="border-white/10" />
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Animations</h3>
            <p className="text-sm text-gray-400">{animations ? 'Animations enabled' : 'Animations disabled'}</p>
          </div>
          <button onClick={() => setAnimations(!animations)} className="text-accentGreen hover:scale-110 transition-transform">
            {animations ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-gray-500" />}
          </button>
        </div>
        <hr className="border-white/10" />
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Default Language</h3>
            <p className="text-sm text-gray-400">Choose preferred code language</p>
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accentBlue/50">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───
export default function Dashboard({ onNav }) {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [code, setCode] = useState(SAMPLE_CODE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [animations, setAnimations] = useState(true);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const apiUrl = import.meta.env.DEV
        ? 'http://localhost:5000/api/analyze'
        : '/api/analyze';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setResult(data);
      setHistory(prev => [{ code, ...data }, ...prev].slice(0, 20));
    } catch (e) {
      console.error(e);
      const fallback = {
        timeComplexity: "O(n^2)",
        spaceComplexity: "O(n)",
        explanation: "Simulated: Detected nested loops iterating over input."
      };
      setResult(fallback);
      setHistory(prev => [{ code, ...fallback }, ...prev].slice(0, 20));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getChartData = () => {
    const data = [];
    for (let i = 1; i <= 10; i++) {
      let val = i;
      let comp = result?.timeComplexity || 'O(n)';
      if (comp.includes('n^2')) val = i * i;
      if (comp.includes('n^3')) val = i * i * i;
      if (comp.includes('log n')) val = Math.log2(i + 1);
      if (comp.includes('2^n')) val = Math.pow(2, i);
      data.push({ size: i * 10, operations: val * 10, baseline: i * i * 5 });
    }
    return data;
  };

  const handleHistorySelect = (item) => {
    setCode(item.code);
    setResult({ timeComplexity: item.timeComplexity, spaceComplexity: item.spaceComplexity, explanation: item.explanation });
    setActiveTab('analyzer');
  };

  // ─── ANALYZER VIEW (INLINE) ───
  const AnalyzerView = (
    <div className="flex-1 overflow-hidden p-6 gap-6 flex flex-col xl:flex-row">
      {/* LEFT PANEL: CODE EDITOR */}
      <section className="flex-1 flex flex-col glass-panel overflow-hidden border border-white/10 relative">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-white/5">
          <div className="flex items-center gap-3">
            {/* Window dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 font-medium ml-2 bg-white/5 px-3 py-1 rounded-md border border-white/10">
              <FileCode2 className="w-4 h-4 text-accentBlue" />
              <span>code_input</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 mr-1">Language:</span>
            <select className="bg-white/5 border border-white/10 text-white text-xs rounded-md px-2 py-1 focus:outline-none focus:border-accentBlue/50 cursor-pointer">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-[#1d1f27] relative">
          {isAnalyzing && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-accentBlue shadow-[0_4px_15px_#00f0ff] animate-[scan_2s_ease-in-out_infinite] z-10"
              style={{ boxShadow: '0 0 20px 2px #00f0ff' }} />
          )}
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
            padding={24}
            style={{
              fontFamily: '"Fira Code", "Consolas", monospace',
              fontSize: 14,
              minHeight: '100%',
              outline: 'none'
            }}
            className="editor-container text-white"
          />
        </div>
        <div className="p-4 border-t border-white/10 bg-background/50 flex justify-end">
          <button onClick={handleAnalyze} disabled={isAnalyzing}
            className="group flex items-center gap-2 px-6 py-2.5 bg-accentBlue/20 text-accentBlue font-medium rounded-lg border border-accentBlue/50 transition-all hover:bg-accentBlue hover:text-background hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed">
            {isAnalyzing ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Complexity'}
          </button>
        </div>
      </section>

      {/* RIGHT PANEL: RESULTS */}
      <section className="w-full xl:w-[450px] 2xl:w-[500px] flex flex-col gap-6">
        <div className={`glass-panel p-6 flex flex-col transition-all duration-500 ${result ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Detected Complexity</h3>
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accentBlue to-accentGreen drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                  {result ? result.timeComplexity : '—'}
                </span>
                <span className="text-sm text-gray-400">Time</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl font-medium text-white">{result ? result.spaceComplexity : '—'}</span>
                <span className="text-sm text-gray-400">Space</span>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-accentBlue/5 border border-accentBlue/20 text-sm leading-relaxed text-gray-300">
            {result ? (
              <><strong className="text-accentBlue block mb-1">Insight:</strong>{result.explanation}</>
            ) : (
              <span className="text-gray-500 italic">Click analyze to get insights on your code's efficiency.</span>
            )}
          </div>
        </div>
        <div className="glass-panel p-6 flex-1 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Growth Visualization</h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="size" stroke="#ffffff40" tick={{ fill: '#ffffff40', fontSize: 12 }} />
                <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff40', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a24', borderColor: '#ffffff20', borderRadius: '8px' }} itemStyle={{ color: '#00f0ff' }} />
                <Line type="monotone" dataKey="operations" stroke="#00f0ff" strokeWidth={3} dot={{ r: 4, fill: '#00f0ff', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff' }} animationDuration={1500} />
                <Line type="monotone" dataKey="baseline" stroke="#39ff14" strokeWidth={2} strokeDasharray="5 5" dot={false} animationDuration={1500} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 text-xs justify-center">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-accentBlue shadow-[0_0_8px_#00f0ff]"></span> Detected ({result?.timeComplexity || '—'})</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border-2 border-dashed border-accentGreen shadow-[0_0_8px_#39ff14]"></span> Reference (O(N²))</div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'analyzer': return AnalyzerView;
      case 'compare': return <CompareView />;
      case 'history': return <HistoryView history={history} onSelect={handleHistorySelect} onClear={() => setHistory([])} />;
      case 'settings': return <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} animations={animations} setAnimations={setAnimations} />;
      default: return AnalyzerView;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${!animations ? 'no-animations' : ''} ${darkMode ? 'bg-background text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-accentDark/30 backdrop-blur-md flex flex-col items-center lg:items-start py-6 transition-all duration-300 z-20">
        <div className="flex items-center gap-2 px-6 mb-12 cursor-pointer" onClick={() => onNav('landing')}>
          <img src="/logo.png" alt="AlgoInsight Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          <span className="hidden lg:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accentBlue to-accentGreen">AlgoInsight</span>
        </div>

        <nav className="flex-1 w-full space-y-2 px-4">
          {[
            { id: 'analyzer', icon: <Activity />, label: 'Analyzer' },
            { id: 'compare', icon: <BarChart2 />, label: 'Compare' },
            { id: 'history', icon: <Clock />, label: 'History' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-center lg:justify-start gap-4 p-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-accentBlue/10 text-accentBlue shadow-[inset_2px_0_0_#00f0ff]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <div className={activeTab === item.id ? 'drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : ''}>{item.icon}</div>
              <span className="hidden lg:block font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="w-full px-4 pt-6 border-t border-white/5">
          <button onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-center lg:justify-start gap-4 p-3 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-accentBlue/10 text-accentBlue shadow-[inset_2px_0_0_#00f0ff]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <Settings />
            <span className="hidden lg:block font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative z-10 w-full">
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-md flex items-center justify-between px-6">
          <div className="relative w-64 md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search algorithms, past scans..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accentBlue/50 focus:ring-1 focus:ring-accentBlue/50 transition-all placeholder-gray-500" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accentBlue to-accentGreen flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <User className="w-5 h-5 text-background" />
            </div>
          </div>
        </header>

        {/* WORKSPACE — dynamic based on activeTab */}
        {renderContent()}
      </main>

      {/* Global styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .editor-container textarea { outline: none !important; }
        .no-animations * {
          animation: none !important;
          transition: none !important;
        }
      `}} />
    </div>
  );
}
