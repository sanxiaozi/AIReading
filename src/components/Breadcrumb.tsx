import Link from 'next/link';
import { useLocale } from 'next-intl';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: Props) {
  const locale = useLocale();
  const homeHref = locale === 'zh' ? '/' : `/${locale}`;

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400">
      <Link
        href={homeHref}
        className="hover:text-white transition-colors"
      >
        首页
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <span className="text-gray-600">/</span>
          {item.href ? (
            <Link
              href={locale === 'zh' ? item.href : `/${locale}${item.href}`}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
