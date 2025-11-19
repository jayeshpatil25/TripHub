import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaFacebook, FaApple, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const { signup } = useAuthStore();
  const navigate = useNavigate();

    const handleSignup = (e) => {
    
        
    e.preventDefault();

    // const success = validateForm();

    // if (success === true) 
     signup(formData);


      };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12) return { strength: 75, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const features = [
    { icon: '🎯', text: 'Discover amazing destinations' },
    { icon: '🤝', text: 'Connect with fellow travelers' },
    { icon: '📸', text: 'Create unforgettable memories' },
    { icon: '🗺️', text: 'Plan your perfect journey' }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Left - Enhanced Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-16 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-32 right-20 w-32 h-32 bg-blue-300/20 rounded-full blur-xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 right-8 w-24 h-24 bg-purple-300/15 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 left-1/4 w-28 h-28 bg-indigo-300/10 rounded-full blur-xl animate-pulse delay-500"></div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-1/4 right-1/3 w-6 h-6 bg-white/20 rotate-45 animate-bounce delay-300"></div>
          <div className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-blue-200/30 rounded-full animate-bounce delay-700"></div>
          <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-purple-200/25 rotate-12 animate-bounce delay-1000"></div>
          <div className="absolute top-1/6 left-1/2 w-5 h-5 bg-indigo-200/20 rounded-full animate-bounce delay-1500"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white px-12 w-full">
          <div className="max-w-lg text-center">
            <div className="mb-10">
              {/* Enhanced Logo */}
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md border border-white/30 shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-12 h-12 text-white relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>

              <h1 className="text-5xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Join
                </span>
                <br />
                <span className="text-white font-extrabold text-6xl tracking-wide">
                  TripHub
                </span>
              </h1>
              <p className="text-xl text-blue-100 font-light leading-relaxed mb-8 max-w-md mx-auto">
                Start your adventure today and explore the world like never before with fellow travelers
              </p>
            </div>
            
           

           
          </div>
        </div>
      </div>

      {/* Right - Enhanced Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-48 h-48 border border-blue-200 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-36 h-36 border border-purple-200 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-indigo-200 rounded-full"></div>
        </div>

        <div className="w-full max-w-lg relative z-10">
          

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">Create Account</h2>
            <p className="text-gray-600 text-lg">Join our community of passionate travelers</p>
          </div>

          {/* Enhanced Form */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="space-y-6 relative z-10">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block tracking-wide">Full Name</label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === 'name' ? 'transform scale-[1.02]' : ''
                }`}>
                  <div className={`flex items-center border-2 rounded-xl px-4 py-4 transition-all duration-300 ${
                    focusedField === 'name' 
                      ? 'border-blue-500 shadow-xl shadow-blue-100 bg-white' 
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/80 hover:bg-white'
                  }`}>
                    <FaUser className={`mr-4 transition-all duration-300 ${
                      focusedField === 'name' ? 'text-blue-500 scale-110' : 'text-gray-400'
                    }`} />
                    <input 
                      type="text" 
                      placeholder="Enter your full name" 
                      className="w-full outline-none text-gray-700 placeholder-gray-400 font-medium bg-transparent"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block tracking-wide">Email Address</label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === 'email' ? 'transform scale-[1.02]' : ''
                }`}>
                  <div className={`flex items-center border-2 rounded-xl px-4 py-4 transition-all duration-300 ${
                    focusedField === 'email' 
                      ? 'border-blue-500 shadow-xl shadow-blue-100 bg-white' 
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/80 hover:bg-white'
                  }`}>
                    <FaEnvelope className={`mr-4 transition-all duration-300 ${
                      focusedField === 'email' ? 'text-blue-500 scale-110' : 'text-gray-400'
                    }`} />
                    <input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="w-full outline-none text-gray-700 placeholder-gray-400 font-medium bg-transparent"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block tracking-wide">Password</label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === 'password' ? 'transform scale-[1.02]' : ''
                }`}>
                  <div className={`flex items-center border-2 rounded-xl px-4 py-4 transition-all duration-300 ${
                    focusedField === 'password' 
                      ? 'border-blue-500 shadow-xl shadow-blue-100 bg-white' 
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/80 hover:bg-white'
                  }`}>
                    <FaLock className={`mr-4 transition-all duration-300 ${
                      focusedField === 'password' ? 'text-blue-500 scale-110' : 'text-gray-400'
                    }`} />
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password" 
                      className="w-full outline-none text-gray-700 placeholder-gray-400 font-medium bg-transparent"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password strength</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.strength === 100 ? 'text-green-600' :
                        passwordStrength.strength >= 75 ? 'text-blue-600' :
                        passwordStrength.strength >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              
              {/* Sign Up Button */}
              <button 
                onClick={handleSignup}
                disabled={isSigningUp}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold 
                         hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] 
                         hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         focus:outline-none focus:ring-4 focus:ring-blue-200 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">
                  {isSigningUp ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Your Account...</span>
                    </div>
                  ) : (
                    'CREATE YOUR TRIPHUB ACCOUNT'
                  )}
                </span>
              </button>

              {/* Enhanced Divider */}
              <div className="flex items-center my-2">
                <hr className="flex-grow border-gray-300" />
                <hr className="flex-grow border-gray-300" />

              </div>

             

              {/* Login Link */}
              <p className="text-center text-gray-600 mt-6">
                Already have an account?{' '}
                <Link
  to="/login"
  className="relative inline-block text-blue-600 font-medium hover:underline after:content-[''] after:block after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
>
  Sign in here
</Link>

              </p>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Signup;
