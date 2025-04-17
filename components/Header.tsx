import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">카드뉴스</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/works" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              내 작업
            </Link>
            <Link href="/templates" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              템플릿
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
} 