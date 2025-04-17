import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface LikeButtonProps {
  workId: string;
  initialLikeCount?: number;
}

export default function LikeButton({ workId, initialLikeCount = 0 }: LikeButtonProps) {
  const { data: session } = useSession();
  const t = useTranslations('Like');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      checkLikeStatus();
    }
  }, [session, workId]);

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`/api/works/${workId}/like`);
      const data = await response.json();
      setIsLiked(data.liked);
    } catch (error) {
      console.error('좋아요 상태 확인 실패:', error);
    }
  };

  const handleLike = async () => {
    if (!session) {
      alert(t('loginRequired'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/works/${workId}/like`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('좋아요 처리에 실패했습니다.');

      const data = await response.json();
      setIsLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className="flex items-center space-x-1 text-gray-600 hover:text-red-500 disabled:opacity-50"
    >
      {isLiked ? (
        <HeartIconSolid className="w-6 h-6 text-red-500" />
      ) : (
        <HeartIcon className="w-6 h-6" />
      )}
      <span>{likeCount}</span>
    </button>
  );
} 