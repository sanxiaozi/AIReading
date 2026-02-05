import { type Locale } from '@/lib/i18n';
import RegisterForm from './RegisterForm';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

interface RegisterPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  return <RegisterForm locale={locale} />;
}
