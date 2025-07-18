"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-red-600">Invalid Link</h1>
          <p className="mt-2 text-gray-700 dark:text-gray-400">The password reset link is missing or invalid. Please request a new one.</p>
          <Link href="/forgot-password" legacyBehavior>
            <a className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Request a new link</a>
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(data) {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Your password has been reset successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to reset password.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Set New Password</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create a new, strong password for your account.
          </p>
        </div>

        {submitted ? (
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-300">Password Updated!</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-400">
              You can now log in with your new password.
            </p>
            <Link href="/login" className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                className="w-full pl-10 pr-10 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register("confirmPassword", { required: "Please confirm your password", validate: value => value === password || "Passwords do not match" })}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                className="w-full pl-10 pr-10 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 