import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    locale: string;
  };
}

export default function LocalePage({ params }: PageProps) {
  // Temporary redirect to library page
  // TODO: Create proper homepage content
  redirect(`/${params.locale}/library/`);
}
