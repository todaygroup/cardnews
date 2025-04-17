import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const work = await prisma.work.findUnique({
      where: {
        id: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
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

    if (!work.isPublic && (!session?.user?.email || work.author.email !== session.user.email)) {
      return NextResponse.json(
        { error: '이 작업에 접근할 권한이 없습니다.' },
        { status: 403 }
      )
    }

    return NextResponse.json(work)
  } catch (error) {
    console.error('Error fetching work:', error)
    return NextResponse.json(
      { error: '작업을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 