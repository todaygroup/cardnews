'use client'

import { memo, useCallback } from 'react'
import { useTranslations } from 'next-intl'

interface ToolbarProps {
  onSave: () => void
  onPreview: () => void
  onExport: () => void
  isSaving?: boolean
  isExporting?: boolean
}

function Toolbar({ 
  onSave, 
  onPreview, 
  onExport, 
  isSaving = false,
  isExporting = false
}: ToolbarProps) {
  const t = useTranslations('editor')

  const handleSave = useCallback(() => {
    onSave()
  }, [onSave])

  const handlePreview = useCallback(() => {
    onPreview()
  }, [onPreview])

  const handleExport = useCallback(() => {
    onExport()
  }, [onExport])

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`px-4 py-2 rounded-lg transition-colors ${
          isSaving
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isSaving ? t('saving') : t('save')}
      </button>

      <button
        onClick={handlePreview}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t('preview')}
      </button>

      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`px-4 py-2 rounded-lg transition-colors ${
          isExporting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {isExporting ? t('exporting') : t('export')}
      </button>
    </div>
  )
}

export default memo(Toolbar) 