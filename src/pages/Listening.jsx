import React, { useState, useEffect } from 'react'
import { Layout, Typography, Card, Row, Col, Button } from 'antd'
import { SoundOutlined, ArrowLeftOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'

const { Content } = Layout
const { Title, Text } = Typography

const audioList = [
  { id: 'audio1', title: 'Audio 1', questions: 43 },
  { id: 'audio2', title: 'Audio 2', questions: 47 },
  { id: 'audio3', title: 'Audio 3', questions: 38 },
  { id: 'audio4', title: 'Audio 4', questions: 46 },
  { id: 'audio5', title: 'Audio 5', questions: 41 },
  { id: 'audio6', title: 'Audio 6', questions: 41 },
  { id: 'audio9', title: 'Audio 9', questions: 43 },
  { id: 'audio13', title: 'Audio 13', questions: 54 },
  { id: 'audio17', title: 'Audio 17', questions: 46 }
]

function Listening() {
  const [isMobile, setIsMobile] = useState(false)
  const [animated, setAnimated] = useState(false)
  const navigate = useNavigate()

  // Detect mobile viewport
  useEffect(() => {
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
        background: 'linear-gradient(180deg, #f8fafc 0%, #f0f4f8 100%)'
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
          marginBottom: isMobile ? 24 : 32,
          opacity: animated ? 1 : 0,
          transform: animated ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isMobile ? 56 : 64,
            height: isMobile ? 56 : 64,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            marginBottom: 16,
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
          }}>
            <SoundOutlined style={{ fontSize: isMobile ? 24 : 32, color: '#fff' }} />
          </div>

          <Title
            level={3}
            style={{
              marginBottom: 8,
              fontSize: isMobile ? 22 : 28,
              fontWeight: 700,
              color: '#333'
            }}
          >
            Listening Exercises
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? 13 : 15 }}>
            Choose an audio to start practicing
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
                    borderRadius: 16,
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${index * 0.08}s`
                  }}
                  bodyStyle={{
                    padding: isMobile ? 16 : 24,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <div className="audio-icon-wrapper" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    width: isMobile ? 56 : 72,
                    height: isMobile ? 56 : 72,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: isMobile ? 12 : 16,
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <SoundOutlined style={{ fontSize: isMobile ? 24 : 32, color: '#fff' }} />
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
          transform: translateY(-6px) !important;
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.3) !important;
        }

        .audio-card-modern:hover .audio-icon-wrapper {
          transform: scale(1.1);
          box-shadow: 0 8px 28px rgba(102, 126, 234, 0.5) !important;
        }

        .audio-card-modern:hover .audio-icon-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </Content>
  )
}

export default Listening
