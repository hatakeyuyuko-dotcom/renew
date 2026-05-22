const EN_STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'and', 'but', 'or',
  'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each', 'every',
  'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'only', 'own', 'same', 'than', 'too', 'very', 'just', 'because',
  'about', 'up', 'out', 'if', 'then', 'now', 'here', 'there', 'when',
  'where', 'why', 'how', 'which', 'who', 'whom', 'this', 'that', 'these',
  'those', 'it', 'its', 'he', 'she', 'they', 'them', 'we', 'you', 'i',
  'me', 'my', 'your', 'his', 'her', 'our', 'their', 'also', 'what',
])

const ZH_STOP_WORDS = new Set([
  '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一',
  '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着',
  '没有', '看', '好', '自己', '这', '他', '她', '它', '们', '那', '些',
  '所', '为', '所以', '因为', '但是', '然而', '而且', '虽然', '可以',
  '这个', '那个', '什么', '怎么', '哪', '吗', '啊', '吧', '呢', '嗯',
  '哦', '只', '把', '被', '让', '向', '从', '对', '与', '及', '或',
  '还', '又', '再', '才', '刚', '已经', '正在', '将', '能', '能够',
  '应该', '需要', '如果', '则', '但', '而', '且', '以', '之', '其',
])

interface ExtractedWord {
  word: string
  exists: boolean
  frequency: number
}

export function extractWords(text: string): Map<string, number> {
  const wordMap = new Map<string, number>()
  const isChinese = /[一-鿿]/.test(text)

  if (isChinese) {
    // Extract 2-4 character sequences for Chinese
    const cleaned = text.replace(/[^一-鿿]/g, '')
    for (let len = 2; len <= 4; len++) {
      for (let i = 0; i <= cleaned.length - len; i++) {
        const word = cleaned.slice(i, i + len)
        if (!ZH_STOP_WORDS.has(word) && word.length >= 2) {
          wordMap.set(word, (wordMap.get(word) || 0) + 1)
        }
      }
    }
  } else {
    // Split by spaces and punctuation for English
    const words = text
      .toLowerCase()
      .split(/[\s,.;:!?()\[\]{}"'/\\]+/)
      .filter((w) => w.length > 1)

    for (const word of words) {
      if (!EN_STOP_WORDS.has(word)) {
        wordMap.set(word, (wordMap.get(word) || 0) + 1)
      }
    }
  }

  return wordMap
}

export function getTopWords(
  wordMap: Map<string, number>,
  topN: number = 100,
  existingWords?: Set<string>
): ExtractedWord[] {
  const sorted = [...wordMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)

  return sorted.map(([word, frequency]) => ({
    word,
    frequency,
    exists: existingWords ? existingWords.has(word) : false,
  }))
}
