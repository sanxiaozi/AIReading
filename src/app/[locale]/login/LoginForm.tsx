'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useTranslations, type Locale } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  locale: Locale;
}

export default function LoginForm({ locale }: LoginFormProps) {
  const { t } = useTranslations(locale);
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email) {
      newErrors.email = t('auth.login.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('auth.login.errors.invalidEmail');
    }

    // Password validation
    if (!password) {
      newErrors.password = t('auth.login.errors.passwordRequired');
    } else if (password.length < 8) {
      newErrors.password = t('auth.login.errors.passwordTooShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login(email, password, rememberMe);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('auth.login.errors.serverError');
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-0 via-bg-1 to-bg-2 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo or Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-text-0 mb-2">
            AIreading
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        {/* Login Card */}
        <div className="bg-bg-1/50 backdrop-blur-sm rounded-2xl p-8 border border-text-muted/10 shadow-glow">
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-text-0 mb-2">
              {t('auth.login.title')}
            </h2>
            <p className="text-text-1 text-sm">
              {t('auth.login.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 text-danger text-sm">
                {errors.general}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-text-0 text-sm font-medium mb-2">
                {t('auth.login.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.login.emailPlaceholder')}
                className={`w-full px-4 py-3 bg-bg-2 border ${
                  errors.email ? 'border-danger' : 'border-text-muted/20'
                } rounded-lg text-text-0 placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
              />
              {errors.email && (
                <p className="mt-1 text-danger text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-text-0 text-sm font-medium mb-2">
                {t('auth.login.password')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.login.passwordPlaceholder')}
                className={`w-full px-4 py-3 bg-bg-2 border ${
                  errors.password ? 'border-danger' : 'border-text-muted/20'
                } rounded-lg text-text-0 placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
              />
              {errors.password && (
                <p className="mt-1 text-danger text-sm">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-text-muted/20 bg-bg-2 text-primary focus:ring-2 focus:ring-primary/20"
                />
                <span className="ml-2 text-text-1 text-sm">
                  {t('auth.login.rememberMe')}
                </span>
              </label>
              <Link
                href={`/${locale}/forgot-password`}
                className="text-sm text-primary hover:text-primary-2 transition-colors"
              >
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary-2 text-white font-medium rounded-lg hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('auth.login.signingIn') : t('auth.login.submit')}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-text-1 text-sm">
              {t('auth.login.noAccount')}{' '}
              <Link
                href={`/${locale}/register`}
                className="text-primary hover:text-primary-2 font-medium transition-colors"
              >
                {t('auth.login.signUp')}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-text-muted text-xs">
          <p>© 2024 AIreading. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
