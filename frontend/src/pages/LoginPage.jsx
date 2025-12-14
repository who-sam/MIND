import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [signupEmailError, setSignupEmailError] = useState(false);
  const [signupPasswordError, setSignupPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const showTab = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const validatePassword = (password) => {
    return password.trim().length >= 6;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);
    setErrorMessage('');

    let valid = true;
    if (!validateEmail(email)) {
      setEmailError(true);
      valid = false;
    }
    if (!validatePassword(password)) {
      setPasswordError(true);
      valid = false;
    }

    if (valid) {
      setIsLoading(true);
      try {
        await authAPI.login(email, password);
        navigate('/notes');
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupEmailError(false);
    setSignupPasswordError(false);
    setErrorMessage('');

    let valid = true;
    if (!validateEmail(signupEmail)) {
      setSignupEmailError(true);
      valid = false;
    }
    if (!validatePassword(signupPassword)) {
      setSignupPasswordError(true);
      valid = false;
    }

    if (valid) {
      setIsLoading(true);
      try {
        await authAPI.signup(signupEmail, signupPassword);
        navigate('/notes');
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = () => {
    alert("Google Sign-In is not implemented in demo.");
  };

  return (
    <div className="min-h-screen bg-richblack flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-customgray mb-4">
              <i className="fas fa-sticky-note text-3xl text-customblue"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Notes</h1>
            <p className="text-sidebarInactive mt-2">Your thoughts, organized.</p>
          </div>

          {/* Login Card */}
          <div className="login-card sidebar-glass rounded-3xl p-8 shadow-xl">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <button
                className={`login-tab px-5 py-2 text-sm font-semibold rounded-xl transition ${
                  activeTab === 'login'
                    ? 'bg-customgray text-white'
                    : 'text-sidebarInactive hover:text-white'
                }`}
                type="button"
                onClick={() => showTab('login')}
              >
                Login
              </button>
              <button
                className={`login-tab px-5 py-2 text-sm font-semibold rounded-xl transition ${
                  activeTab === 'signup'
                    ? 'bg-customgray text-white'
                    : 'text-sidebarInactive hover:text-white'
                }`}
                type="button"
                onClick={() => showTab('signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-customred bg-opacity-20 border border-customred border-opacity-40 text-customred rounded-xl text-sm">
                {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form className={`space-y-5 ${activeTab === 'login' ? '' : 'hidden'}`} onSubmit={handleLoginSubmit} autoComplete="off">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-sidebarInactive mb-2">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input w-full bg-customgray text-white rounded-xl px-4 py-3 outline-none border border-sidebarBorder placeholder:text-sidebarInactive focus:ring-2 focus:ring-customblue transition font-medium"
                />
                {emailError && <div className="text-xs text-customred mt-1">Please enter a valid email address.</div>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-sidebarInactive mb-2">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input w-full bg-customgray text-white rounded-xl px-4 py-3 outline-none border border-sidebarBorder placeholder:text-sidebarInactive focus:ring-2 focus:ring-customblue transition font-medium"
                />
                {passwordError && <div className="text-xs text-customred mt-1">Password must be at least 6 characters.</div>}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-customblue text-white font-semibold text-base shadow-md hover:bg-opacity-90 focus:ring-2 focus:ring-customblue focus:ring-offset-2 focus:ring-offset-richblack transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i> Logging in...
                  </span>
                ) : 'Login'}
              </button>
            </form>

            {/* Signup Form */}
            <form className={`space-y-5 ${activeTab === 'signup' ? '' : 'hidden'}`} onSubmit={handleSignupSubmit} autoComplete="off">
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-sidebarInactive mb-2">Email</label>
                <input
                  id="signup-email"
                  name="signup-email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="login-input w-full bg-customgray text-white rounded-xl px-4 py-3 outline-none border border-sidebarBorder placeholder:text-sidebarInactive focus:ring-2 focus:ring-customblue transition font-medium"
                />
                {signupEmailError && <div className="text-xs text-customred mt-1">Please enter a valid email address.</div>}
              </div>
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-sidebarInactive mb-2">Password</label>
                <input
                  id="signup-password"
                  name="signup-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Create a password (min 6 characters)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="login-input w-full bg-customgray text-white rounded-xl px-4 py-3 outline-none border border-sidebarBorder placeholder:text-sidebarInactive focus:ring-2 focus:ring-customblue transition font-medium"
                />
                {signupPasswordError && <div className="text-xs text-customred mt-1">Password must be at least 6 characters.</div>}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-customgreen text-richblack font-semibold text-base shadow-md hover:bg-opacity-90 focus:ring-2 focus:ring-customgreen focus:ring-offset-2 focus:ring-offset-richblack transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i> Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <span className="flex-grow border-t border-sidebarBorder"></span>
              <span className="mx-4 text-sidebarInactive text-sm">or</span>
              <span className="flex-grow border-t border-sidebarBorder"></span>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-customgray text-white font-medium text-base border border-sidebarBorder hover:bg-sidebarHighlight focus:ring-2 focus:ring-customblue transition"
              onClick={handleGoogleSignIn}
            >
              <i className="fab fa-google text-lg"></i>
              Continue with Google
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-6 mt-8 text-sidebarInactive text-xs font-medium">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <span className="text-sidebarBorder">•</span>
            <a href="#" className="hover:text-white transition">Terms</a>
            <span className="text-sidebarBorder">•</span>
            <a href="#" className="hover:text-white transition">Support</a>
          </div>
        </div>
    </div>
  );
}

export default LoginPage;
