import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 좋아요 토글
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        authorId_workId: {
          authorId: user.id,
          workId: params.id,
        },
      },
    });

    if (existingLike) {
      // 좋아요 취소
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ liked: false });
    } else {
      // 좋아요 추가
      await prisma.like.create({
        data: {
          authorId: user.id,
          workId: params.id,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('좋아요 처리 실패:', error);
    return NextResponse.json(
      { error: '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 좋아요 상태 확인
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ liked: false });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ liked: false });
    }

    const like = await prisma.like.findUnique({
      where: {
        authorId_workId: {
          authorId: user.id,
          workId: params.id,
        },
      },
    });

    return NextResponse.json({ liked: !!like });
  } catch (error) {
    console.error('좋아요 상태 확인 실패:', error);
    return NextResponse.json({ liked: false });
  }
} 