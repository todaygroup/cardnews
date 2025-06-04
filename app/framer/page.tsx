'use client'

import Link from 'next/link'

export default function FramerPage() {
  return (
    <div className="bg-white">
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">프레이머 랜딩 페이지</h1>
          <p className="mt-4 text-lg text-gray-500">프레이머 디자인을 바탕으로 제작된 샘플 페이지입니다.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/editor" className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700">에디터 시작</Link>
            <Link href="/templates" className="px-6 py-3 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">템플릿 보기</Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">특징</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 text-center rounded-lg bg-white shadow">
              <h3 className="text-xl font-semibold mb-2">간편한 제작</h3>
              <p className="text-gray-500">드래그 앤 드롭 방식으로 손쉽게 카드뉴스를 만들 수 있습니다.</p>
            </div>
            <div className="p-6 text-center rounded-lg bg-white shadow">
              <h3 className="text-xl font-semibold mb-2">다양한 템플릿</h3>
              <p className="text-gray-500">여러 가지 테마의 템플릿을 제공하여 빠르게 시작할 수 있습니다.</p>
            </div>
            <div className="p-6 text-center rounded-lg bg-white shadow">
              <h3 className="text-xl font-semibold mb-2">쉬운 공유</h3>
              <p className="text-gray-500">완성된 작품을 간단히 다운로드하고 공유하세요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
