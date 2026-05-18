import React from 'react'
import { Button, Typography, Progress } from 'antd'
import { ArrowLeftOutlined, CameraOutlined, ExclamationCircleOutlined, CheckCircleOutlined, FilePdfOutlined } from '@ant-design/icons'
import CustomAudioPlayer from './CustomAudioPlayer'

const { Title, Text } = Typography

// Exercise Header Component for Mobile
export default function ExerciseHeaderMobile({
  audioInfo,
  navigate,
  allBlanks,
  filled,
  remaining,
  isSubmitted,
  userAnswers,
  handleClearSaved,
  handleExportImage,
  handleExportPDF,
  isExporting,
  scrollToFirstUnanswered
}) {
  const percent = Math.round((filled / allBlanks.length) * 100)

  return (
    <div className="exercise-header-sticky" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      margin: '0 -12px',
      padding: '16px 12px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
      boxShadow: '0 4px 30px rgba(0,0,0,0.05)'
    }}>
      {/* Mobile Header Row 1: Back + Title | Progress */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 10
      }}>
        {/* Left: Back + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => navigate('/listening')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 10,
              border: 'none',
              background: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <ArrowLeftOutlined style={{ fontSize: 16, color: '#4a5a75' }} />
          </button>
          <div style={{
            padding: '8px 14px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
          }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
              {audioInfo.title}
            </span>
          </div>
        </div>

        {/* Right: Progress Circle + Remaining */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 12px',
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <Progress
            type="circle"
            percent={percent}
            strokeColor={{
              '0%': '#667eea',
              '100%': '#764ba2'
            }}
            trailColor="rgba(0,0,0,0.05)"
            size={38}
            strokeWidth={8}
            format={(percent) => (
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {percent}%
              </span>
            )}
          />
          <Text style={{ fontSize: 13, color: '#4a5a75', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {remaining > 0 ? `${remaining} left` : 'Done'}
          </Text>
          {remaining === 0 && (
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
          )}
        </div>
      </div>

      {/* Mobile Row 2: Audio Player */}
      <div style={{ marginBottom: 10 }}>
        <CustomAudioPlayer src={audioInfo.file} audioId={audioInfo.file} />
      </div>

      {/* Mobile Row 3: Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!isSubmitted && remaining > 0 && allBlanks.length > 0 && (
          <Button
            type="primary"
            size="middle"
            className="jump-btn"
            onClick={scrollToFirstUnanswered}
            style={{
              background: 'linear-gradient(135deg, #F0AD4E 0%, #ed8936 100%)',
              border: 'none',
              height: 40,
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(240, 173, 78, 0.4)'
            }}
          >
            Go to Blank
          </Button>
        )}

        {!isSubmitted && Object.keys(userAnswers).length > 0 && (
          <Button
            size="middle"
            onClick={handleClearSaved}
            icon={<ExclamationCircleOutlined />}
            style={{
              borderColor: '#ffccc7',
              color: '#ff4d4f',
              height: 40,
              borderRadius: 12,
              fontSize: 14,
              background: 'rgba(255,255,255,0.8)'
            }}
          >
            Clear Saved
          </Button>
        )}

        {isSubmitted && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              onClick={handleExportPDF}
              icon={<FilePdfOutlined />}
              size="middle"
              className="export-btn"
              style={{
                background: '#fff',
                border: '1px solid #ff4d4f',
                color: '#ff4d4f',
                height: 40,
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                flex: 1,
                boxShadow: '0 4px 12px rgba(255, 77, 79, 0.2)'
              }}
            >
              Save PDF
            </Button>
            <Button
              type="primary"
              size="middle"
              onClick={handleExportImage}
              loading={isExporting}
              icon={<CameraOutlined />}
              className="export-btn"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                height: 40,
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                flex: 1,
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
            >
              Save Image
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
