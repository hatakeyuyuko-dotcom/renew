import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseFile, type ParseResult } from '../parsers'
import { bulkAddWords } from '../hooks/useWords'
import { createTextPassage } from '../hooks/useTexts'
import { createDeck } from '../hooks/useDeck'
import { useUIStore } from '../store/uiStore'
import FileDropZone from '../components/import/FileDropZone'
import ImportPreview from '../components/import/ImportPreview'
import Button from '../components/shared/Button'
import Spinner from '../components/shared/Spinner'

export default function FileImportPage() {
  const navigate = useNavigate()
  const addToast = useUIStore((s) => s.addToast)
  const [parsing, setParsing] = useState(false)
  const [result, setResult] = useState<ParseResult | null>(null)
  const [importing, setImporting] = useState(false)

  const handleFile = async (file: File) => {
    setParsing(true)
    setResult(null)
    try {
      const res = await parseFile(file)
      setResult(res)
    } catch (e) {
      addToast({ message: `文件解析失败: ${(e as Error).message}`, type: 'error' })
    } finally {
      setParsing(false)
    }
  }

  const handleImport = async () => {
    if (!result) return
    setImporting(true)

    try {
      if (result.type === 'word-deck' && result.words && result.words.length > 0) {
        const deckId = await createDeck({
          name: result.deckName || '导入的牌组',
          description: `从文件导入，共 ${result.words.length} 个单词`,
        })
        await bulkAddWords(deckId, result.words)
        addToast({ message: `成功导入 ${result.words.length} 个单词`, type: 'success' })
        navigate(`/words/${deckId}`)
      } else if (result.type === 'text-passage' && result.passage) {
        const passageId = await createTextPassage({
          title: result.passage.title,
          content: result.passage.content,
          author: result.passage.author,
          source: result.passage.source,
          tags: [],
        })
        addToast({ message: '篇章导入成功', type: 'success' })
        navigate(`/texts/${passageId}`)
      } else {
        addToast({ message: '没有可导入的内容', type: 'error' })
      }
    } catch (e) {
      addToast({ message: `导入失败: ${(e as Error).message}`, type: 'error' })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">导入背诵内容</h2>
        <p className="text-gray-500 mt-1">上传文件自动识别单词表或文本篇章</p>
      </div>

      <FileDropZone onFile={handleFile} />

      {parsing && <Spinner className="py-8" />}

      {result && (
        <>
          <ImportPreview result={result} />
          <div className="mt-6 text-center">
            <Button onClick={handleImport} disabled={importing} size="lg">
              {importing ? '导入中...' : result.type === 'word-deck' ? `导入 ${result.words?.length ?? 0} 个单词` : '导入篇章'}
            </Button>
          </div>
        </>
      )}

      <div className="mt-10 bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-700 mb-3">支持的文件格式</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">TXT 单词表</h4>
            <code className="text-xs text-gray-500 block bg-white rounded p-2 whitespace-pre-wrap">
              apple - 苹果{'\n'}book = 书{'\n'}cat : 猫
            </code>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">CSV 单词表</h4>
            <code className="text-xs text-gray-500 block bg-white rounded p-2 whitespace-pre-wrap">
              word,definition{'\n'}apple,苹果{'\n'}book,书
            </code>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">JSON 格式</h4>
            <code className="text-xs text-gray-500 block bg-white rounded p-2 whitespace-pre-wrap">
              {'[{ "front": "apple",'}
              {'\n  "back": "苹果" }]'}
            </code>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Markdown / TXT 篇章</h4>
            <code className="text-xs text-gray-500 block bg-white rounded p-2 whitespace-pre-wrap">
              # 岳阳楼记{'\n'}庆历四年春，滕子京...
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
