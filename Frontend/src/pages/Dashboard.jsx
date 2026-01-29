import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  History, 
  Play, 
  Search 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import AddIcon from '@mui/icons-material/Add';
import "../styles/Dashboard.css"
import NewScanModal from '../components/NewScanModal';

// --- Mock Data ---
const initialHistory = [
  { id: 1, date: '2023-10-24', time: '14:30', status: 'Passed', vulns: 0 },
  { id: 2, date: '2023-10-23', time: '09:15', status: 'Warnings', vulns: 3 },
  { id: 3, date: '2023-10-22', time: '18:45', status: 'Failed', vulns: 12 },
  { id: 4, date: '2023-10-21', time: '11:20', status: 'Passed', vulns: 0 },
];

const chartData = [
  { name: 'Mon', vulns: 4 },
  { name: 'Tue', vulns: 2 },
  { name: 'Wed', vulns: 12 },
  { name: 'Thu', vulns: 3 },
  { name: 'Fri', vulns: 5 },
  { name: 'Sat', vulns: 0 },
  { name: 'Sun', vulns: 1 },
];

const severityData = [
  { name: 'Critical', value: 2, color: '#EF4444' }, // Red
  { name: 'Moderate', value: 4, color: '#F59E0B' }, // Amber
  { name: 'Low', value: 8, color: '#3B82F6' },     // Blue
];

const Dashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [history, setHistory] = useState(initialHistory);
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 4. Function to Take New Scan ---
  const handleStartScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setLogs(['Initializing scanner...', 'Connecting to database...']);
    
    // Simulate scanning process
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress > 100) progress = 100;
      setScanProgress(progress);
      
      // Add fake logs
      if (progress < 100) {
        const newLog = `Scanning module ${Math.floor(Math.random() * 9000) + 1000}...`;
        setLogs(prev => [newLog, ...prev].slice(0, 5));
      }

      if (progress === 100) {
        clearInterval(interval);
        setIsScanning(false);
        setLogs(prev => ['Scan Complete.', ...prev]);
        // Add new mock entry to history
        const newEntry = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: Math.random() > 0.5 ? 'Passed' : 'Warnings',
          vulns: Math.floor(Math.random() * 5)
        };
        setHistory(prev => [newEntry, ...prev]);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Real-time security monitoring & vulnerability assessment</p>
        </div>
        
        {/* --- 4. Action Button: Take New Scan --- */}
        <button className="btn-new-scan-plus" onClick={() => setIsModalOpen(true)}>
          <AddIcon className="plus-icon" />
          <span>New Scan</span>
        </button>
        <NewScanModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* --- 1. Total Vulnerabilities Found (Stat Card) --- */}
        <div className="md:col-span-3 bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle className="w-24 h-24 text-red-500" />
          </div>
          <h3 className="text-slate-400 font-medium mb-2">Total Vulnerabilities</h3>
          <div className="text-4xl font-bold text-white mb-1">24</div>
          <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded-full">
            +3 from last week
          </span>
        </div>

        {/* --- 2. Last Scan Status (Stat Card) --- */}
        <div className="md:col-span-3 bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 font-medium mb-2">Last Scan Status</h3>
          <div className="flex items-center gap-3">
            {history[0].status === 'Passed' ? (
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            )}
            <div>
              <div className={`text-2xl font-bold ${history[0].status === 'Passed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {history[0].status}
              </div>
              <div className="text-xs text-slate-500">{history[0].date} at {history[0].time}</div>
            </div>
          </div>
        </div>

        {/* --- 3. Live Incidents Scanning (Live Feed Widget) --- */}
        <div className="md:col-span-6 bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-400 font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Live Terminal
            </h3>
            {isScanning && <span className="animate-pulse text-xs text-emerald-400">● Live</span>}
          </div>
          
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm h-32 overflow-y-auto border border-slate-800/50">
            {isScanning ? (
              <div className="space-y-1">
                {logs.map((log, idx) => (
                  <div key={idx} className="text-emerald-500/80"> {log}</div>
                ))}
                <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-slate-600 italic flex items-center justify-center h-full">
                System Idle. Waiting for command...
              </div>
            )}
          </div>
        </div>
        {/* --- Graph 1: Enhanced Vulnerability Trends --- */}
        <div className="md:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Vulnerability Trends</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-indigo-500" /> Issues Detected
              </span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVulns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="vulns" 
                  stroke="#818cf8" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVulns)" 
                  dot={{ r: 4, fill: '#818cf8', strokeWidth: 2, stroke: '#0f172a' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Graph 2: Donut Chart with Center Label --- */}
        <div className="md:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-xl relative">
          <h3 className="text-lg font-semibold text-white mb-2">Severity Breakdown</h3>
          <div className="h-72 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  innerRadius={75}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={10} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* CENTER OVERLAY */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">14</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">Total Risks</span>
            </div>
          </div>
        </div>
        {/* --- 5. Scanning History (Table) --- */}
        <div className="md:col-span-12 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              Scan History
            </h3>
            <button className="text-sm text-indigo-400 hover:text-indigo-300">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950 text-slate-200 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Vulnerabilities</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        scan.status === 'Passed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        scan.status === 'Failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {scan.status === 'Passed' && <CheckCircle className="w-3 h-3" />}
                        {scan.status === 'Failed' && <AlertTriangle className="w-3 h-3" />}
                        {scan.status === 'Warnings' && <AlertTriangle className="w-3 h-3" />}
                        {scan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {scan.date} <span className="text-slate-600 text-xs ml-1">{scan.time}</span>
                    </td>
                    <td className="px-6 py-4">
                      {scan.vulns > 0 ? (
                        <span className="text-red-400 font-bold">{scan.vulns} Detected</span>
                      ) : (
                        <span className="text-slate-500">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <Search className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;