import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { CheckOutlined } from '@ant-design/icons'

// Helper function to check if user word is a "prefix match" of answer word
// Returns { isMatch: boolean, missingPart: string, matchedPart: string }
// Examples:
//   "year" vs "years" -> { isMatch: true, missingPart: "s", matchedPart: "year" }
//   "75" vs "75-year-old" -> { isMatch: true, missingPart: "-year-old", matchedPart: "75" }
//   "old" vs "75-year-old" -> { isMatch: true, missingPart: "75-year-", matchedPart: "old" }
//   "car" vs "bus" -> { isMatch: false, missingPart: "", matchedPart: "" }
function isPrefixMatch(userWord, answerWord) {
  const userLower = userWord.toLowerCase()
  const answerLower = answerWord.toLowerCase()

  // Direct match
  if (userLower === answerLower) {
    return { isMatch: true, missingPart: '', matchedPart: userWord, extraPart: '', exact: true }
  }

  // Check if user word is a prefix of answer word (case-insensitive)
  if (answerLower.startsWith(userLower)) {
    const missingPart = answerWord.slice(userWord.length)
    if (missingPart.length <= 2 || userLower.length >= 3) {
      return { isMatch: true, missingPart, matchedPart: userWord, extraPart: '', exact: false }
    }
  }

  // Check if answer word is a prefix of user word (user typed extra characters)
  if (userLower.startsWith(answerLower)) {
    const extraPart = userWord.slice(answerWord.length)
    if (extraPart.length <= 2 || answerLower.length >= 4) {
      return { isMatch: true, missingPart: '', matchedPart: answerWord, extraPart, exact: false }
    }
  }

  return { isMatch: false, missingPart: '', matchedPart: '', extraPart: '', exact: false }
}

