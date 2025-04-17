import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          카드뉴스에 오신 것을 환영합니다
        </h1>
        <p className="text-center text-lg">
          아름다운 카드뉴스를 쉽게 만들고 공유하세요
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/editor"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          카드뉴스 만들기
        </Link>
        <Link
          href="/templates"
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          템플릿 보기
        </Link>
      </div>
    </main>
  )
} 