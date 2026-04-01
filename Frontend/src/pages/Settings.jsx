import React, { useState } from "react";
import { 
  Person, 
  Notifications, 
  Security, 
  VpnKey, 
  CloudQueue, 
  Shield, 
  Save 
} from "@mui/icons-material";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const menuItems = [
    { id: "profile", label: "Profile", icon: <Person /> },
    { id: "account", label: "Account Security", icon: <Security /> },
    { id: "api", label: "API Keys", icon: <VpnKey /> },
    { id: "notifications", label: "Alerts & Notifications", icon: <Notifications /> },
    { id: "integrations", label: "Cloud Integrations", icon: <CloudQueue /> },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
            <Shield className="text-indigo-500" /> System Settings
          </h1>
          <p className="text-slate-400 mt-2">Manage your DevShield environment and security protocols.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- LEFT SIDEBAR NAV --- */}
          <aside className="w-full lg:w-64 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === item.id 
                  ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]" 
                  : "text-slate-500 hover:bg-slate-900/50 hover:text-slate-300"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </aside>

          {/* --- RIGHT CONTENT AREA --- */}
          <main className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "api" && <ApiSection />}
            {activeTab === "account" && <AccountSection />}
            
            {/* Global Save Button */}
            <div className="mt-10 pt-6 border-t border-slate-800 flex justify-end">
              <button className="flex items-center gap-2 bg-gradient-to-br from-indigo-600 to-blue-700 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
                <Save fontSize="small" /> Save Changes
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-SECTIONS --- */

const ProfileSection = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    <h2 className="text-xl font-bold border-b border-slate-800 pb-4">Public Profile</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
        <input className="w-full bg-slate-800/50 border border-slate-700 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all" defaultValue="" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
        <input className="w-full bg-slate-800/50 border border-slate-700 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all" defaultValue="" />
      </div>
    </div>
  </div>
);

const ApiSection = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
      <h2 className="text-xl font-bold">API Management</h2>
      <button className="text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-lg font-bold">Generate New Key</button>
    </div>
    <div className="bg-black/40 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
      <div>
        <p className="text-sm font-bold text-white">Production_Scanner_Key</p>
        <p className="text-xs text-slate-500 font-mono mt-1">ds_live_xxxxxxxxxxxxxxxxxxxxxx4a2b</p>
      </div>
      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20 font-bold uppercase">Active</span>
    </div>
  </div>
);

const AccountSection = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    <h2 className="text-xl font-bold border-b border-slate-800 pb-4">Security Protocols</h2>
    <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-800">
      <div>
        <p className="font-bold text-sm">Two-Factor Authentication (2FA)</p>
        <p className="text-xs text-slate-500">Secure your account with TOTP based authentication.</p>
      </div>
      <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
      </div>
    </div>
  </div>
);

export default Settings;