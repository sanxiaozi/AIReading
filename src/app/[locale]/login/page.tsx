import { type Locale } from '@/lib/i18n';
import LoginForm from './LoginForm';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

interface LoginPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  return <LoginForm locale={locale} />;
}
