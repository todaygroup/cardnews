import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const work = await prisma.work.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!work) {
      return NextResponse.json(
        { error: '작업을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (work.authorId !== user.id) {
      return NextResponse.json(
        { error: '접근 권한이 없습니다.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { isPublic } = body

    const updatedWork = await prisma.work.update({
      where: {
        id: params.id,
      },
      data: {
        isPublic,
      },
    })

    return NextResponse.json(updatedWork)
  } catch (error) {
    console.error('Error sharing work:', error)
    return NextResponse.json(
      { error: '작업 공유 설정에 실패했습니다.' },
      { status: 500 }
    )
  }
} 