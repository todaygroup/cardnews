import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email

    if (!email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const works = await prisma.work.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(works)
  } catch (error) {
    console.error('Error fetching works:', error)
    return NextResponse.json(
      { error: '작업 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email

    if (!email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const data = await request.json()
    const { title, description, slides, language, translations } = data

    const work = await prisma.work.create({
      data: {
        title,
        description,
        slides,
        language,
        translations,
        authorId: user.id,
      },
    })

    return NextResponse.json(work, { status: 201 })
  } catch (error) {
    console.error('Error creating work:', error)
    return NextResponse.json(
      { error: '작업 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
} 