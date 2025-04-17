import { useTranslations } from 'next-intl';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function Error({ message, onRetry }: ErrorProps) {
  const t = useTranslations('Common');

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
      <p className="text-red-500 text-lg mb-4">
        {message || t('error')}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {t('retry')}
        </button>
      )}
    </div>
  );
} 