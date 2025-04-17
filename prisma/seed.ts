import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    // 관리자 사용자 생성
    const adminPassword = await hash('admin123', 12)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@cardnews.com',
        name: '관리자',
        password: adminPassword,
      },
    })

    // 샘플 템플릿 생성
    const template = await prisma.template.create({
      data: {
        name: '기본 템플릿',
        description: '카드뉴스 기본 템플릿입니다.',
        thumbnail: 'https://cardnews-images.s3.amazonaws.com/templates/default.jpg',
        category: 'business',
        tags: ['기본', '비즈니스'],
        slides: [
          {
            content: '첫 번째 슬라이드',
            backgroundColor: '#ffffff',
            textColor: '#000000',
            fontSize: 24,
            fontFamily: 'Inter',
          },
          {
            content: '두 번째 슬라이드',
            backgroundColor: '#f3f4f6',
            textColor: '#1f2937',
            fontSize: 24,
            fontFamily: 'Inter',
          },
        ],
        authorId: admin.id,
        isPublic: true,
        language: 'ko',
      },
    })

    console.log('시드 데이터가 성공적으로 생성되었습니다.')
    console.log({ admin, template })
  } catch (error) {
    console.error('시드 데이터 생성 중 오류가 발생했습니다:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 