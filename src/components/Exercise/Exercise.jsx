import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout, Typography, Button, Modal, Tag, Card, message } from 'antd'
import { DownloadOutlined, ExclamationCircleOutlined, LeftOutlined } from '@ant-design/icons'
import html2canvas from 'html2canvas'

import audio1Questions from '../../data/audio1/audio_1_questions.json'
import audio1Answers from '../../data/audio1/audio_1_answers.json'
import audio2Questions from '../../data/audio2/audio_2_questions.json'
import audio2Answers from '../../data/audio2/audio_2_answers.json'
import audio3Questions from '../../data/audio3/audio_3_questions.json'
import audio3Answers from '../../data/audio3/audio_3_answers.json'
import audio4Questions from '../../data/audio4/audio_4_questions.json'
import audio4Answers from '../../data/audio4/audio_4_answers.json'
import audio5Questions from '../../data/audio5/audio_5_questions.json'
import audio5Answers from '../../data/audio5/audio_5_answers.json'
import audio6Questions from '../../data/audio6/audio_6_questions.json'
import audio6Answers from '../../data/audio6/audio_6_answers.json'
import audio7Questions from '../../data/audio7/audio_7_questions.json'
import audio7Answers from '../../data/audio7/audio_7_answers.json'
import audio8Questions from '../../data/audio8/audio_8_questions.json'
import audio8Answers from '../../data/audio8/audio_8_answers.json'
import audio9Questions from '../../data/audio9/audio_9_questions.json'
import audio9Answers from '../../data/audio9/audio_9_answers.json'
import audio13Questions from '../../data/audio13/audio_13_questions.json'
import audio13Answers from '../../data/audio13/audio_13_answers.json'
import audio17Questions from '../../data/audio17/audio_17_questions.json'
import audio17Answers from '../../data/audio17/audio_17_answers.json'
import audio10Questions from '../../data/audio10/audio_10_questions.json'
import audio10Answers from '../../data/audio10/audio_10_answers.json'
import audio11Questions from '../../data/audio11/audio_11_questions.json'
import audio11Answers from '../../data/audio11/audio_11_answers.json'
import audio12Questions from '../../data/audio12/audio_12_questions.json'
import audio12Answers from '../../data/audio12/audio_12_answers.json'
import audio14Questions from '../../data/audio14/audio_14_questions.json'
import audio14Answers from '../../data/audio14/audio_14_answers.json'
import audio15Questions from '../../data/audio15/audio_15_questions.json'
import audio15Answers from '../../data/audio15/audio_15_answers.json'
import audio18Questions from '../../data/audio18/audio_18_questions.json'
import audio18Answers from '../../data/audio18/audio_18_answers.json'
import audio19Questions from '../../data/audio19/audio_19_questions.json'
import audio19Answers from '../../data/audio19/audio_19_answers.json'
import audio20Questions from '../../data/audio20/audio_20_questions.json'
import audio20Answers from '../../data/audio20/audio_20_answers.json'
import audio21Questions from '../../data/audio21/audio_21_questions.json'
import audio21Answers from '../../data/audio21/audio_21_answers.json'
import audio22Questions from '../../data/audio22/audio_22_questions.json'
import audio22Answers from '../../data/audio22/audio_22_answers.json'
import audio23Questions from '../../data/audio23/audio_23_questions.json'
import audio23Answers from '../../data/audio23/audio_23_answers.json'
import audio24Questions from '../../data/audio24/audio_24_questions.json'
import audio24Answers from '../../data/audio24/audio_24_answers.json'
import audio29Questions from '../../data/audio29/audio_29_questions.json'
import audio29Answers from '../../data/audio29/audio_29_answers.json'
import audio30Questions from '../../data/audio30/audio_30_questions.json'
import audio30Answers from '../../data/audio30/audio_30_answers.json'
import audio31Questions from '../../data/audio31/audio_31_questions.json'
import audio31Answers from '../../data/audio31/audio_31_answers.json'
import audio32Questions from '../../data/audio32/audio_32_questions.json'
import audio32Answers from '../../data/audio32/audio_32_answers.json'
import audio33Questions from '../../data/audio33/audio_33_questions.json'
import audio33Answers from '../../data/audio33/audio_33_answers.json'

