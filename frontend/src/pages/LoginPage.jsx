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
    setEmailError(false);
    setPasswordError(false);
    setSignupEmailError(false);
    setSignupPasswordError(false);
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
    <main className="flex min-h-screen w-full items-center justify-center bg-[#0B101B] px-4 py-8">
      <section className="w-full max-w-6xl mx-auto flex flex-row gap-0 shadow-xlarge overflow-hidden anim-fadein rounded-3xl" style={{minHeight:'700px'}}>
        <div className="flex flex-col justify-center z-10 w-full lg:w-1/3 min-w-[300px] glass-bg px-8 sm:px-14 py-10 rounded-l-3xl">
          <div className="flex items-center space-x-3 mb-8">
            <button
              className={`tab-btn px-5 py-2 text-base font-semibold rounded-xl outline-none focus:ring-2 focus:ring-[#3B9AE1] ${activeTab === 'login' ? 'active' : 'inactive'}`}
              type="button"
              aria-selected={activeTab === 'login'}
              onClick={() => showTab('login')}
            >
              Login
            </button>
            <button
              className={`tab-btn px-5 py-2 text-base font-semibold rounded-xl outline-none focus:ring-2 focus:ring-[#3B9AE1] ${activeTab === 'signup' ? 'active' : 'inactive'}`}
              type="button"
              aria-selected={activeTab === 'signup'}
              onClick={() => showTab('signup')}
            >
              Sign Up
            </button>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-white tracking-tight">Welcome!</h1>
          <p className="text-base text-gray-400 mb-8 leading-relaxed">Access your notes. Sign in with your email or Google account.</p>
          
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-600/30 text-red-400 rounded-xl backdrop-blur-sm animate-shake">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {errorMessage}
            </div>
          )}
          
          <form className={`space-y-6 ${activeTab === 'login' ? '' : 'hidden'}`} onSubmit={handleLoginSubmit} autoComplete="off">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass w-full rounded-xl px-5 py-3.5 bg-opacity-90 text-white border border-[#282C38] focus:ring-2 focus:ring-[#3B9AE1]/50 outline-none font-medium transition-all"
                aria-label="Email"
              />
              {emailError && <div className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <i className="fas fa-info-circle"></i>
                Please enter a valid email address.
              </div>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass w-full rounded-xl px-5 py-3.5 bg-opacity-90 text-white border border-[#282C38] focus:ring-2 focus:ring-[#3B9AE1]/50 outline-none font-medium transition-all"
                aria-label="Password"
              />
              {passwordError && <div className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <i className="fas fa-info-circle"></i>
                Password must be at least 6 characters.
              </div>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="login-btn w-full py-3.5 rounded-xl bg-[#3B9AE1] text-white font-bold text-lg shadow-lg hover:shadow-xl focus:ring-2 focus:ring-[#3B9AE1]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Login"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i>
                  Logging in...
                </span>
              ) : 'Login'}
            </button>
          </form>
          
          <form className={`space-y-6 ${activeTab === 'signup' ? '' : 'hidden'}`} onSubmit={handleSignupSubmit} autoComplete="off">
            <div>
              <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
              <input
                id="signup-email"
                name="signup-email"
                type="email"
                required
                autoComplete="username"
                placeholder="you@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="input-glass w-full rounded-xl px-5 py-3.5 bg-opacity-90 text-white border border-[#282C38] focus:ring-2 focus:ring-[#3B9AE1]/50 outline-none font-medium transition-all"
                aria-label="Email"
              />
              {signupEmailError && <div className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <i className="fas fa-info-circle"></i>
                Please enter a valid email address.
              </div>}
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input
                id="signup-password"
                name="signup-password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Create a password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="input-glass w-full rounded-xl px-5 py-3.5 bg-opacity-90 text-white border border-[#282C38] focus:ring-2 focus:ring-[#3B9AE1]/50 outline-none font-medium transition-all"
                aria-label="Password"
              />
              {signupPasswordError && <div className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <i className="fas fa-info-circle"></i>
                Password must be at least 6 characters.
              </div>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="login-btn w-full py-3.5 rounded-xl bg-[#5DD39E] text-richblack font-bold text-lg shadow-lg hover:shadow-xl focus:ring-2 focus:ring-[#5DD39E]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Sign Up"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing up...
                </span>
              ) : 'Sign Up'}
            </button>
          </form>
          
          <div className="flex items-center my-8">
            <span className="flex-grow border-t border-[#282C38]"></span>
            <span className="mx-4 text-gray-500 text-sm font-medium">or</span>
            <span className="flex-grow border-t border-[#282C38]"></span>
          </div>
          
          <button
            type="button"
            className="google-btn w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gray-900 text-white font-semibold text-base shadow-lg border border-[#282C38] hover:bg-gray-800 focus:ring-2 focus:ring-[#3B9AE1]/50 transition-all"
            aria-label="Sign in with Google"
            onClick={handleGoogleSignIn}
          >
            <span className="w-6 h-6 flex items-center justify-center text-lg"><i className="fab fa-google"></i></span>
            Continue with Google
          </button>
          
          <div className="flex items-center justify-between mt-10 text-[#656A77] text-xs font-medium">
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors focus:text-white">Privacy</a>
              <a href="#" className="hover:text-white transition-colors focus:text-white">Terms</a>
            </div>
            <div className="text-gray-500 tracking-wide font-semibold text-xs">notes.app</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors focus:text-white">Support</a>
            </div>
          </div>
        </div>
        
        <div className="relative flex w-0 min-h-[500px] lg:w-2/3 overflow-hidden bg-[#16181E]">
          <img
            src="https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&w=1200&q=80"
            alt="Minimal futuristic workspace illustration"
            className="object-cover w-full h-full lg:rounded-r-3xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#181B20]/50 to-[#1D2230]/30 pointer-events-none"></div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
