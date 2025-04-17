import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { ERROR_MESSAGES } from '@/lib/constants/errors'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    const email = session?.user?.email

    if (!email) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.USER_NOT_FOUND },
        { status: 404 }
      )
    }

    const template = await prisma.template.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!template) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.TEMPLATE_NOT_FOUND },
        { status: 404 }
      )
    }

    if (!template.isPublic && template.author.email !== email) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.TEMPLATE_NO_PERMISSION },
        { status: 403 }
      )
    }

    // 템플릿 사용 횟수 증가
    await prisma.template.update({
      where: { id: params.id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    })

    // 새로운 작업 생성
    const work = await prisma.work.create({
      data: {
        title: `${template.title} (복사본)`,
        description: template.description,
        slides: JSON.stringify(template.slides),
        language: 'ko',
        authorId: user.id,
        templateId: template.id,
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

    return NextResponse.json(work)
  } catch (error) {
    console.error('Error using template:', error)
    return NextResponse.json(
      { error: ERROR_MESSAGES.TEMPLATE_USE_FAILED },
      { status: 500 }
    )
  }
} 