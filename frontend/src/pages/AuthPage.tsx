import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { FaPaintBrush, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import type { LoginInput, SignupInput } from "../types/auth";
import { authService } from "../services/authService";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Form states
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login(loginData);
      authService.setToken(response.token);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
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
      authService.setToken(response.token);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: theme.colors.background }}
    >
      {/* Left Side - Art Image (Desktop Only) */}
      <div
        className="hidden md:flex md:w-1/2 relative overflow-hidden"
        style={{ background: theme.colors.secondary }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <div
              className="inline-block p-6 rounded-3xl mb-6"
              style={{
                background: `${theme.colors.surface}20`,
              }}
            >
              <FaPaintBrush
                className="text-7xl"
                style={{ color: theme.colors.surface }}
              />
            </div>
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: theme.colors.surface }}
            >
              Welcome to ArtStore
            </h2>
            <p
              className="text-lg max-w-md mx-auto"
              style={{ color: `${theme.colors.surface}dd` }}
            >
              Discover and collect exceptional artworks from talented artists
              around the world
            </p>
          </div>
        </div>

        {/* Decorative circles */}
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: theme.colors.surface }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-10"
          style={{ background: theme.colors.surface }}
        />
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <div
              className="p-3 rounded-xl mb-4"
              style={{
                background: `${theme.colors.accent}80`,
              }}
            >
              <FaPaintBrush
                className="text-3xl"
                style={{ color: theme.colors.secondary }}
              />
            </div>
          </div>

          {/* Auth Card */}
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.accent}`,
            }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: theme.colors.primary }}
              >
                {isSignUp ? "Create Account" : "Sign In"}
              </h1>
              <p
                className="text-sm"
                style={{ color: `${theme.colors.primary}99` }}
              >
                {isSignUp
                  ? "Join our community of art lovers"
                  : "Welcome back! Please sign in to continue"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="mb-6 p-3 rounded-lg text-sm"
                style={{
                  background: error.includes("created")
                    ? `${theme.colors.success}20`
                    : `${theme.colors.error}20`,
                  color: error.includes("created")
                    ? theme.colors.success
                    : theme.colors.error,
                  border: `1px solid ${
                    error.includes("created")
                      ? theme.colors.success
                      : theme.colors.error
                  }40`,
                }}
              >
                {error}
              </div>
            )}

            {/* Forms */}
            {!isSignUp ? (
              // Sign In Form
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.primary }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: `${theme.colors.primary}66` }}
                    >
                      <FiMail className="text-lg" />
                    </div>
                    <input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-lg text-sm transition-all duration-200"
                      style={{
                        background: theme.colors.background,
                        border: `1px solid ${theme.colors.accent}`,
                        color: theme.colors.primary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.colors.secondary;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = theme.colors.accent;
                      }}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.primary }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: `${theme.colors.primary}66` }}
                    >
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3 rounded-lg text-sm transition-all duration-200"
                      style={{
                        background: theme.colors.background,
                        border: `1px solid ${theme.colors.accent}`,
                        color: theme.colors.primary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.colors.secondary;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = theme.colors.accent;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                      style={{ color: `${theme.colors.primary}66` }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.colors.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = `${theme.colors.primary}66`;
                      }}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-lg" />
                      ) : (
                        <FaEye className="text-lg" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: theme.colors.secondary,
                    color: theme.colors.surface,
                  }}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  {!isLoading && <FiArrowRight />}
                </button>
              </form>
            ) : (
              // Sign Up Form
              <form onSubmit={handleSignup} className="space-y-4">
                {/* First Name Input */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.primary }}
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: `${theme.colors.primary}66` }}
                    >
                      <FiUser className="text-lg" />
                    </div>
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
                      placeholder="John"
                      className="w-full pl-11 pr-4 py-3 rounded-lg text-sm transition-all duration-200"
                      style={{
                        background: theme.colors.background,
                        border: `1px solid ${theme.colors.accent}`,
                        color: theme.colors.primary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.colors.secondary;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = theme.colors.accent;
                      }}
                    />
                  </div>
                </div>

                {/* Last Name Input */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.primary }}
                  >
                    Last Name{" "}
                    <span style={{ color: `${theme.colors.primary}66` }}>
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: `${theme.colors.primary}66` }}
                    >
                      <FiUser className="text-lg" />
                    </div>
                    <input
                      type="text"
                      value={signupData.lastName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Doe"
                      className="w-full pl-11 pr-4 py-3 rounded-lg text-sm transition-all duration-200"
                      style={{
                        background: theme.colors.background,
                        border: `1px solid ${theme.colors.accent}`,
                        color: theme.colors.primary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.colors.secondary;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = theme.colors.accent;
                      }}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.primary }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: `${theme.colors.primary}66` }}
                    >
                      <FiMail className="text-lg" />
                    </div>
                    <input
                      type="email"
                      required
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-lg text-sm transition-all duration-200"
                      style={{
                        background: theme.colors.background,
                        border: `1px solid ${theme.colors.accent}`,
                        color: theme.colors.primary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.colors.secondary;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = theme.colors.accent;
                      }}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.primary }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: `${theme.colors.primary}66` }}
                    >
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3 rounded-lg text-sm transition-all duration-200"
                      style={{
                        background: theme.colors.background,
                        border: `1px solid ${theme.colors.accent}`,
                        color: theme.colors.primary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.colors.secondary;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = theme.colors.accent;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                      style={{ color: `${theme.colors.primary}66` }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.colors.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = `${theme.colors.primary}66`;
                      }}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-lg" />
                      ) : (
                        <FaEye className="text-lg" />
                      )}
                    </button>
                  </div>
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: `${theme.colors.primary}66` }}
                  >
                    Minimum 6 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: theme.colors.secondary,
                    color: theme.colors.surface,
                  }}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                  {!isLoading && <FiArrowRight />}
                </button>
              </form>
            )}

            {/* Switch between Sign In/Sign Up */}
            <div className="mt-6 text-center">
              <p
                className="text-sm"
                style={{ color: `${theme.colors.primary}99` }}
              >
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                  }}
                  className="font-semibold transition-colors duration-200"
                  style={{ color: theme.colors.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = `${theme.colors.secondary}dd`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.secondary;
                  }}
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
