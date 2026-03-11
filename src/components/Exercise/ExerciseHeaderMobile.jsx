import React from 'react'
import { Button, Typography, Progress } from 'antd'
import { ArrowLeftOutlined, CameraOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
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
  isExporting,
  scrollToFirstUnanswered
}) {
  const percent = Math.round((filled / allBlanks.length) * 100)

  return (
    <div className="exercise-header-sticky" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      margin: '0 -12px',
      padding: '12px',
      borderBottom: '1px solid #f0f0f0',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)'
            }}
          >
            <ArrowLeftOutlined style={{ fontSize: 14, color: '#fff' }} />
          </button>
          <div style={{
            padding: '6px 12px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
              {audioInfo.title}
            </span>
          </div>
        </div>

        {/* Right: Progress Circle + Remaining */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          borderRadius: 10,
          background: '#f8fafc',
          border: '1px solid #e8e8e8'
        }}>
          <Progress
            type="circle"
            percent={percent}
            strokeColor={{
              '0%': '#667eea',
              '100%': '#764ba2'
            }}
            trailColor="#e8e8e8"
            size={36}
            format={(percent) => (
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {percent}%
              </span>
            )}
          />
          <Text style={{ fontSize: 12, color: '#666', whiteSpace: 'nowrap' }}>
            {remaining > 0 ? `${remaining} left` : 'Done'}
          </Text>
          {remaining === 0 && (
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 14 }} />
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
            size="small"
            onClick={scrollToFirstUnanswered}
            style={{
              background: 'linear-gradient(135deg, #F0AD4E 0%, #ed8936 100%)',
              border: 'none',
              height: 38,
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              boxShadow: '0 2px 10px rgba(240, 173, 78, 0.4)'
            }}
          >
            Go to Unanswered
          </Button>
        )}

        {!isSubmitted && Object.keys(userAnswers).length > 0 && (
          <Button
            size="small"
            onClick={handleClearSaved}
            icon={<ExclamationCircleOutlined />}
            style={{
              borderColor: '#ffccc7',
              color: '#ff4d4f',
              height: 34,
              borderRadius: 10,
              fontSize: 13
            }}
          >
            Clear Saved
          </Button>
        )}

        {isSubmitted && (
          <Button
            type="primary"
            size="small"
            onClick={handleExportImage}
            loading={isExporting}
            icon={<CameraOutlined />}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              height: 38,
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              boxShadow: '0 2px 10px rgba(102, 126, 234, 0.4)'
            }}
          >
            Save Image
          </Button>
        )}
      </div>
    </div>
  )
}
