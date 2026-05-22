import type { ParseResult } from '../../parsers'

interface ImportPreviewProps {
  result: ParseResult
}

export default function ImportPreview({ result }: ImportPreviewProps) {
  return (
    <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            {result.type === 'word-deck' ? '单词牌组预览' : '文本篇章预览'}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            result.type === 'word-deck'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            {result.type === 'word-deck' ? '背单词' : '背书'}
          </span>
        </div>
      </div>

      <div className="p-6">
        {result.type === 'word-deck' && result.words && (
          <div>
            <div className="mb-3 text-sm text-gray-500">
              牌组: <span className="font-medium text-gray-700">{result.deckName}</span>
              · 共 <span className="font-medium text-indigo-600">{result.words.length}</span> 个单词
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-400">#</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-400">单词</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-400">释义</th>
                  </tr>
                </thead>
                <tbody>
                  {result.words.slice(0, 50).map((w, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-2 font-medium text-gray-800">{w.front}</td>
                      <td className="px-4 py-2 text-gray-600">{w.back}</td>
                    </tr>
                  ))}
                  {result.words.length > 50 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-center text-gray-400">
                        ... 还有 {result.words.length - 50} 个单词
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {result.type === 'text-passage' && result.passage && (
          <div>
            <div className="mb-3 text-sm text-gray-500">
              标题: <span className="font-medium text-gray-700">{result.passage.title}</span>
              {result.passage.author && <span className="ml-4">作者: {result.passage.author}</span>}
            </div>
            <div className="max-h-60 overflow-y-auto bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
              {result.passage.content.slice(0, 1000)}
              {result.passage.content.length > 1000 && (
                <span className="text-gray-400">\n... 已截断预览 (共 {result.passage.content.length} 字)</span>
              )}
            </div>
          </div>
        )}

        {result.errors.length > 0 && (
          <div className="mt-4 bg-amber-50 rounded-lg p-3 text-sm text-amber-800">
            <p className="font-medium mb-1">解析警告:</p>
            {result.errors.slice(0, 5).map((e, i) => (
              <p key={i}>· {e}</p>
            ))}
            {result.errors.length > 5 && <p>... 还有 {result.errors.length - 5} 条</p>}
          </div>
        )}
      </div>
    </div>
  )
}
