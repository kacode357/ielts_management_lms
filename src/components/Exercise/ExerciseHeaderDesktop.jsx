import React from 'react'
import { Button, Typography, Progress } from 'antd'
import { LeftOutlined, CameraOutlined, ExclamationCircleOutlined, CheckCircleOutlined, FilePdfOutlined } from '@ant-design/icons'
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
  handleExportPDF,
  isExporting,
  scrollToFirstUnanswered
}) {
  const percent = Math.round((filled / allBlanks.length) * 100)

  return (
    <div className="exercise-header-sticky" style={{
      position: 'sticky',
      top: 70,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      margin: '0 -24px',
      padding: '16px 24px',
      boxShadow: '0 4px 30px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'nowrap' }}>
        {/* Left: Back & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate('/listening')}
            style={{
              color: '#4a5a75',
              fontSize: 16,
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; e.currentTarget.style.background = '#fff' }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)' }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
          }}>
            <Title level={5} style={{ margin: 0, color: '#fff', whiteSpace: 'nowrap', fontSize: 16, fontWeight: 600 }}>
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
            gap: 12,
            padding: '8px 16px',
            borderRadius: 16,
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
              size={48}
              strokeWidth={8}
              format={(percent) => (
                <span style={{
                  fontSize: 13,
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
            <Text style={{ fontSize: 14, color: '#4a5a75', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {remaining > 0 ? `${remaining} remain` : 'Complete'}
            </Text>
            {remaining === 0 && (
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
            )}
          </div>

          {!isSubmitted && remaining > 0 && allBlanks.length > 0 && (
            <Button
              className="jump-btn"
              size="middle"
              type="primary"
              onClick={scrollToFirstUnanswered}
              style={{
                background: 'linear-gradient(135deg, #F0AD4E 0%, #ed8936 100%)',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(240, 173, 78, 0.4)',
                height: 40,
                padding: '0 20px'
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
                fontSize: 14,
                borderRadius: 12,
                height: 40,
                background: 'rgba(255,255,255,0.8)'
              }}
            >
              Clear
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
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(255, 77, 79, 0.2)',
                  height: 40,
                  fontWeight: 500
                }}
              >
                PDF
              </Button>
              <Button
                type="primary"
                onClick={handleExportImage}
                loading={isExporting}
                icon={<CameraOutlined />}
                size="middle"
                className="export-btn"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  height: 40,
                  fontWeight: 500
                }}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