import ExerciseHeaderDesktop from './ExerciseHeaderDesktop'
import ExerciseHeaderMobile from './ExerciseHeaderMobile'
import ExerciseContent from './ExerciseContent'
import SmartInput from './SmartInput'

const { Content } = Layout
const { Text } = Typography

const EXPIRY_MS = 24 * 60 * 60 * 1000

export const cleanupStaleStorage = () => {
  try {
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('exercise_')) {
        const savedData = localStorage.getItem(key)
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData)
            if (parsed && parsed.timestamp) {
              const age = Date.now() - parsed.timestamp
              if (age >= EXPIRY_MS) {
                keysToRemove.push(key)
              }
            } else {
              keysToRemove.push(key)
            }
          } catch(e) {
            keysToRemove.push(key)
          }
        }
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k))
    if (keysToRemove.length > 0) {
      console.log(`Cleaned up ${keysToRemove.length} stale exercise data entries.`)
    }
  } catch (error) {
    console.error('Error during cleanup:', error)
  }
}

// Audio data mapping
const audioData = {
  audio1: { questions: audio1Questions, answers: audio1Answers, file: '/Audio 1.mp3', title: 'Audio 1' },
  audio2: { questions: audio2Questions, answers: audio2Answers, file: '/Audio 2.mp3', title: 'Audio 2' },
  audio3: { questions: audio3Questions, answers: audio3Answers, file: '/Audio 3.mp3', title: 'Audio 3' },
  audio4: { questions: audio4Questions, answers: audio4Answers, file: '/Audio 4.mp3', title: 'Audio 4' },
  audio5: { questions: audio5Questions, answers: audio5Answers, file: '/Audio 5.mp3', title: 'Audio 5' },
  audio6: { questions: audio6Questions, answers: audio6Answers, file: '/Audio 6.mp3', title: 'Audio 6' },
  audio7: { questions: audio7Questions, answers: audio7Answers, file: '/Audio 7.mp3', title: 'Audio 7' },
  audio8: { questions: audio8Questions, answers: audio8Answers, file: '/Audio 8.mp3', title: 'Audio 8' },
  audio9: { questions: audio9Questions, answers: audio9Answers, file: '/Audio 9.mp3', title: 'Audio 9' },
  audio10: { questions: audio10Questions, answers: audio10Answers, file: '/Audio 10.mp3', title: 'Audio 10' },
  audio11: { questions: audio11Questions, answers: audio11Answers, file: '/Audio 11.mp3', title: 'Audio 11' },
  audio12: { questions: audio12Questions, answers: audio12Answers, file: '/Audio 12.mp3', title: 'Audio 12' },
  audio13: { questions: audio13Questions, answers: audio13Answers, file: '/Audio 13.mp3', title: 'Audio 13' },
  audio14: { questions: audio14Questions, answers: audio14Answers, file: '/Audio 14.mp3', title: 'Audio 14' },
  audio15: { questions: audio15Questions, answers: audio15Answers, file: '/Audio 15.mp3', title: 'Audio 15' },
  audio17: { questions: audio17Questions, answers: audio17Answers, file: '/Audio 17.mp3', title: 'Audio 17' },
  audio18: { questions: audio18Questions, answers: audio18Answers, file: '/Audio 18.mp3', title: 'Audio 18' },
  audio19: { questions: audio19Questions, answers: audio19Answers, file: '/Audio 19.mp3', title: 'Audio 19' },
  audio20: { questions: audio20Questions, answers: audio20Answers, file: '/Audio 20.mp3', title: 'Audio 20' },
  audio21: { questions: audio21Questions, answers: audio21Answers, file: '/Audio 21.mp3', title: 'Audio 21' },
  audio22: { questions: audio22Questions, answers: audio22Answers, file: '/Audio 22.mp3', title: 'Audio 22' },
  audio23: { questions: audio23Questions, answers: audio23Answers, file: '/Audio 23.mp3', title: 'Audio 23' },
  audio24: { questions: audio24Questions, answers: audio24Answers, file: '/Audio 24.mp3', title: 'Audio 24' },
  audio29: { questions: audio29Questions, answers: audio29Answers, file: '/Audio 29.mp3', title: 'Audio 29' },
  audio30: { questions: audio30Questions, answers: audio30Answers, file: '/Audio 30.mp3', title: 'Audio 30' },
  audio31: { questions: audio31Questions, answers: audio31Answers, file: '/Audio 31.mp3', title: 'Audio 31' },
  audio32: { questions: audio32Questions, answers: audio32Answers, file: '/Audio 32.mp3', title: 'Audio 32' },
  audio33: { questions: audio33Questions, answers: audio33Answers, file: '/Audio 33.mp3', title: 'Audio 33' }
}

