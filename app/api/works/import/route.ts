import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { CardNewsData } from '@/lib/types/editor'

export async function POST(request: Request) {
  try {
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

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const data: CardNewsData = body

    const work = await prisma.work.create({
      data: {
        title: data.title,
        description: data.description,
        slides: data.slides,
        language: data.language,
        translations: data.translations,
        isPublic: false,
        authorId: user.id,
      },
    })

    return NextResponse.json(work)
  } catch (error) {
    console.error('Error importing work:', error)
    return NextResponse.json(
      { error: '작업을 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 