// SmartInput component with mobile support
export default function SmartInput({ value, answer, onChange, onCheck, disabled, isCorrect, isWrong, blankRef, isMobile }) {
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    if (blankRef && typeof blankRef === 'function') {
      blankRef(wrapperRef.current)
    }
  }, [blankRef, value, hasChecked, isCorrect, isWrong])

  useLayoutEffect(() => {
    const input = inputRef.current
    if (!input || hasChecked) return

    if (value) {
      const tempSpan = document.createElement('span')
      tempSpan.style.cssText = 'visibility:hidden;position:absolute;white-space:pre;font-size:18px;font-family:inherit;letter-spacing:normal;'
      tempSpan.textContent = value
      document.body.appendChild(tempSpan)
      const measured = tempSpan.offsetWidth + 32
      document.body.removeChild(tempSpan)
      const minW = isMobile ? 120 : 300
      const maxW = isMobile ? window.innerWidth - 80 : 500
      input.style.width = Math.min(Math.max(measured, minW), maxW) + 'px'
    } else {
      input.style.width = (isMobile ? 120 : 300) + 'px'
    }
  }, [value, hasChecked, isMobile])

  useEffect(() => {
    if (isCorrect || isWrong) {
      setHasChecked(true)
    }
  }, [isCorrect, isWrong])

  if (hasChecked && value) {
    if (isCorrect) {
      return (
        <span ref={wrapperRef} style={{
          color: '#52c41a',
          fontWeight: 600,
          padding: '4px 12px',
          borderRadius: 8,
          display: 'inline-block',
          fontSize: 17,
          background: 'rgba(82, 196, 26, 0.1)',
          border: '1px solid rgba(82, 196, 26, 0.3)'
        }}>
          {answer}
        </span>
      )
    }

    if (isWrong) {
      const wordsUser = (value || '').split(/\s+/).filter(w => w)
      const wordsAnswer = (answer || '').split(/\s+/).filter(w => w)

      // Track which user words have been used
      const dp = Array(wordsAnswer.length + 1).fill(null).map(() => Array(wordsUser.length + 1).fill(0))
      const choice = Array(wordsAnswer.length + 1).fill(null).map(() => Array(wordsUser.length + 1).fill(0))

      for (let i = 1; i <= wordsAnswer.length; i++) {
        for (let j = 1; j <= wordsUser.length; j++) {
          const ansWord = wordsAnswer[i - 1]
          const userWord = wordsUser[j - 1]
          let score = 0
          
          if (ansWord.toLowerCase() === userWord.toLowerCase()) {
            score = 2
          } else {
            const match = isPrefixMatch(userWord, ansWord)
            if (match.isMatch) {
              score = 1
            }
          }

          const matchScore = dp[i - 1][j - 1] + score
          const skipAnsScore = dp[i - 1][j]
          const skipUserScore = dp[i][j - 1]

          if (score > 0 && matchScore >= skipAnsScore && matchScore >= skipUserScore) {
            dp[i][j] = matchScore
            choice[i][j] = 1
          } else if (skipAnsScore >= skipUserScore) {
            dp[i][j] = skipAnsScore
            choice[i][j] = 2
          } else {
            dp[i][j] = skipUserScore
            choice[i][j] = 3
          }
        }
      }

      let i = wordsAnswer.length
      let j = wordsUser.length
      const alignment = []

      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && choice[i][j] === 1) {
          alignment.unshift({ type: 'match', ansIdx: i - 1, userIdx: j - 1 })
          i--
          j--
        } else if (i > 0 && (j === 0 || choice[i][j] === 2)) {
          alignment.unshift({ type: 'missing', ansIdx: i - 1, userIdx: -1 })
          i--
        } else {
          alignment.unshift({ type: 'extra', ansIdx: -1, userIdx: j - 1 })
          j--
        }
      }

      const elements = []
      alignment.forEach((item, index) => {
        if (item.type === 'match') {
          const ansWord = wordsAnswer[item.ansIdx]
          const userWord = wordsUser[item.userIdx]
          if (ansWord.toLowerCase() === userWord.toLowerCase()) {
            elements.push(
              <span key={`match-${index}`} style={{ color: '#52c41a', fontWeight: 500 }}>
                {userWord}{' '}
              </span>
            )
          } else {
            const match = isPrefixMatch(userWord, ansWord)
            elements.push(
              <span key={`prefix-${index}`}>
                <span style={{ color: '#52c41a', fontWeight: 500 }}>
                  {match.matchedPart}
                </span>
                {match.missingPart && (
                  <span style={{ color: '#ff4d4f', fontWeight: 400 }}>
                    {match.missingPart}
                  </span>
                )}
                {match.extraPart && (
                  <span style={{
                    color: '#ff4d4f',
                    fontWeight: 400,
                    textDecoration: 'line-through',
                    textDecorationColor: '#ff4d4f'
                  }}>
                    {match.extraPart}
                  </span>
                )}
                {' '}
              </span>
            )
          }
        } else if (item.type === 'missing') {
          elements.push(
            <span key={`missing-${index}`} style={{ color: '#ff4d4f', fontWeight: 400 }}>
              {wordsAnswer[item.ansIdx]}{' '}
            </span>
          )
        } else if (item.type === 'extra') {
          elements.push(
            <span key={`extra-${index}`} style={{
              color: '#ff4d4f',
              fontWeight: 400,
              textDecoration: 'line-through',
              textDecorationColor: '#ff4d4f'
            }}>
              {wordsUser[item.userIdx]}{' '}
            </span>
          )
        }
      })

      return (
        <span ref={wrapperRef} style={{
          padding: '4px 12px',
          borderRadius: 8,
          fontSize: 17,
          display: 'inline-flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          gap: 4,
          background: 'rgba(255, 77, 79, 0.05)',
          border: '1px solid rgba(255, 77, 79, 0.3)'
        }}>
          {elements}
        </span>
      )
    }
  }

  return (
    <span ref={wrapperRef} style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => {
          setHasChecked(false)
          onChange(e.target.value)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && value && !hasChecked) {
            setHasChecked(true)
            onCheck()
          }
        }}
        disabled={disabled}
        placeholder="Type here..."
        className="smart-input-modern"
        style={{
          padding: '6px 40px 6px 12px',
          borderRadius: 8,
          fontSize: 17,
          lineHeight: '1.5',
          outline: 'none',
          border: '1px solid #d9d9d9',
          width: isMobile ? 140 : 300,
          minWidth: isMobile ? 140 : 300,
          maxWidth: isMobile ? 'calc(100vw - 80px)' : 500,
          textAlign: 'left',
          background: '#fff',
          verticalAlign: 'middle',
          color: '#2b3648',
          transition: 'all 0.3s ease',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#667eea'
          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d9d9d9'
          e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.02)'
        }}
      />
      {value && !hasChecked && (
        <button
          onClick={() => {
            setHasChecked(true)
            onCheck()
          }}
          style={{
            position: 'absolute',
            right: 6,
            padding: 0,
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <CheckOutlined style={{ fontSize: 14 }} />
        </button>
      )}
    </span>
  )
}
