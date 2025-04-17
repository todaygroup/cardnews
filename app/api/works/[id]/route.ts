import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { WorkData } from '@/lib/types/editor'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const work = await prisma.work.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    if (!work) {
      return NextResponse.json(
        { error: '작품을 찾을 수 없습니다.' },
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
        where: { email: session.user.email },
      })

      if (!user || user.id !== work.authorId) {
        return NextResponse.json(
          { error: '접근 권한이 없습니다.' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(work)
  } catch (error) {
    console.error('작품 조회 실패:', error)
    return NextResponse.json(
      { error: '작품을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const work = await prisma.work.findUnique({
      where: {
        id: params.id,
      },
      include: {
        author: {
          select: {
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

    if (work.author.email !== session.user.email) {
      return NextResponse.json(
        { error: '이 작업을 편집할 권한이 없습니다.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data: Partial<WorkData> = body

    const updatedWork = await prisma.work.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        description: data.description,
        slides: JSON.stringify(data.slides),
        language: data.language,
        translations: data.translations ? JSON.stringify(data.translations) : null,
        isPublic: data.isPublic,
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

    return NextResponse.json(updatedWork)
  } catch (error) {
    console.error('Error updating work:', error)
    return NextResponse.json(
      { error: '작업을 수정하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const work = await prisma.work.findUnique({
      where: {
        id: params.id,
      },
      include: {
        author: {
          select: {
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

    if (work.author.email !== session.user.email) {
      return NextResponse.json(
        { error: '이 작업을 삭제할 권한이 없습니다.' },
        { status: 403 }
      )
    }

    await prisma.work.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting work:', error)
    return NextResponse.json(
      { error: '작업을 삭제하는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 