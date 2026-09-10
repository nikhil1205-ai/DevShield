import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase.js";
import { Shield, Google, Email,Visibility,VisibilityOff, Lock, Login as LoginIcon, ArrowBackIosNew } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const formatAuthError = (err) => {
  if (!err) return "An unexpected error occurred.";
  const code = err.code || "";
  if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
    return "Invalid email or password. Please try again.";
  }
  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (code === "auth/user-disabled") {
    return "This user account has been disabled.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many failed login attempts. Please try again later.";
  }
  return err.message ? err.message.replace("Firebase: ", "") : "Login failed.";
};

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      showToast("Please fill in both email and password.", "warning");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => navigate("/dash"), 500); 
    } catch (err) {
      showToast(formatAuthError(err), "error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast("Logged in with Google successfully!", "success");
      setTimeout(() => navigate("/dash"), 500); 
    } catch (err) {
      showToast(formatAuthError(err), "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 font-sans relative">
      
      {/* --- GO BACK BUTTON (Refined Dark Style) --- */}
      <button 
        onClick={() => navigate(-1)} 
        className="fixed top-8 left-8 flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all group z-50 shadow-xl"
      >
        <ArrowBackIosNew sx={{ fontSize: 12 }} className="group-hover:-translate-x-1 transition-transform" />
        <Link className="text-xs font-bold uppercase tracking-widest" to="/">Go Back</Link>
      </button>

      {/* Background Decorative Blobs */}
      <div className="fixed top-0 -left-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      <div className="fixed bottom-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />

      <div className="relative flex w-full max-w-4xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* --- LEFT SIDE: BRANDING PANEL --- */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 p-12 flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <Shield sx={{ fontSize: 32 }} />
              <span className="text-xl font-black tracking-widest uppercase">DevShield</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Welcome Back <br />to the Hub.
            </h1>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Access your security dashboard, track live vulnerabilities, and manage your team's code integrity in one place.
            </p>
          </div>
          <div className="text-xs text-indigo-200 uppercase tracking-widest font-bold">
            Verified Sessions • Encrypted Access
          </div>
        </div>

        {/* --- RIGHT SIDE: LOGIN FORM --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-900">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Login</h2>
            <p className="text-slate-400 text-sm">Welcome back! Please enter your details.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-5"
          >
            {/* Input Group: Email */}
            <div className="relative">
              <Email className="absolute left-3 top-3.5 text-slate-500" sx={{ fontSize: 20 }} />
              <input 
                name="email" 
                type="email"
                placeholder="Email Address" 
                onChange={handleChange} 
                className="w-full bg-slate-800/40 border border-slate-700 p-3.5 pl-10 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600" 
              />
            </div>

            {/* Input Group: Password + Toggle */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-500" sx={{ fontSize: 20 }} />
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                onChange={handleChange} 
                className="w-full bg-slate-800/40 border border-slate-700 p-3.5 pl-10 pr-12 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600" 
              />
              {/* EYE ICON TOGGLE */}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-indigo-400 transition-colors"
              >
                {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
              </button>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">Forgot Password?</span>
            </div>

            {/* GRADIENT BUTTON */}
            <button 
              type="submit"
              className="w-full bg-gradient-to-br from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 border border-white/10 shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] group"
            >
              <span>Login</span>
              <LoginIcon sx={{ fontSize: 18 }} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or continue with</span></div>
            </div>

            <button 
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white text-slate-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all"
              >
                <Google sx={{ fontSize: 18 }} />
                Login with Google
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-400 font-bold cursor-pointer hover:underline transition-colors hover:text-indigo-300">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
