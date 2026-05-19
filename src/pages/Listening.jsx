import React, { useState, useEffect } from 'react'
import { Layout, Typography, Card, Row, Col, Button } from 'antd'
import { SoundOutlined, ArrowLeftOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { cleanupStaleStorage } from '../components/Exercise/Exercise'

const { Content } = Layout
const { Title, Text } = Typography

const audioList = [
  { id: 'audio1', title: 'Audio 1', questions: 43 },
  { id: 'audio2', title: 'Audio 2', questions: 47 },
  { id: 'audio3', title: 'Audio 3', questions: 38 },
  { id: 'audio4', title: 'Audio 4', questions: 46 },
  { id: 'audio5', title: 'Audio 5', questions: 41 },
  { id: 'audio6', title: 'Audio 6', questions: 41 },
  { id: 'audio7', title: 'Audio 7', questions: 41 },
  { id: 'audio8', title: 'Audio 8', questions: 30 },
  { id: 'audio9', title: 'Audio 9', questions: 43 },
  { id: 'audio10', title: 'Audio 10', questions: 38 },
  { id: 'audio11', title: 'Audio 11', questions: 41 },
  { id: 'audio12', title: 'Audio 12', questions: 27 },
  { id: 'audio13', title: 'Audio 13', questions: 54 },
  { id: 'audio14', title: 'Audio 14', questions: 26 },
  { id: 'audio15', title: 'Audio 15', questions: 56 },
  { id: 'audio17', title: 'Audio 17', questions: 46 },
  { id: 'audio18', title: 'Audio 18', questions: 42 },
  { id: 'audio19', title: 'Audio 19', questions: 52 }
]

function Listening() {
  const [isMobile, setIsMobile] = useState(false)
  const [animated, setAnimated] = useState(false)
  const navigate = useNavigate()

  // Detect mobile viewport
  useEffect(() => {
    // Run storage cleanup when visiting the index page
    cleanupStaleStorage()

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Trigger animation on mount
  useEffect(() => {
    setTimeout(() => setAnimated(true), 100)
  }, [])

  return (
    <Content
      className="listening-page"
      style={{
        padding: isMobile ? '16px' : '32px',
        minHeight: 'calc(100vh - 64px)',
        background: 'transparent'
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="page-back-btn"
          style={{
            display: isMobile ? 'inline-flex' : 'none',
            marginBottom: 16
          }}
        >
          <ArrowLeftOutlined />
        </button>

        <div style={{
          marginBottom: isMobile ? 32 : 48,
          opacity: animated ? 1 : 0,
          transform: animated ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isMobile ? 64 : 80,
            height: isMobile ? 64 : 80,
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            marginBottom: 20,
            boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)'
          }}>
            <SoundOutlined style={{ fontSize: isMobile ? 28 : 36, color: '#fff' }} />
          </div>

          <Title
            level={1}
            style={{
              marginBottom: 12,
              fontSize: isMobile ? 28 : 42,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #2b3648 0%, #4a5a75 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Listening Exercises
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? 15 : 18, color: '#6b7280', maxWidth: 500, margin: '0 auto', display: 'block', lineHeight: 1.6 }}>
            Master your listening skills with our curated collection of interactive audio practices.
          </Text>
        </div>

        <Row gutter={[isMobile ? 12 : 20, isMobile ? 12 : 20]}>
          {audioList.map((audio, index) => (
            <Col xs={12} sm={12} md={12} lg={6} key={audio.id}>
              <Link to={`/listening/${audio.id}`} style={{ textDecoration: 'none' }}>
                <Card
                  hoverable
                  className="audio-card-modern"
                  style={{
                    height: '100%',
                    borderRadius: 20,
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${index * 0.05}s`
                  }}
                  bodyStyle={{
                    padding: isMobile ? 20 : 28,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <div className="audio-icon-wrapper" style={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    width: isMobile ? 64 : 80,
                    height: isMobile ? 64 : 80,
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: isMobile ? 16 : 20,
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <SoundOutlined className="audio-icon-svg" style={{ fontSize: isMobile ? 28 : 36, color: '#667eea', transition: 'all 0.4s ease' }} />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      opacity: 0,
                      transition: 'opacity 0.3s'
                    }} className="audio-icon-overlay" />
                  </div>

                  <Title
                    level={5}
                    style={{
                      textAlign: 'center',
                      marginBottom: isMobile ? 4 : 8,
                      fontSize: isMobile ? 14 : 16,
                      fontWeight: 600,
                      color: '#333'
                    }}
                  >
                    {audio.title}
                  </Title>

                  <div style={{ textAlign: 'center' }}>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: isMobile ? 11 : 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <PlayCircleOutlined style={{ fontSize: 12 }} />
                      {audio.questions} questions
                    </Text>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      <style>{`
        .audio-card-modern:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15) !important;
          background: rgba(255, 255, 255, 0.9) !important;
          border-color: #667eea !important;
        }

        .audio-card-modern:hover .audio-icon-wrapper {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          transform: scale(1.05);
          box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4) !important;
        }

        .audio-card-modern:hover .audio-icon-svg {
          color: #fff !important;
        }

        .audio-card-modern:hover .audio-icon-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </Content>
  )
}

export default Listening
