import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.template.findUnique({
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

    if (!template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error('템플릿 조회 중 오류:', error)
    return NextResponse.json(
      { error: '템플릿을 불러오는 중 오류가 발생했습니다.' },
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
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const template = await prisma.template.findUnique({
      where: { id: params.id },
      include: { author: true }
    })

    if (!template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (template.author.id !== user.id) {
      return NextResponse.json(
        { error: '템플릿을 수정할 권한이 없습니다.' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const updatedTemplate = await prisma.template.update({
      where: { id: params.id },
      data
    })

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error('템플릿 수정 중 오류:', error)
    return NextResponse.json(
      { error: '템플릿을 수정하는 중 오류가 발생했습니다.' },
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
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const template = await prisma.template.findUnique({
      where: { id: params.id },
      include: { author: true }
    })

    if (!template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (template.author.id !== user.id) {
      return NextResponse.json(
        { error: '템플릿을 삭제할 권한이 없습니다.' },
        { status: 403 }
      )
    }

    await prisma.template.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('템플릿 삭제 중 오류:', error)
    return NextResponse.json(
      { error: '템플릿을 삭제하는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 