import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Language, 
  SettingsInputComponent, 
  Api, 
  Assignment,
  CloudUpload, 
  PlayArrow,
  Terminal
} from '@mui/icons-material';
import api from "../utils/api";
import { useScanContext } from "../context/ScanContext";

const ScanTypePage = () => {
  const [selectedType, setSelectedType] = useState('website');
  const [isLoading, setIsLoading] = useState(false);
  const {scanId,DASTresults,DASTsetResults} = useScanContext();


  const scanOptions = [
    { id: 'website', title: 'Website URL Scan', desc: 'Scan live web applications for vulnerabilities.', icon: <Language /> },
    { id: 'proxy', title: 'Proxy Monitoring', desc: 'Real-time runtime traffic analysis.', icon: <SettingsInputComponent /> },
    { id: 'api', title: 'API Schema Scan', desc: 'Analyze API definitions.', icon: <Api /> },
    { id: 'logs', title: 'Log Analysis', desc: 'Sift through system and app logs.', icon: <Assignment /> },
  ];

  const toggleSelection = (id) => {
  setSelectedType(id);
  };


  const handleWebsiteScan = async (url) => {
    if (!url) return;

    setIsLoading(true);

    try {
      const response = await api.post("/api/scan/dynamicscan/", { url }); 
      DASTsetResults(prev => [...prev,{scanType: "Website URL Scan",data: response.data}]);

    } catch (err) {
        DASTsetResults(prev => [
          ...prev,
          { type: "Website Scan", error: `${err}`}
        ]);
    }


    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Choose Scan Type</h1>
          <p className="text-slate-400">Select one or more modules to begin your DevShield security assessment.</p>
        </header>

        {/* --- 4 SELECTABLE CARDS (SAME UI) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {scanOptions.map((option) => {
            const isSelected = selectedType === option.id;
            return (
              <motion.div
                key={option.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSelection(option.id)}
                className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center shadow-xl 
                  ${isSelected 
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-indigo-500/20' 
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
              >
                <div className={`mb-4 p-3 rounded-xl ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {React.cloneElement(option.icon, { sx: { fontSize: 40 } })}
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{option.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{option.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* --- STACKED CONFIGURATION AREA --- */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {selectedType && (
              <motion.div
                key={selectedType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl"
              >
                {selectedType  === 'website' && <WebsiteScanUI onStart={handleWebsiteScan} isLoading={isLoading} />}
                {selectedType  === 'proxy' && <ProxyScanUI onStart={() => {}} isLoading={isLoading} />}
                {selectedType  === 'api' && <ApiScanUI onStart={() => {}} isLoading={isLoading} />}
                {selectedType  === 'logs' && <LogScanUI onStart={() => {}} isLoading={isLoading} />}
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
      {DASTresults && DASTresults.length > 0 && (
  <div className="mt-12 animate-fade-in">
    <h2 className="text-2xl font-bold mb-6 text-white border-b border-slate-800 pb-4">
      Analysis Report
    </h2>
      

    {DASTresults && DASTresults.length > 0 && (
      <div className="mt-12 bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
        <h2 className="text-2xl font-bold mb-6 text-white">
          Scan Results
        </h2>

        {DASTresults.map((result, index) => (
          <div
            key={index}
            className="mb-6 p-6 bg-black/40 border border-slate-700 rounded-xl"
          >
            <pre className="text-xs text-slate-300 overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    )}
    
  <br></br>
  </div>
)}

    </div>
  );
};

/* --- INPUT SECTIONS (FORMAT KEPT SAME) --- */

const WebsiteScanUI = ({ onStart, isLoading }) => {
  
  const [url, setUrl] = useState("");
  return (<div className="grid md:grid-cols-2 gap-10">
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Language className="text-indigo-500" /> Website URL Scan
      </h2>
      <div className="space-y-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Website URL (https://example.com)"
            className="w-full bg-black/40 border border-slate-700 p-4 rounded-xl focus:outline-none focus:border-indigo-500 text-white"
          />
          <button
            onClick={() => onStart(url)}
            disabled={isLoading || !url}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <PlayArrow />
            {isLoading ? "Scanning..." : "Start Website Scan"}
          </button>
      </div>
    </div>
    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Features</h4>
      <ul className="space-y-2 text-slate-300 text-sm">
        <li>• DAST scanning</li>
        <li>• Header analysis</li>
        <li>• Basic data leakage detection</li>
        <li>• Crawling & fuzzing</li>
      </ul>
    </div>
  </div> );
}

const ProxyScanUI = ({ onStart, isLoading }) => (
  <div className="grid md:grid-cols-2 gap-10">
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <SettingsInputComponent className="text-indigo-500" /> Proxy Runtime Monitoring
      </h2>
      <p className="text-sm text-slate-400">Configure your application or browser to route traffic through DevShield Proxy.</p>
      <div className="grid grid-cols-2 gap-4">
        <input readOnly value="Host: 127.0.0.1" className="bg-black/40 border border-slate-700 p-3 rounded-lg text-indigo-400 font-mono text-sm" />
        <input readOnly value="Port: 8080" className="bg-black/40 border border-slate-700 p-3 rounded-lg text-indigo-400 font-mono text-sm" />
      </div>
      <button className="w-full bg-indigo-600 py-3 rounded-xl font-bold">Start Monitoring</button>
    </div>
    <div className="bg-white/5 p-4 rounded-xl text-xs grid grid-cols-2 gap-2 text-slate-400">
        <div>• Request headers</div><div>• Response headers</div><div>• Cookies</div><div>• API calls</div>
    </div>
  </div>
);

const ApiScanUI = ({ onStart, isLoading }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
      <Api className="text-indigo-500" /> API Schema Scan
    </h2>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="border-2 border-dashed border-slate-700 p-8 rounded-2xl text-center">
        <CloudUpload className="text-slate-600 mb-2" />
        <p className="text-sm">Upload .json or .yaml</p>
      </div>
      <textarea placeholder="Or paste OpenAPI schema here..." className="w-full bg-black/40 border border-slate-700 p-4 rounded-xl text-sm h-32" />
    </div>
    <button className="w-full bg-indigo-600 py-4 rounded-xl font-bold">Validate API</button>
  </div>
);

const LogScanUI = ({ onStart, isLoading }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
      <Terminal className="text-indigo-500" /> Log Analysis
    </h2>
    <div className="grid md:grid-cols-2 gap-4">
       <input placeholder="Log streaming endpoint" className="bg-black/40 border border-slate-700 p-3 rounded-lg" />
       <input placeholder="Docker container name" className="bg-black/40 border border-slate-700 p-3 rounded-lg" />
    </div>
    <button className="w-full bg-indigo-600 py-4 rounded-xl font-bold">Start Log Analysis</button>
  </div>
);

export default ScanTypePage;