import { Locale } from '@/lib/i18n';
import ProfilePage from './ProfilePage';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <ProfilePage locale={locale} />;
}
