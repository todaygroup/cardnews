import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('Common');

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">{t('loading')}</p>
    </div>
  );
} 