// Submit Button Component
function SubmitButton({ onClick, isMobile }) {
  if (isMobile) {
    return (
      <Button
        type="primary"
        size="large"
        className="submit-btn"
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
          width: '100%',
          height: 52,
          fontSize: 16,
          fontWeight: 600,
          borderRadius: 16,
          marginTop: 24,
          letterSpacing: '0.5px'
        }}
        icon={<DownloadOutlined style={{ fontSize: 18 }} />}
      >
        Submit Answers
      </Button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      zIndex: 99
    }}>
      <Button
        type="primary"
        size="large"
        className="submit-btn"
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
          height: 56,
          padding: '0 32px',
          fontSize: 16,
          fontWeight: 600,
          borderRadius: 28,
          letterSpacing: '0.5px'
        }}
        icon={<DownloadOutlined style={{ fontSize: 20 }} />}
      >
        Submit Answers
      </Button>
    </div>
  )
}

// Confirmation Modal Component
function ConfirmModal({ open, onOk, onCancel, remaining }) {
  return (
    <Modal
      title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ExclamationCircleOutlined style={{ color: '#faad14' }} /> Confirm</span>}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Yes, submit"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      <p>You have not answered {remaining} questions yet.</p>
      <p>Do you still want to submit?</p>
    </Modal>
  )
}

