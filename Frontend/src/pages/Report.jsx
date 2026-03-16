import React from "react";
import { useScanContext } from "../context/ScanContext";
import { 
  Shield, 
  Code, 
  Launch, 
  BugReport, 
  CheckCircle, 
  WarningAmber 
} from "@mui/icons-material";

const Report = () => {
  const { scanId, SATSresults, DASTresults } = useScanContext();

  // Helper to safely get lengths
  const sastCount = SATSresults?.folder?.length || 0;
  const dastCount = (DASTresults?.[0]?.data?.headerIssues?.length || 0) + (DASTresults?.[0]?.data?.leaks?.length || 0);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      {/* --- REPORT CONTAINER (White Background Page) --- */}
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-sm border border-slate-200 overflow-hidden">
        
        {/* HEADER SECTION (Highlighted) */}
        <header className="bg-slate-900 text-white p-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">Security Assessment Report</h1>
              <p className="text-slate-400 font-mono text-sm">Scan ID: {scanId || "DEVS-882-991"}</p>
            </div>
            <Shield sx={{ fontSize: 50 }} className="text-indigo-400" />
          </div>
          
          <div className="grid grid-cols-3 gap-6 mt-10 border-t border-slate-700 pt-8">
            <div className="text-center">
              <p className="text-xs uppercase text-slate-500 font-bold mb-1">Total Vulnerabilities</p>
              <p className="text-2xl font-black text-red-500">{sastCount + dastCount}</p>
            </div>
            <div className="text-center border-x border-slate-700">
              <p className="text-xs uppercase text-slate-500 font-bold mb-1">Scan Status</p>
              <p className="text-xl font-bold text-emerald-400">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase text-slate-500 font-bold mb-1">Risk Level</p>
              <p className="text-xl font-bold text-amber-500">Critical</p>
            </div>
          </div>
        </header>

        <div className="p-10 space-y-12">
          
          {/* SECTION 1: SAST RESULTS (Static Analysis) */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b-2 border-slate-100 pb-2">
              <Code className="text-indigo-600" />
              <h2 className="text-xl font-black uppercase text-slate-800 tracking-wide">Static Code Analysis (SAST)</h2>
            </div>
            
            {sastCount > 0 ? (
              <div className="space-y-6">
                {SATSresults.folder.map((result, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between">
                      <span className="font-mono text-xs font-bold text-slate-600">File: {result[0]}</span>
                      <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded font-bold">CRITICAL</span>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Vulnerable Code</p>
                        <pre className="bg-red-50 text-red-800 p-3 rounded text-xs font-mono border border-red-100">{result[1]}</pre>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Remediation</p>
                        <pre className="bg-emerald-50 text-emerald-800 p-3 rounded text-xs font-mono border border-emerald-100">{result[2]}</pre>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-slate-50/50 text-xs text-slate-600 italic">
                      <strong>Impact:</strong> {result[3]}
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyState message="No Static Code Vulnerabilities Found" />}
          </section>

          {/* SECTION 2: DAST RESULTS (Dynamic Analysis) */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b-2 border-slate-100 pb-2">
              <Launch className="text-indigo-600" />
              <h2 className="text-xl font-black uppercase text-slate-800 tracking-wide">Dynamic Application Testing (DAST)</h2>
            </div>

            {DASTresults?.length > 0 ? (
              <div className="space-y-8">
                {DASTresults.map((dast, idx) => (
                  <div key={idx} className="space-y-6">
                    {/* Header Issues Sub-section */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <WarningAmber className="text-amber-500" /> Network & Header Issues
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dast?.data?.headerIssues?.map((issue, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded text-sm">
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Leaks Sub-section */}
                    <div className="bg-white p-6 rounded-xl border-2 border-red-50 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <BugReport className="text-red-600" /> Exposed Sensitive Data
                      </h3>
                      <div className="space-y-4">
                        {dast?.data?.leaks?.map((leak, i) => (
                          <div key={i} className="border-l-4 border-red-500 pl-4 py-1">
                            <p className="text-xs font-black text-red-600 uppercase mb-2">{leak.type}</p>
                            <code className="block bg-slate-900 text-indigo-300 p-4 rounded-md text-[10px] break-all font-mono leading-relaxed">
                              {leak?.data?.[0] || "No data available"}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyState message="No Runtime Vulnerabilities Found" />}
          </section>
        </div>

        {/* FOOTER */}
        <footer className="p-10 border-t border-slate-100 bg-slate-50 text-center">
          <p className="text-xs text-slate-400 italic">Generated by DevShield Security Suite • {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
};

// Simple helper for empty sections
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
    <CheckCircle className="text-emerald-500 mb-2" sx={{ fontSize: 40 }} />
    <p className="text-slate-400 font-medium">{message}</p>
  </div>
);

export default Report;