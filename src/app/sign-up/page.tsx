'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Wand2, User, Mail, Lock, LogIn,  } from 'lucide-react';
import { 
  useCreateUserWithEmailAndPassword, 
  useSignInWithEmailAndPassword,
  useSignInWithGoogle
} from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import Image from 'next/image'
import toast from 'sonner';
import google from '../../../public/google.png';

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Firebase Authentication Hooks
  const [createUserWithEmailAndPassword, createUser, createLoading, createError] = 
    useCreateUserWithEmailAndPassword(auth);
  
  const [signInWithEmailAndPassword, signInUser, signInLoading, signInError] = 
    useSignInWithEmailAndPassword(auth);
  
  const [signInWithGoogle, googleUser, googleLoading, googleError] = 
    useSignInWithGoogle(auth);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isLogin) {
      // Signup Logic
      if (password !== confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }

      try {
        const res = await createUserWithEmailAndPassword(email, password);
        if (res) {
          toast.success('Account created successfully');
          router.push('/home');
        }
      } catch (error) {
        toast.error('Signup failed');
        console.error(error);
      }
    } else {
      // Login Logic
      try {
        const res = await signInWithEmailAndPassword(email, password);
        if (res) {
          toast.success('Logged in successfully');
          router.push('/home');
        }
      } catch (error) {
        toast.error('Login failed');
        console.error(error);
      }
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithGoogle();
      if (res) {
        toast.success('Logged in with Google');
        router.push('/home');
      }
    } catch (error) {
      toast.error('Google Sign-In failed');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] font-['Inter'] text-white flex items-center justify-center p-2">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#1e293b] rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/50 p-8"
      >
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center justify-center mb-8 space-x-3"
        >
          <Wand2 className="text-teal-400 w-10 h-10" />
          <h1 className="text-3xl font-bold tracking-tight text-teal-300">
            mydogateit
          </h1>
        </motion.div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-200">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>

          {/* Error Handling */}
          {(createError || signInError || googleError) && (
            <div className="bg-red-600/20 border border-red-500 rounded-xl p-3 text-red-400 text-center">
              {createError?.message || signInError?.message || googleError?.message}
            </div>
          )}

          {/* Username Input (Only for Signup) */}
          {!isLogin && (
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full px-4 py-3 pl-10 rounded-xl bg-[#0f172a] text-white
                border border-[#334155] focus:outline-none focus:ring-2 focus:ring-teal-500
                transition-all"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          )}

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 pl-10 rounded-xl bg-[#0f172a] text-white
              border border-[#334155] focus:outline-none focus:ring-2 focus:ring-teal-500
              transition-all"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 pl-10 rounded-xl bg-[#0f172a] text-white
              border border-[#334155] focus:outline-none focus:ring-2 focus:ring-teal-500
              transition-all"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Confirm Password Input (Only for Signup) */}
          {!isLogin && (
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-3 pl-10 rounded-xl bg-[#0f172a] text-white
                border border-[#334155] focus:outline-none focus:ring-2 focus:ring-teal-500
                transition-all"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={createLoading || signInLoading || googleLoading}
            className="w-full px-4 py-3 rounded-xl bg-teal-600 text-white font-medium
            hover:bg-teal-700 transition-all flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={18} /> {isLogin ? 'Login' : 'Sign Up'}
          </motion.button>

          {/* Google Sign-In Button */}
          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={createLoading || signInLoading || googleLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-3 rounded-xl bg-[#0f172a] text-white font-medium
            hover:bg-[#1e293b] transition-all flex items-center justify-center gap-2
            border border-[#334155] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between gap-3">
              <span>Continue with Google</span>
              <Image src={google} alt="Google Image" width={25} height={25} />
            </div>
          </motion.button>

          {/* Toggle Between Login and Signup */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-teal-400 hover:text-teal-300 transition-colors"
            >
              {isLogin 
                ? 'Need an account? Sign Up' 
                : 'Already have an account? Login'}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default AuthPage;