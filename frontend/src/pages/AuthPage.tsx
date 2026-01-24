import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import {
  FaPaintBrush,
  FaEye,
  FaEyeSlash,
  FaHeart,
  FaLayerGroup,
} from "react-icons/fa";
import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import type { LoginInput, SignupInput } from "../types/auth";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [loginData, setLoginData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState<SignupInput>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    // Set CSS variables for performant animation without re-renders
    containerRef.current.style.setProperty("--mouse-x", x.toString());
    containerRef.current.style.setProperty("--mouse-y", y.toString());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await authService.login(loginData);
      login(response.token);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await authService.signup(signupData);
      login(response.token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden selection:bg-secondary/30"
      style={{ background: theme.colors.background }}
    >
      {/* --- Left Side: Artistic Showcase (Desktop) --- */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="hidden lg:flex lg:w-3/5 relative items-center justify-center p-12 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.accent}40 0%, ${theme.colors.background} 100%)`,
        }}
      >
        {/* --- DYNAMIC BACKGROUND SPOTLIGHT --- */}
        {/* This creates a soft glow that follows the mouse */}
        <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle 600px at calc(var(--mouse-x, 0.5) * 100% + 50%) calc(var(--mouse-y, 0.5) * 100% + 50%), ${theme.colors.accent}66, transparent 100%)`,
              opacity: isMounted ? 1 : 0
            }}
        />

        {/* Artistic Background blobs - Subtle Movement */}
        <div 
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full opacity-20 blur-3xl animate-float-organic transition-transform duration-700 ease-out"
            style={{ 
              background: theme.colors.secondary,
              // Move slightly AWAY from mouse for depth
              transform: 'translate(calc(var(--mouse-x, 0) * -40px), calc(var(--mouse-y, 0) * -40px))'
            }}
          />
          <div
            className="absolute bottom-[5%] right-[-5%] w-[35%] h-[35%] rounded-full opacity-10 blur-3xl animate-float-organic-re transition-transform duration-700 ease-out"
            style={{ 
              background: theme.colors.primary, 
              animationDelay: "1s",
              // Move slightly AWAY from mouse for depth
              transform: 'translate(calc(var(--mouse-x, 0) * -30px), calc(var(--mouse-y, 0) * -30px))'
            }}
          />
        </div>

        <div
          className={`relative z-10 w-full max-w-2xl transition-all duration-1000 ease-out ${isMounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
        >
          <div className="flex flex-col gap-6 ">
            
             {/* Main Creative Card - Static but Glassy */}
            <div 
               className="relative"
            >
              <div 
                className="backdrop-blur-2xl border border-white/60 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
                style={{ background: `${theme.colors.surface}CC` }}
              >
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-10 translate-x-10 blur-2xl" 
                  style={{ background: `${theme.colors.secondary}0D` }} 
                />

                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest mb-6 border border-white/20 shadow-sm transition-transform duration-200 ease-out will-change-transform"
                  style={{ 
                    background: `${theme.colors.secondary}1A`, 
                    color: theme.colors.secondary,
                    transform: 'translate(calc(var(--mouse-x, 0) * 10px), calc(var(--mouse-y, 0) * 10px))' // Magnetic badge
                  }}
                >
                  <FaHeart className="animate-pulse" /> Artist Owned & Operated
                </div>

                <h2
                  className="text-5xl font-black leading-[1.1] mb-6 drop-shadow-sm"
                  style={{ color: theme.colors.primary }}
                >
                  From{" "}
                  <span style={{ color: theme.colors.secondary }}>Stitches</span>{" "}
                  <br />
                  to{" "}
                  <span style={{ color: theme.colors.secondary }}>Strokes</span>.
                </h2>

                <p
                  className="text-lg font-medium opacity-70 mb-10 leading-relaxed max-w-md"
                  style={{ color: theme.colors.primary }}
                >
                  Every piece tells a story. From my studio to your home, discover art that speaks to you.
                </p>

                {/* Tags/Categories */}
                <div className="flex flex-wrap gap-3 mb-2">
                  {[
                    "Amigurumi",
                    "Fine Art",
                    "Digital Prints",
                    "Artisan Crafts",
                  ].map((cat) => (
                    <span
                      key={cat}
                      className="px-5 py-2.5 rounded-2xl bg-white/80 border shadow-sm text-sm font-bold hover:scale-105 transition-transform cursor-default"
                      style={{
                        borderColor: `${theme.colors.accent}4D`,
                        color: `${theme.colors.primary}99`
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom floating elements - Parallax Layer (Front) */}
            <div className="flex gap-6">
              {/* Card 1 */}
              <div 
                className="flex-1 animate-float"
                style={{ animationDuration: '6s' }}
              >
                  <div 
                    className="p-8 rounded-[2.5rem] shadow-xl flex flex-col items-start gap-3 transition-transform duration-100 ease-out h-full border border-white/20 backdrop-blur-md"
                    style={{ 
                      background: theme.colors.secondary, 
                      color: theme.colors.surface,
                      boxShadow: `0 20px 40px -10px ${theme.colors.secondary}40`,
                      // Removed translate
                    }}
                  >
                    <div 
                        className="p-3 bg-white/20 rounded-2xl shadow-inner transition-transform duration-200 ease-out will-change-transform"
                        style={{
                             transform: 'translate(calc(var(--mouse-x, 0) * 15px), calc(var(--mouse-y, 0) * 15px))' // Magnetic Icon
                        }}
                    >
                      <FaPaintBrush className="text-xl" />
                    </div>
                    <h3 className="font-black text-xl leading-none">
                      Direct from <br /> Studio
                    </h3>
                    <p className="text-sm opacity-90 font-medium">
                      Created, signed, and shipped by the artist.
                    </p>
                  </div>
              </div>

              {/* Card 2 */}
              <div
                className="flex-1 animate-float"
                style={{ animationDelay: "1.5s", animationDuration: '7s' }}
              >
                 <div 
                    className="p-8 rounded-[2.5rem] shadow-xl flex flex-col items-start gap-3 transition-transform duration-100 ease-out h-full border border-white/20 backdrop-blur-md"
                    style={{ 
                      background: theme.colors.primary, 
                      color: theme.colors.surface,
                      boxShadow: `0 20px 40px -10px ${theme.colors.primary}40`,
                      // Removed translate
                    }}
                  >
                    <div 
                        className="p-3 bg-white/10 rounded-2xl shadow-inner transition-transform duration-200 ease-out will-change-transform"
                        style={{
                             transform: 'translate(calc(var(--mouse-x, 0) * 15px), calc(var(--mouse-y, 0) * 15px))' // Magnetic Icon
                        }}
                    >
                      <FaLayerGroup className="text-xl" />
                    </div>
                    <h3 className="font-black text-xl leading-none">
                      Unique <br />
                      Creations
                    </h3>
                    <p className="text-sm opacity-90 font-medium">
                      No mass production. Just authentic creativity.
                    </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Right Side: Auth Container --- */}
      <div
        className="w-full lg:w-2/5 flex items-center justify-center p-6 relative"
        style={{ background: theme.colors.surface }}
      >
        <div
          className={`w-full max-w-md transition-all duration-700 delay-300 transform ${isMounted ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
        >
          {/* Header */}
          <div className="flex flex-col items-start mb-10">
            <div
              className="p-4 rounded-xl mb-6"
              style={{
                background: `${theme.colors.accent}80`,
                color: theme.colors.secondary,
              }}
            >
              <FaPaintBrush className="text-xl md:text-3xl" />
            </div>
            <h1
              className="text-4xl font-black tracking-tight"
              style={{ color: theme.colors.primary }}
            >
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p
              className="mt-2 font-bold text-lg"
              style={{ color: theme.colors.primary, opacity: 0.6 }}
            >
              {isSignUp
                ? "Sign up to discover handmade art."
                : "Sign in to continue your journey."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-4 rounded-lg border text-sm font-bold flex items-center gap-3"
              style={{
                background: theme.colors.error + "15",
                borderColor: theme.colors.error + "40",
                color: theme.colors.error,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: theme.colors.error }}
              />
              {error}
            </div>
          )}

          {/* Auth Form */}
          <div className="space-y-6">
            <form
              onSubmit={isSignUp ? handleSignup : handleLogin}
              className="space-y-4"
            >
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      className="text-xs font-black uppercase tracking-widest ml-1"
                      style={{ color: theme.colors.primary }}
                    >
                      First Name
                    </label>
                    <div className="relative group">
                      <FiUser
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: theme.colors.primary }}
                      />
                      <input
                        type="text"
                        required
                        value={signupData.firstName}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full pl-12 pr-4 py-4 rounded-lg transition-all outline-none font-bold"
                        style={{
                          color: theme.colors.primary,
                        }}
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-xs font-black uppercase tracking-widest ml-1"
                      style={{ color: theme.colors.primary }}
                    >
                      Last Name
                    </label>
                    <div className="relative group">
                      <FiUser
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: theme.colors.primary }}
                      />
                      <input
                        type="text"
                        value={signupData.lastName}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full pl-12 pr-4 py-4 rounded-lg transition-all outline-none font-bold"
                        style={{
                          color: theme.colors.primary,
                        }}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label
                  className="text-xs font-black uppercase tracking-widest ml-1"
                  style={{ color: theme.colors.primary }}
                >
                  Email Address
                </label>
                <div className="relative group">
                  <FiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: theme.colors.primary }}
                  />
                  <input
                    type="email"
                    required
                    value={isSignUp ? signupData.email : loginData.email}
                    onChange={(e) =>
                      isSignUp
                        ? setSignupData({
                            ...signupData,
                            email: e.target.value,
                          })
                        : setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-lg transition-all outline-none font-bold"
                    style={{
                      color: theme.colors.primary,
                    }}
                    placeholder="artist@artstore.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label
                    className="text-xs font-black uppercase tracking-widest ml-1"
                    style={{ color: theme.colors.primary }}
                  >
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      className="text-xs font-bold hover:underline underline-offset-8"
                      style={{
                        color: theme.colors.secondary,
                      }}
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: theme.colors.primary }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={isSignUp ? signupData.password : loginData.password}
                    onChange={(e) =>
                      isSignUp
                        ? setSignupData({
                            ...signupData,
                            password: e.target.value,
                          })
                        : setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-lg transition-all outline-none font-bold"
                    style={{
                      color: theme.colors.primary,
                    }}
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                    style={{ color: theme.colors.primary }}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-black text-xl shadow-xl hover:scale-[1.03] active:scale-[0.99] transition-all disabled:opacity-70 disabled:pointer-events-none mt-4 flex items-center justify-center gap-2"
                style={{
                  background: theme.colors.secondary,
                  color: theme.colors.surface,
                }}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 rounded-full animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Sign Up" : "Sign In"}
                    <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 py-2">
              <div
                className="flex-1 h-px"
                style={{ background: theme.colors.primary, opacity: 0.1 }}
              />
              <span
                className="text-[10px] font-black uppercase tracking-[0.2em]"
                style={{ color: theme.colors.primary }}
              >
                Or Continue With
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: theme.colors.primary, opacity: 0.1 }}
              />
            </div>

            <button
              type="button"
              className="w-full py-4 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-3 active:scale-[0.99] hover:scale-[1.03]"
              style={{
                background: `${theme.colors.accent}50`,
                color: theme.colors.primary,
                borderColor: theme.colors.accent,
              }}
            >
              <FcGoogle className="w-5 h-5" />
              Google Account
            </button>

            <p
              className="pt-2 text-center font-bold text-sm"
              style={{ color: theme.colors.primary }}
            >
              {isSignUp ? "Already have an account?" : "New to the art store?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="hover:underline underline-offset-8"
                style={{ color: theme.colors.secondary }}
              >
                {isSignUp ? "Sign In" : "Register Now"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
