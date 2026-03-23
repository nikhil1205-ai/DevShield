import React from "react";
import { useScanContext } from "../context/ScanContext";
import {
  Shield,
  Code,
  Launch,
  CheckCircle
} from "@mui/icons-material";

const Report = () => {
  const { scanId, SATSresults, DASTresults } = useScanContext();

  // -----------------------------
  // ✅ COUNT LOGIC (UPDATED)
  // -----------------------------
  console.log(SATSresults);
  console.log(DASTresults);
  const sastCount =
    SATSresults?.reduce(
      (acc, file) => acc + (file.sections?.length || 0),
      0
    ) || 0;

  const webScan = DASTresults?.find(
    (r) => r.scanType === "Website URL Scan"
  );

  const apiScan = DASTresults?.find(
    (r) => r.scanType === "API Schema Scan"
  );

  const dastCount =
    (webScan?.data?.headerIssues?.length || 0) +
    (webScan?.data?.leaks?.length || 0) +
    (apiScan?.data?.rule_engine?.total_vulnerabilities || 0);

  const total = sastCount + dastCount;

  // -----------------------------
  // ✅ RISK LEVEL
  // -----------------------------
  let risk = "Low";
  let riskColor = "text-emerald-500";

  if (total > 10) {
    risk = "Critical";
    riskColor = "text-red-500";
  } else if (total > 5) {
    risk = "High";
    riskColor = "text-amber-500";
  } else if (total > 0) {
    risk = "Medium";
    riskColor = "text-yellow-500";
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-sm border border-slate-200 overflow-hidden">

        {/* HEADER */}
        <header className="bg-slate-900 text-white p-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black mb-2 uppercase">
                Security Assessment Report
              </h1>
              <p className="text-slate-400 text-sm">
                Scan ID: {scanId || "DEVS-882-991"}
              </p>
            </div>
            <Shield sx={{ fontSize: 50 }} className="text-indigo-400" />
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10 border-t border-slate-700 pt-8">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Total Vulnerabilities</p>
              <p className="text-2xl font-black text-red-500">{total}</p>
            </div>
            <div className="text-center border-x border-slate-700">
              <p className="text-xs text-slate-500 mb-1">Scan Status</p>
              <p className="text-xl font-bold text-emerald-400">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Risk Level</p>
              <p className={`text-xl font-bold ${riskColor}`}>{risk}</p>
            </div>
          </div>
        </header>

        <div className="p-10 space-y-12">

          {/* ----------------------------- */}
          {/* ✅ SAST SECTION */}
          {/* ----------------------------- */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b pb-2">
              <Code className="text-indigo-600" />
              <h2 className="text-xl font-black uppercase">
                Static Code Analysis (SAST)
              </h2>
            </div>

            {sastCount > 0 ? (
              <div className="space-y-6">
                {SATSresults?.map((fileData, fileIdx) =>
                  fileData.sections?.map((issue, idx) => (
                    <div key={`${fileIdx}-${idx}`} className="border rounded-lg overflow-hidden">

                      <div className="bg-slate-50 px-4 py-2 flex justify-between">
                        <span className="text-xs font-mono">
                          File: {fileData.file.split("\\").pop()}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-red-100 text-red-700">
                          {issue.severity}
                        </span>
                      </div>

                      <div className="p-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-slate-400">Vulnerable Code</p>
                          <pre className="bg-red-50 p-2 text-xs">
                            {issue.section}
                          </pre>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-400">Fix</p>
                          <pre className="bg-emerald-50 p-2 text-xs">
                            {issue.fix}
                          </pre>
                        </div>
                      </div>

                      <div className="px-4 py-2 text-xs italic text-slate-600">
                        {issue.why}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <EmptyState message="No Static Code Vulnerabilities Found" />
            )}
          </section>

          {/* ----------------------------- */}
          {/* ✅ DAST SECTION */}
          {/* ----------------------------- */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b pb-2">
              <Launch className="text-indigo-600" />
              <h2 className="text-xl font-black uppercase">
                Dynamic Analysis (DAST)
              </h2>
            </div>

            {dastCount > 0 ? (
              <div className="space-y-6">

                {/* WEBSITE SCAN */}
                {webScan && (
                  <>
                    {/* Header Issues */}
                    {webScan.data?.headerIssues?.map((h, i) => (
                      <div key={i} className="border rounded p-4">
                        <div className="flex justify-between">
                          <p className="font-bold text-sm">{h.header}</p>
                          <span className="text-xs font-bold text-red-600">
                            {h.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {h.message}
                        </p>
                      </div>
                    ))}

                    {/* Leaks */}
                    {webScan.data?.leaks?.map((l, i) => (
                      <div key={i} className="border rounded p-4">
                        <div className="flex justify-between">
                          <p className="text-xs font-bold">{l.type}</p>
                          <span className="text-xs text-red-600">
                            {l.severity}
                          </span>
                        </div>
                        <p className="text-xs font-mono mt-1 text-red-600">
                          {l.masked_value}
                        </p>
                      </div>
                    ))}
                  </>
                )}

                {/* API SCAN */}
                {apiScan && (
                  <>
                    {apiScan.data?.rule_engine?.rule_engine_findings?.map((f, i) => (
                      <div key={i} className="border rounded p-4">
                        <div className="flex justify-between">
                          <p className="font-bold text-sm">{f.type}</p>
                          <span className="text-xs text-red-600">
                            {f.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {f.endpoint}
                        </p>
                      </div>
                    ))}
                  </>
                )}

              </div>
            ) : (
              <EmptyState message="No Runtime Vulnerabilities Found" />
            )}
          </section>

        </div>

        {/* FOOTER */}
        <footer className="p-10 border-t bg-slate-50 text-center">
          <p className="text-xs text-slate-400">
            Generated by DevShield • {new Date().toLocaleDateString()}
          </p>
        </footer>
      </div>
    </div>
  );
};

// EMPTY STATE
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-xl">
    <CheckCircle className="text-emerald-500 mb-2" sx={{ fontSize: 40 }} />
    <p className="text-slate-400">{message}</p>
  </div>
);

export default Report;