import React from 'react'
import { Button, Typography, Progress } from 'antd'
import { LeftOutlined, CameraOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import CustomAudioPlayer from './CustomAudioPlayer'

const { Title, Text } = Typography

// Exercise Header Component for Desktop
export default function ExerciseHeaderDesktop({
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
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      margin: '0 -24px',
      padding: '12px 20px',
      borderBottom: '1px solid #f0f0f0',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'nowrap' }}>
        {/* Left: Back & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate('/listening')}
            style={{
              color: '#666',
              fontSize: 14,
              borderRadius: 8,
              transition: 'all 0.2s'
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
          }}>
            <Title level={5} style={{ margin: 0, color: '#fff', whiteSpace: 'nowrap', fontSize: 15 }}>
              {audioInfo.title}
            </Title>
          </div>
        </div>

        {/* Center: Audio Player */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, maxWidth: 500 }}>
          <CustomAudioPlayer src={audioInfo.file} audioId={audioInfo.file} />
        </div>

        {/* Right: Progress & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 12px',
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
              size={42}
              format={(percent) => (
                <span style={{
                  fontSize: 11,
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
              {remaining > 0 ? `${remaining} remain` : 'Complete'}
            </Text>
            {remaining === 0 && (
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 14 }} />
            )}
          </div>

          {!isSubmitted && remaining > 0 && allBlanks.length > 0 && (
            <Button
              size="small"
              type="primary"
              onClick={scrollToFirstUnanswered}
              style={{
                background: 'linear-gradient(135deg, #F0AD4E 0%, #ed8936 100%)',
                border: 'none',
                fontSize: 12,
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(240, 173, 78, 0.4)'
              }}
            >
              Go
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
                fontSize: 12,
                borderRadius: 8
              }}
            >
              Clear
            </Button>
          )}

          {isSubmitted && (
            <Button
              type="primary"
              onClick={handleExportImage}
              loading={isExporting}
              icon={<CameraOutlined />}
              size="small"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)'
              }}
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