// Main Exercise Component
function Exercise() {
  const { audioId } = useParams()
  const navigate = useNavigate()
  const [userAnswers, setUserAnswers] = useState({})
  const [checkResults, setCheckResults] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const exerciseRef = useRef(null)
  const blankRefs = useRef({})

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const audioInfo = audioData[audioId]
  if (!audioInfo) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Button type="primary" icon={<LeftOutlined />} onClick={() => navigate('/listening')}>
          Back to Listening
        </Button>
        <div style={{ marginTop: 24 }}>
          <Text>Audio not found</Text>
        </div>
      </div>
    )
  }

  const data = audioInfo.questions
  const answers = audioInfo.answers

  // Expose answers to console via kaka_check
  useEffect(() => {
    window.kaka_check = () => {
      console.log(`%c 🎯 Filling answers for ${audioId}...`, 'color: #1677ff; font-weight: bold; font-size: 14px;')
      setUserAnswers(answers)
      const results = {}
      Object.keys(answers).forEach(id => {
        results[id] = 'correct'
      })
      setCheckResults(results)
      console.table(answers)
      return answers
    }

    window.kaka_done = () => {
      console.log(`%c 🎯 Filling realistic answers for ${audioId}...`, 'color: #722ed1; font-weight: bold; font-size: 14px;')
      
      const makeRealisticTypo = (text) => {
        if (!text) return 'test';
        
        // Rule 1: Contraction / 'd handling (always break/remove it)
        if (text.includes("'d")) {
          return text.replace(/'d/g, ""); // "I'd" -> "I", "wish I'd had" -> "wish I had"
        }
        if (text.includes("'ve")) {
          return text.replace(/'ve/g, " have");
        }
        if (text.includes("it's")) {
          return text.replace(/it's/g, "its");
        }
        if (text.includes("its")) {
          return text.replace(/its/g, "it's");
        }
        if (text.includes("there's")) {
          return text.replace(/there's/g, "theres");
        }
        if (text.includes("don't")) {
          return text.replace(/don't/g, "dont");
        }
        if (text.includes("you're")) {
          return text.replace(/you're/g, "your");
        }
        if (text.includes("they're")) {
          return text.replace(/they're/g, "there");
        }

        const homophones = {
          "to": "too", "too": "to", "two": "to",
          "there": "their", "their": "there", "they're": "there",
          "here": "hear", "hear": "here",
          "be": "bee",
          "our": "hour",
          "for": "four",
          "lose": "loose", "loose": "lose",
          "then": "than", "than": "then",
          "where": "were", "were": "where",
          "would": "wood",
          "whole": "hole",
          "dam": "dame", "dame": "dam",
          "affect": "effect", "effect": "affect",
          "passed": "past", "past": "passed",
          "weather": "whether", "whether": "weather",
          "know": "no", "no": "know",
          "some": "sum",
          "right": "write", "write": "right",
          "meet": "meat", "meat": "meet",
          "lead": "led", "led": "lead",
          "waste": "waist"
        };

        const words = text.split(/\s+/);

        // Rule 2: Homophone Replacement
        for (let idx = 0; idx < words.length; idx++) {
          const wClean = words[idx].toLowerCase().replace(/[.,!?;:]/g, '');
          if (homophones[wClean]) {
            const replacement = homophones[wClean];
            const isCapitalized = words[idx][0] === words[idx][0].toUpperCase();
            const repFinal = isCapitalized ? replacement[0].toUpperCase() + replacement.slice(1) : replacement;
            words[idx] = words[idx].toLowerCase().replace(wClean, repFinal);
            return words.join(' ');
          }
        }

        // Rule 3: If phrase has a complex/long word (length >= 8), misspell it directly
        const hasComplex = words.some(w => w.toLowerCase().replace(/[.,!?;:]/g, '').length >= 8);
        if (hasComplex) {
          let targetWordIdx = 0;
          let maxLen = 0;
          words.forEach((w, idx) => {
            if (w.length > maxLen) {
              maxLen = w.length;
              targetWordIdx = idx;
            }
          });

          let word = words[targetWordIdx];
          const wordLower = word.toLowerCase();

          if (wordLower.endsWith('s') && wordLower.length > 4) {
            word = word.slice(0, -1);
          } else if (wordLower.endsWith('y')) {
            word = word.slice(0, -1) + 'ie';
          } else {
            const doubleLetterMatch = word.match(/([a-zA-Z])\1/);
            if (doubleLetterMatch) {
              word = word.replace(doubleLetterMatch[0], doubleLetterMatch[1]);
            } else {
              if (word.length > 5) {
                word = word.slice(0, -1);
              } else {
                word = word + 'e';
              }
            }
          }
          words[targetWordIdx] = word;
          return words.join(' ');
        }

        // Rule 4: Drop helper word if long phrase (no complex word present)
        if (words.length > 3) {
          const indexToDrop = words.findIndex(w => ['a', 'the', 'of', 'to', 'for', 'in', 'on', 'is', 'it'].includes(w.toLowerCase()));
          if (indexToDrop !== -1) {
            const copy = [...words];
            copy.splice(indexToDrop, 1);
            return copy.join(' ');
          }
        }

        // Rule 5: Pick longest word and make a grammatical or spelling typo for simple phrases
        let targetWordIdx = 0;
        let maxLen = 0;
        words.forEach((w, idx) => {
          if (w.length > maxLen) {
            maxLen = w.length;
            targetWordIdx = idx;
          }
        });

        let word = words[targetWordIdx];
        const wordLower = word.toLowerCase();

        if (wordLower === "is") word = "are";
        else if (wordLower === "are") word = "is";
        else if (wordLower === "was") word = "were";
        else if (wordLower === "were") word = "was";
        else if (wordLower === "has") word = "have";
        else if (wordLower === "have") word = "has";
        else if (wordLower.endsWith('s') && wordLower.length > 4) {
          word = word.slice(0, -1);
        } else if (wordLower.endsWith('y')) {
          word = word.slice(0, -1) + 'ie';
        } else {
          const doubleLetterMatch = word.match(/([a-zA-Z])\1/);
          if (doubleLetterMatch) {
            word = word.replace(doubleLetterMatch[0], doubleLetterMatch[1]);
          } else {
            if (word.length > 5) {
              word = word.slice(0, -1);
            } else {
              word = word + 'e';
            }
          }
        }

        words[targetWordIdx] = word;
        return words.join(' ');
      }

      const containsComplexWord = (text) => {
        if (!text) return false;
        return text.split(/\s+/).some(w => {
          const clean = w.toLowerCase().replace(/[.,!?;:]/g, '');
          return clean.length >= 8;
        });
      };

      const newAnswers = {}
      const newResults = {}

      Object.keys(answers).forEach(id => {
        let val = answers[id]

        if (audioId === 'audio20') {
          // Specific mapping for Audio 20 based on 20.pdf
          const blankIds = [
            'audio20_q1', 'audio20_q4', 'audio20_q5', 'audio20_q6', 'audio20_q7',
            'audio20_q10', 'audio20_q11', 'audio20_q13', 'audio20_q15', 'audio20_q16',
            'audio20_q17', 'audio20_q19', 'audio20_q21', 'audio20_q30', 'audio20_q35',
            'audio20_q36'
          ]
          if (blankIds.includes(id)) {
            val = makeRealisticTypo(answers[id])
          } else if (id === 'audio20_q9') {
            val = 'hamful'
          } else if (id === 'audio20_q18') {
            val = 'behind the dame and the river below'
          } else if (id === 'audio20_q32') {
            val = 'get so low in summer that'
          }
        } else {
          // General heuristic for other audios
          const match = id.match(/_q(\d+)$/)
          const qNum = match ? parseInt(match[1], 10) : 1
          
          if (qNum % 3 === 0 || qNum % 5 === 0 || containsComplexWord(answers[id])) {
            val = makeRealisticTypo(answers[id])
          }
        }

        newAnswers[id] = val

        const normalizedVal = normalizeText(val)
        const normalizedAns = normalizeText(answers[id])
        if (normalizedVal === normalizedAns) {
          newResults[id] = 'correct'
        } else {
          newResults[id] = 'wrong'
        }
      })

      setUserAnswers(newAnswers)
      setCheckResults(newResults)
      setIsSubmitted(true)

      try {
        const storageKey = getStorageKey()
        localStorage.setItem(storageKey, JSON.stringify({
          answers: newAnswers,
          checkResults: newResults,
          isSubmitted: true,
          timestamp: Date.now()
        }))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }

      console.table(newAnswers)
      return newAnswers
    }

    return () => {
      delete window.kaka_check
      delete window.kaka_done
    }
  }, [audioId, answers])

  // Get all blanks
  const allBlanks = data.dialogue.flatMap(item =>
    (item.text || item.content || []).filter(p => p.type === 'blank')
  )

  const filled = allBlanks.filter(q => userAnswers[q.id]?.trim()).length
  const remaining = allBlanks.length - filled

  const getStorageKey = () => `exercise_${audioId}`

  // Cleanup and load saved answers
  useEffect(() => {
    // Run global cleanup first
    cleanupStaleStorage()
    
    // Reset scroll to top on route change
    window.scrollTo(0, 0)

    try {
      const storageKey = getStorageKey()
      const savedData = localStorage.getItem(storageKey)

      if (savedData) {
        const parsed = JSON.parse(savedData)
        if (parsed && parsed.timestamp) {
          const age = Date.now() - parsed.timestamp
          if (age < EXPIRY_MS) {
            if (parsed.answers) {
              setUserAnswers(parsed.answers)
            }
            if (parsed.checkResults) {
              setCheckResults(parsed.checkResults)
            }
            if (parsed.isSubmitted) {
              setIsSubmitted(true)
            }
            message.info({ content: 'Previous progress restored', key: 'restore', duration: 2 })
          } else {
            localStorage.removeItem(storageKey)
          }
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error)
    }
  }, [audioId])

  const handleInput = (id, value) => {
    setUserAnswers(prev => ({ ...prev, [id]: value }))
    if (checkResults[id]) {
      setCheckResults(prev => ({ ...prev, [id]: null }))
    }

    if (!isSubmitted) {
      try {
        const newAnswers = { ...userAnswers, [id]: value }
        const storageKey = getStorageKey()
        localStorage.setItem(storageKey, JSON.stringify({
          answers: newAnswers,
          checkResults: { ...checkResults, [id]: null },
          isSubmitted: false,
          timestamp: Date.now()
        }))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }
  }

  // Helper to normalize text by ignoring punctuation
  const normalizeText = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase()
      .replace(/[-/]/g, ' ')
      .replace(/[.,!?;:()[\]{}"]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const handleCheck = (id) => {
    const val = normalizeText(userAnswers[id])
    const ans = normalizeText(answers[id])
    const newResult = val === ans ? 'correct' : 'wrong'

    setCheckResults(prev => {
      const updated = { ...prev, [id]: newResult }
      if (!isSubmitted) {
        try {
          const storageKey = getStorageKey()
          localStorage.setItem(storageKey, JSON.stringify({
            answers: userAnswers,
            checkResults: updated,
            isSubmitted: false,
            timestamp: Date.now()
          }))
        } catch (error) {
          console.error('Error saving to localStorage:', error)
        }
      }
      return updated
    })
  }

  const handleSubmitClick = () => {
    if (remaining > 0) {
      setConfirmModalOpen(true)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    setConfirmModalOpen(false)
    allBlanks.forEach(q => {
      const val = normalizeText(userAnswers[q.id])
      const ans = normalizeText(answers[q.id])
      if (val === ans) {
        setCheckResults(prev => ({ ...prev, [q.id]: 'correct' }))
      } else {
        setCheckResults(prev => ({ ...prev, [q.id]: 'wrong' }))
      }
    })

    // Save submitted state and check results
    try {
      const storageKey = getStorageKey()
      localStorage.setItem(storageKey, JSON.stringify({
        answers: userAnswers,
        checkResults: checkResults,
        isSubmitted: true,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }

    message.success({ content: 'Exercise submitted!', key: 'submit' })
  }

  const scrollToFirstUnanswered = () => {
    const unanswered = allBlanks.find(q => !userAnswers[q.id]?.trim())
    if (unanswered && blankRefs.current[unanswered.id]) {
      blankRefs.current[unanswered.id].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      setTimeout(() => {
        const element = blankRefs.current[unanswered.id]
        const input = element?.tagName === 'INPUT' ? element : element?.querySelector('input')
        if (input) {
          input.focus()
        }
      }, 500)
    }
  }

  const handleExportImage = async () => {
    if (!exerciseRef.current) return

    setIsExporting(true)
    message.loading({ content: 'Creating image...', key: 'export' })

    try {
      const container = exerciseRef.current
      const cloneContainer = document.createElement('div')
      cloneContainer.style.cssText = 'position: absolute; left: 0; top: 0; background: white;'
      document.body.appendChild(cloneContainer)

      const clone = container.cloneNode(true)

      const originalInputs = container.querySelectorAll('input, textarea, select')
      const clonedInputs = clone.querySelectorAll('input, textarea, select')
      originalInputs.forEach((input, idx) => {
        if (clonedInputs[idx]) {
          if (input.type === 'checkbox' || input.type === 'radio') {
            clonedInputs[idx].checked = input.checked
          } else {
            clonedInputs[idx].value = input.value
          }
        }
      })

      cloneContainer.appendChild(clone)

      await new Promise(resolve => setTimeout(resolve, 50))

      const allElements = clone.querySelectorAll('*')

      clone.style.cssText = 'position: relative; width: 1440px; max-width: 1440px; height: auto; overflow: visible; padding: 16px; background: white;'

      allElements.forEach(el => {
        el.style.width = 'auto'
        el.style.maxWidth = 'none'
        el.style.minWidth = '0'
        el.style.flex = '0 1 auto'
        el.style.position = 'static'
        el.style.maxHeight = 'none'
        el.style.overflow = 'visible'

        if (el.classList && el.classList.contains('ant-card')) {
          el.style.width = '100%'
          el.style.maxWidth = '1408px'
        }

        if (el.classList && el.classList.contains('ant-layout-content')) {
          el.style.cssText = 'padding: 0; max-height: none; overflow: visible;'
        }
      })

      await new Promise(resolve => setTimeout(resolve, 300))

      const captureWidth = clone.scrollWidth
      const captureHeight = clone.scrollHeight

      cloneContainer.style.width = captureWidth + 'px'
      cloneContainer.style.height = captureHeight + 'px'

      const canvas = await html2canvas(cloneContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        width: captureWidth,
        height: captureHeight,
        scrollX: 0,
        scrollY: 0
      })

      document.body.removeChild(cloneContainer)

      const link = document.createElement('a')
      link.download = `${audioId}_${new Date().toISOString().slice(0, 10)}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

      message.success({ content: 'Image saved successfully!', key: 'export' })

      // Auto-clear local storage after export
      try {
        const storageKey = getStorageKey()
        localStorage.removeItem(storageKey)
      } catch (e) {
        console.error('Error clearing localStorage after export:', e)
      }
    } catch (error) {
      console.error('Export error:', error)
      message.error({ content: 'Error saving image!', key: 'export' })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = () => {
    // Temporarily change document title to suggest a nice file name for the PDF
    const originalTitle = document.title
    document.title = `${audioInfo.title}_Transcript`
    
    // Trigger browser print dialog which can be saved to PDF
    window.print()
    
    // Restore original title
    document.title = originalTitle
  }

  const handleClearSaved = () => {
    try {
      const storageKey = getStorageKey()
      localStorage.removeItem(storageKey)
      setUserAnswers({})
      setCheckResults({})
      setIsSubmitted(false)
      message.success({ content: 'Saved exercise deleted!', key: 'clear' })
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  // Desktop layout
  if (!isMobile) {
    return (
      <div className="audio-exercise exercise-page" ref={exerciseRef} style={{ padding: '0 24px', overflow: 'visible' }}>
        <ExerciseHeaderDesktop
          audioInfo={audioInfo}
          navigate={navigate}
          allBlanks={allBlanks}
          filled={filled}
          remaining={remaining}
          isSubmitted={isSubmitted}
          userAnswers={userAnswers}
          handleClearSaved={handleClearSaved}
          handleExportImage={handleExportImage}
          handleExportPDF={handleExportPDF}
          isExporting={isExporting}
          scrollToFirstUnanswered={scrollToFirstUnanswered}
        />

        <Content style={{ padding: '0 0 40px 0' }}>
          <div style={{ marginTop: 24, maxWidth: 1000, margin: '24px auto 0 auto' }}>
            <Card size="large" style={{ marginBottom: 12, border: 'none', borderRadius: 24, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
              {data.dialogue.map((item, idx) => (
                <div key={idx} style={{ marginBottom: 24, paddingBottom: 16, borderBottom: idx !== data.dialogue.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                  {item.speaker && (
                    <Tag 
                      color={item.speaker === 'Agent' || item.speaker === 'Advisor' || item.speaker === 'Speaker' ? '#e6f4ff' : '#f9f0ff'}
                      style={{ 
                        color: item.speaker === 'Agent' || item.speaker === 'Advisor' || item.speaker === 'Speaker' ? '#1677ff' : '#722ed1',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: 14,
                        fontWeight: 600
                      }}
                    >
                      {item.speaker}
                    </Tag>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 12, alignItems: 'center', lineHeight: '2.4' }}>
                    {(item.text || item.content || []).map((part, i) => {
                      if (part.type === 'text') return <span key={i} className="dialogue-text">{part.value}</span>
                      if (part.type === 'blank') {
                        const val = userAnswers[part.id] || ''
                        const isCorrect = checkResults[part.id] === 'correct'
                        const isWrong = checkResults[part.id] === 'wrong'

                        return (
                          <SmartInput
                            key={part.id}
                            value={val}
                            answer={answers[part.id]}
                            onChange={v => handleInput(part.id, v)}
                            onCheck={() => handleCheck(part.id)}
                            disabled={isCorrect}
                            isCorrect={isCorrect}
                            isWrong={isWrong}
                            blankRef={(el) => blankRefs.current[part.id] = el}
                            isMobile={false}
                          />
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </Content>

        {!isSubmitted && <SubmitButton onClick={handleSubmitClick} isMobile={false} />}

        <ConfirmModal
          open={confirmModalOpen}
          onOk={handleSubmit}
          onCancel={() => setConfirmModalOpen(false)}
          remaining={remaining}
        />
      </div>
    )
  }

  // Mobile layout
  return (
    <div className="audio-exercise exercise-page mobile-exercise-wrapper" ref={exerciseRef} style={{ padding: '0', overflow: 'visible' }}>
      <ExerciseHeaderMobile
        audioInfo={audioInfo}
        navigate={navigate}
        allBlanks={allBlanks}
        filled={filled}
        remaining={remaining}
        isSubmitted={isSubmitted}
        userAnswers={userAnswers}
        handleClearSaved={handleClearSaved}
        handleExportImage={handleExportImage}
        handleExportPDF={handleExportPDF}
        isExporting={isExporting}
        scrollToFirstUnanswered={scrollToFirstUnanswered}
      />

      <Content style={{ padding: '0 12px 24px 12px' }}>
        <Card
          size="small"
          style={{ marginBottom: 8, border: 'none', borderRadius: 16, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
          bodyStyle={{ padding: 16 }}
        >
          {data.dialogue.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: idx !== data.dialogue.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
              {item.speaker && (
                <Tag
                  color={item.speaker === 'Agent' || item.speaker === 'Advisor' || item.speaker === 'Speaker' ? '#e6f4ff' : '#f9f0ff'}
                  style={{ 
                    color: item.speaker === 'Agent' || item.speaker === 'Advisor' || item.speaker === 'Speaker' ? '#1677ff' : '#722ed1',
                    border: 'none',
                    padding: '2px 10px',
                    borderRadius: '6px',
                    fontSize: 13,
                    fontWeight: 600
                  }}
                >
                  {item.speaker}
                </Tag>
              )}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: 12,
                alignItems: 'center',
                lineHeight: '2.4'
              }}>
                {(item.text || item.content || []).map((part, i) => {
                  if (part.type === 'text') return <span key={i} className="dialogue-text">{part.value}</span>
                  if (part.type === 'blank') {
                    const val = userAnswers[part.id] || ''
                    const isCorrect = checkResults[part.id] === 'correct'
                    const isWrong = checkResults[part.id] === 'wrong'

                    return (
                      <SmartInput
                        key={part.id}
                        value={val}
                        answer={answers[part.id]}
                        onChange={v => handleInput(part.id, v)}
                        onCheck={() => handleCheck(part.id)}
                        disabled={isCorrect}
                        isCorrect={isCorrect}
                        isWrong={isWrong}
                        blankRef={(el) => blankRefs.current[part.id] = el}
                        isMobile={true}
                      />
                    )
                  }
                  return null
                })}
              </div>
            </div>
          ))}

          {/* Submit button at the end of content */}
          {!isSubmitted && (
            <div style={{ marginTop: 16 }}>
              <SubmitButton onClick={handleSubmitClick} isMobile={true} />
            </div>
          )}
        </Card>
      </Content>

      <ConfirmModal
        open={confirmModalOpen}
        onOk={handleSubmit}
        onCancel={() => setConfirmModalOpen(false)}
        remaining={remaining}
      />
    </div>
  )
}

export default Exercise
