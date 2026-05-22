import { useState, useCallback, type DragEvent } from 'react'

interface FileDropZoneProps {
  onFile: (file: File) => void
  accept?: string
}

export default function FileDropZone({ onFile, accept = '.txt,.csv,.json,.md,.markdown' }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }, [onFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }, [onFile])

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
        isDragging
          ? 'border-indigo-400 bg-indigo-50'
          : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="text-5xl mb-4">📁</div>
        <p className="text-lg font-medium text-gray-700 mb-1">
          拖拽文件到此处或点击选择
        </p>
        <p className="text-sm text-gray-400">
          支持 TXT / CSV / JSON / Markdown 格式
        </p>
      </label>
    </div>
  )
}
