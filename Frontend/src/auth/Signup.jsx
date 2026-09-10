import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../../firebase.js";
import { Shield, Google, Person, Email, Lock,ArrowForward,Visibility, VisibilityOff , ArrowBackIosNew} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const Signup = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      showToast("All fields are required", "warning");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match", "warning");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await updateProfile(res.user, {
        displayName: form.name
      });

      showToast("Account created successfully! Welcome to DevShield.", "success");
      setTimeout(() => navigate("/dash"), 500); 
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        showToast("Email already registered. Please log in instead.", "error");
      } else {
        showToast(err.message ? err.message.replace("Firebase: ", "") : "Signup failed.", "error");
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast("Signed up with Google successfully!", "success");
      setTimeout(() => navigate("/dash"), 500); 
    } catch (err) {
      showToast(err.message ? err.message.replace("Firebase: ", "") : "Google signup failed.", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 font-sans">
      <button 
          onClick={() => navigate(-1)} 
              className="fixed top-8 left-8 flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all group z-50 shadow-xl"
          >
          <ArrowBackIosNew sx={{ fontSize: 12 }} className="group-hover:-translate-x-1 transition-transform" />
          <Link className="text-xs font-bold uppercase tracking-widest" to="/">Go Back</Link>
      </button>
      {/* Background Decorative Blobs */}
      <div className="fixed top-0 -left-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="fixed bottom-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

      <div className="relative flex w-full max-w-4xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* --- LEFT SIDE: BRANDING PANEL --- */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 p-12 flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <Shield sx={{ fontSize: 32 }} />
              <span className="text-xl font-black tracking-widest uppercase">DevShield</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Secure your code, <br />Scale your vision.
            </h1>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Join 10,000+ developers using our SAST & DAST engine to eliminate vulnerabilities before they reach production.
            </p>
          </div>
          <div className="text-xs text-indigo-200 uppercase tracking-widest font-bold">
            Automated Security • Real-time Monitoring
          </div>
        </div>

        {/* --- RIGHT SIDE: SIGNUP FORM --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-900">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-slate-400 text-sm">Start your 14-day free trial today.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
            className="space-y-4"
          >
            {/* Input Group: Name */}
            <div className="relative">
              <Person className="absolute left-3 top-3 text-slate-500" sx={{ fontSize: 20 }} />
              <input 
                name="name" 
                placeholder="Full Name" 
                onChange={handleChange} 
                className="w-full bg-slate-800/50 border border-slate-700 p-3 pl-10 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
              />
            </div>

            {/* Input Group: Email */}
            <div className="relative">
              <Email className="absolute left-3 top-3 text-slate-500" sx={{ fontSize: 20 }} />
              <input 
                name="email" 
                placeholder="Email Address" 
                onChange={handleChange} 
                type="email"
                className="w-full bg-slate-800/50 border border-slate-700 p-3 pl-10 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
              />
            </div>

            {/* Input Group: Password with Show/Hide Toggle */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" sx={{ fontSize: 20 }} />
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Create Password" 
                onChange={handleChange} 
                className="w-full bg-slate-800/50 border border-slate-700 p-3 pl-10 pr-10 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-indigo-400 transition-colors"
              >
                {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" sx={{ fontSize: 20 }} />
              <input 
                name="confirmPassword" 
                type={showPassword ? "text" : "password"} 
                placeholder="Confirm Password" 
                onChange={handleChange} 
                className="w-full bg-slate-800/50 border border-slate-700 p-3 pl-10 pr-10 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-indigo-400 transition-colors"
              >
                {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
              </button>
            </div>

            <button 
                type="submit"
                className="w-full bg-gradient-to-br from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 border border-white/10 shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] group"
                >
                <span>Get Started</span>
                <ArrowForward 
                    sx={{ fontSize: 18 }} 
                    className="group-hover:translate-x-1 transition-transform" 
                />
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or continue with</span></div>
            </div>

            <button 
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all"
                >
                  <Google sx={{ fontSize: 18 }} />
                  Sign up with Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link className="text-indigo-400 font-bold cursor-pointer hover:underline transition-colors hover:text-indigo-300" to='/login'>
                Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;

