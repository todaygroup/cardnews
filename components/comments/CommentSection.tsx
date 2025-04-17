'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

interface CommentSectionProps {
  workId: string
}

export default function CommentSection({ workId }: CommentSectionProps) {
  const t = useTranslations('Comment')
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [workId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/works/${workId}/comments`)
      if (!response.ok) throw new Error('댓글을 불러오는데 실패했습니다.')
      const data = await response.json()
      setComments(data)
    } catch (error) {
      setError('댓글을 불러오는데 실패했습니다.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/works/${workId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) throw new Error('댓글 작성에 실패했습니다.')

      const comment = await response.json()
      setComments([comment, ...comments])
      setNewComment('')
    } catch (error) {
      setError('댓글 작성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm(t('deleteConfirm'))) return

    try {
      const response = await fetch(
        `/api/works/${workId}/comments/${commentId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) throw new Error('댓글 삭제에 실패했습니다.')

      setComments(comments.filter((comment) => comment.id !== commentId))
    } catch (error) {
      setError('댓글 삭제에 실패했습니다.')
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('title')}</h3>

      {session ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('placeholder')}
            className="w-full p-2 border rounded-lg resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? t('posting') : t('post')}
          </button>
        </form>
      ) : (
        <p className="text-gray-500">{t('loginRequired')}</p>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {comment.author.image && (
                  <Image
                    src={comment.author.image}
                    alt={comment.author.name || ''}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold">{comment.author.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {(session?.user?.id === comment.author.id) && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  {t('delete')}
                </button>
              )}
            </div>
            <p className="mt-2">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 