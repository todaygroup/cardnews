import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import CommentSection from '@/components/comments/CommentSection';
import LikeButton from '@/components/like/LikeButton';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';

interface Work {
  id: string;
  title: string;
  description: string | null;
  slides: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  language: string;
  translations: string | null;
  _count: {
    likes: number;
    comments: number;
  };
}

export default function WorkDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const t = useTranslations('Work');
  const [work, setWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWork();
  }, [params.id]);

  const fetchWork = async () => {
    try {
      const response = await fetch(`/api/works/${params.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '작품을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setWork(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('작품을 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchWork} />;
  if (!work) return <Error message="작품을 찾을 수 없습니다." />;

  const canEdit = session?.user?.id === work.author.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{work.title}</h1>
              <p className="text-gray-600 mb-4">{work.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <LikeButton workId={work.id} initialLikeCount={work._count.likes} />
              {canEdit && (
                <Link
                  href={`/editor/${work.id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {t('edit')}
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              {work.author.image && (
                <Image
                  src={work.author.image}
                  alt={work.author.name || ''}
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                />
              )}
              <span>{work.author.name}</span>
            </div>
            <span>•</span>
            <span>{new Date(work.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{work.isPublic ? t('public') : t('private')}</span>
          </div>

          <div className="prose max-w-none mb-8">
            {/* 여기에 슬라이드 내용을 렌더링 */}
          </div>

          <div className="border-t pt-6">
            <CommentSection workId={work.id} />
          </div>
        </div>
      </div>
    </div>
  );
} 