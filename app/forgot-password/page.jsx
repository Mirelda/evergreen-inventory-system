"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(data) {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Password reset link has been sent to your email.');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Something went wrong.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password?</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-300">Check Your Email</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-400">
              We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
            </p>
            <Link href="/login" className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="text-sm text-center">
              <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 