'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, type Locale } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterFormProps {
  locale: Locale;
}

type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function RegisterForm({ locale }: RegisterFormProps) {
  const { t } = useTranslations(locale);
  const { register: registerUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak');

  // Calculate password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength('weak');
      return;
    }

    let strength = 0;
    
    // Length
    if (formData.password.length >= 8) strength++;
    if (formData.password.length >= 12) strength++;
    
    // Character variety
    if (/[a-z]/.test(formData.password)) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^a-zA-Z0-9]/.test(formData.password)) strength++;

    if (strength <= 2) {
      setPasswordStrength('weak');
    } else if (strength <= 4) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }, [formData.password]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = t('auth.register.errors.usernameRequired');
    } else if (formData.username.length < 3) {
      newErrors.username = t('auth.register.errors.usernameTooShort');
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = t('auth.register.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.register.errors.invalidEmail');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('auth.register.errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.register.errors.passwordTooShort');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t('auth.register.errors.passwordWeak');
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.register.errors.passwordMismatch');
    }

    // Terms acceptance
    if (!acceptTerms) {
      newErrors.terms = t('auth.register.errors.termsRequired');
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
      await registerUser(formData.email, formData.password, formData.username);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('auth.register.errors.serverError');
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-danger';
      case 'medium':
        return 'bg-warning';
      case 'strong':
        return 'bg-success';
    }
  };

  const getPasswordStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'w-1/3';
      case 'medium':
        return 'w-2/3';
      case 'strong':
        return 'w-full';
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

        {/* Register Card */}
        <div className="bg-bg-1/50 backdrop-blur-sm rounded-2xl p-8 border border-text-muted/10 shadow-glow">
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-text-0 mb-2">
              {t('auth.register.title')}
            </h2>
            <p className="text-text-1 text-sm">
              {t('auth.register.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 text-danger text-sm">
                {errors.general}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-text-0 text-sm font-medium mb-2">
                {t('auth.register.username')}
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder={t('auth.register.usernamePlaceholder')}
                className={`w-full px-4 py-3 bg-bg-2 border ${
                  errors.username ? 'border-danger' : 'border-text-muted/20'
                } rounded-lg text-text-0 placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
              />
              {errors.username && (
                <p className="mt-1 text-danger text-sm">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-text-0 text-sm font-medium mb-2">
                {t('auth.register.email')}
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={t('auth.register.emailPlaceholder')}
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
                {t('auth.register.password')}
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder={t('auth.register.passwordPlaceholder')}
                className={`w-full px-4 py-3 bg-bg-2 border ${
                  errors.password ? 'border-danger' : 'border-text-muted/20'
                } rounded-lg text-text-0 placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
              />
              {errors.password && (
                <p className="mt-1 text-danger text-sm">{errors.password}</p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-1">
                      {t('auth.register.passwordStrength.label')}
                    </span>
                    <span className={`text-xs font-medium ${
                      passwordStrength === 'weak' ? 'text-danger' :
                      passwordStrength === 'medium' ? 'text-warning' :
                      'text-success'
                    }`}>
                      {t(`auth.register.passwordStrength.${passwordStrength}`)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-bg-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor()} ${getPasswordStrengthWidth()}`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-text-0 text-sm font-medium mb-2">
                {t('auth.register.confirmPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                className={`w-full px-4 py-3 bg-bg-2 border ${
                  errors.confirmPassword ? 'border-danger' : 'border-text-muted/20'
                } rounded-lg text-text-0 placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-danger text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-text-muted/20 bg-bg-2 text-primary focus:ring-2 focus:ring-primary/20"
                />
                <span className="ml-2 text-text-1 text-sm">
                  {t('auth.register.terms')}{' '}
                  <Link
                    href={`/${locale}/terms`}
                    className="text-primary hover:text-primary-2 transition-colors"
                    target="_blank"
                  >
                    {t('auth.register.termsLink')}
                  </Link>{' '}
                  {t('auth.register.and')}{' '}
                  <Link
                    href={`/${locale}/privacy`}
                    className="text-primary hover:text-primary-2 transition-colors"
                    target="_blank"
                  >
                    {t('auth.register.privacyLink')}
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-danger text-sm">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary-2 text-white font-medium rounded-lg hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('auth.register.creatingAccount') : t('auth.register.submit')}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-text-1 text-sm">
              {t('auth.register.hasAccount')}{' '}
              <Link
                href={`/${locale}/login`}
                className="text-primary hover:text-primary-2 font-medium transition-colors"
              >
                {t('auth.register.signIn')}
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
