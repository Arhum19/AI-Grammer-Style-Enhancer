import React, { useState } from 'react'

const ResultCard = ({ result }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.enhancedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const getStyleInfo = (style) => {
    const styles = {
      grammar: { label: 'Grammar Fix', color: 'bg-blue-100 text-blue-800', icon: '✓' },
      slang: { label: 'Casual Slang', color: 'bg-green-100 text-green-800', icon: '�' },
      formal: { label: 'Formal', color: 'bg-purple-100 text-purple-800', icon: '📄' },
      persuasive: { label: 'Persuasive', color: 'bg-pink-100 text-pink-800', icon: '🎯' }
    }
    return styles[style] || styles.grammar
  }

  // Calculate statistics
  const originalWords = result.originalText.trim().split(/\s+/)
  const enhancedWords = result.enhancedText.trim().split(/\s+/)
  
  const originalWordCount = originalWords.length
  const enhancedWordCount = enhancedWords.length
  const originalCharCount = result.originalText.length
  const enhancedCharCount = result.enhancedText.length
  
  // Calculate average word length
  const originalAvgWordLength = originalWords.reduce((sum, word) => sum + word.length, 0) / originalWordCount
  const enhancedAvgWordLength = enhancedWords.reduce((sum, word) => sum + word.length, 0) / enhancedWordCount

  const styleInfo = getStyleInfo(result.style)

  return (
    <div className="space-y-6 border-t pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          Enhanced Result
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${styleInfo.color} flex items-center space-x-1`}>
          <span>{styleInfo.icon}</span>
          <span>{styleInfo.label}</span>
        </span>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-600">
            {enhancedWordCount}
          </div>
          <div className="text-xs text-blue-600 font-medium">Enhanced Words</div>
          <div className="text-xs text-gray-500">
            {enhancedWordCount > originalWordCount ? '+' : ''}
            {enhancedWordCount - originalWordCount}
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-600">
            {enhancedCharCount}
          </div>
          <div className="text-xs text-green-600 font-medium">Characters</div>
          <div className="text-xs text-gray-500">
            {enhancedCharCount > originalCharCount ? '+' : ''}
            {enhancedCharCount - originalCharCount}
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-purple-600">
            {enhancedAvgWordLength.toFixed(1)}
          </div>
          <div className="text-xs text-purple-600 font-medium">Avg Word Length</div>
          <div className="text-xs text-gray-500">
            {enhancedAvgWordLength > originalAvgWordLength ? '+' : ''}
            {(enhancedAvgWordLength - originalAvgWordLength).toFixed(1)}
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round((enhancedCharCount / enhancedWordCount) * 10) / 10}
          </div>
          <div className="text-xs text-orange-600 font-medium">Readability</div>
          <div className="text-xs text-gray-500">Score</div>
        </div>
      </div>

      {/* Original vs Enhanced Text Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Text */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
              Original Text
            </h4>
            <div className="text-xs text-gray-500">
              {originalWordCount} words • {originalCharCount} chars
            </div>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{result.originalText}</p>
        </div>

        {/* Enhanced Text */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-blue-800 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Enhanced Text
            </h4>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-blue-600">
                {enhancedWordCount} words • {enhancedCharCount} chars
              </div>
              <button
                onClick={handleCopy}
                className={`text-xs px-3 py-1 rounded-lg transition-all duration-200 flex items-center space-x-1 ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-gray-800 leading-relaxed">{result.enhancedText}</p>
        </div>
      </div>

      {/* Detailed Comparison Stats */}
     <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
          Enhancement Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-700">
              {((enhancedWordCount / originalWordCount - 1) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">Word Change</div>
          </div>
          {/* <div>
            <div className="text-lg font-bold text-gray-700">
              {((enhancedCharCount / originalCharCount - 1) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">Length Change</div>
          </div> */}
          <div>
            <div className="text-lg font-bold text-gray-700">
              {enhancedAvgWordLength.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">Avg Word Length</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-700">
              {Math.ceil(enhancedWordCount / 200)}
            </div>
            <div className="text-xs text-gray-600">Reading Time (min)</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultCard