'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TemplatesPage() {
  const t = useTranslations('templates');
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (!response.ok) {
        throw new Error('템플릿을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('템플릿을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(template => template.category === selectedCategory);

  if (loading) {
    return <div className="text-center py-8">{t('loading')}</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            {session && (
              <Link
                href="/templates/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t('createNew')}
              </Link>
            )}
          </div>

          <div className="mb-6 space-x-2">
            {['all', 'business', 'education', 'marketing', 'social'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t(category)}
              </button>
            ))}
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">{t('noTemplates')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
                    <p className="text-gray-600 mb-4">{template.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{t('by')} {template.author.name}</span>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Link
                        href={`/templates/${template.id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        {t('preview')}
                      </Link>
                      <Link
                        href={`/templates/${template.id}/use`}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {t('useTemplate')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 