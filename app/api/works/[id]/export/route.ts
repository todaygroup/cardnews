import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { CardNewsData } from '@/lib/types/editor'
import { Slide } from '@/lib/types/editor'
import { WorkTranslation } from '@/lib/types/editor'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const work = await prisma.work.findUnique({
      where: {
        id: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    if (!work) {
      return NextResponse.json(
        { error: '작업을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (!work.isPublic) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.email) {
        return NextResponse.json(
          { error: '로그인이 필요합니다.' },
          { status: 401 }
        )
      }

      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      })

      if (!user || user.id !== work.authorId) {
        return NextResponse.json(
          { error: '접근 권한이 없습니다.' },
          { status: 403 }
        )
      }
    }

    const slides = JSON.parse(work.slides as string) as Slide[]
    const translations = work.translations ? JSON.parse(work.translations as string) as Record<string, WorkTranslation> : {}

    const cardNewsData: CardNewsData = {
      id: work.id,
      title: work.title,
      description: work.description || '',
      createdAt: work.createdAt.toISOString(),
      updatedAt: work.updatedAt.toISOString(),
      author: {
        id: work.author.id,
        name: work.author.name || 'Anonymous'
      },
      language: work.language,
      slides,
      translations
    }

    return NextResponse.json(cardNewsData)
  } catch (error) {
    console.error('Error exporting work:', error)
    return NextResponse.json(
      { error: '작업을 내보내는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 