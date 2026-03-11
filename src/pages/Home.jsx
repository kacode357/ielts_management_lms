import React, { useState, useEffect } from 'react'
import { Layout, Typography, Card, Row, Col, Modal } from 'antd'
import { SoundOutlined, FileTextOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Content } = Layout
const { Title, Text } = Typography

function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [animated, setAnimated] = useState(false)

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

  const features = [
    {
      title: 'Listening',
      icon: <SoundOutlined style={{ fontSize: 48, color: '#fff' }} />,
      description: 'Practice listening comprehension with audio exercises',
      link: '/listening',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      hoverGradient: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
      color: '#667eea',
      shadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
    },
    {
      title: 'Reading',
      icon: <FileTextOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      description: 'Coming soon...',
      link: '#',
      gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
      hoverGradient: 'linear-gradient(135deg, #73d13d 0%, #237804 100%)',
      color: '#52c41a',
      shadow: '0 8px 24px rgba(82, 196, 26, 0.4)',
      disabled: true,
      onClick: () => {
        Modal.info({
          title: 'Coming Soon',
          content: 'Reading exercises will be available soon!'
        })
      }
    }
  ]

  return (
    <Content
      className="home-page"
      style={{
        padding: isMobile ? '16px' : '48px 24px',
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f0f4f8 100%)'
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Hero Section with Animation */}
        <div style={{
          textAlign: 'center',
          marginBottom: isMobile ? 32 : 48,
          opacity: animated ? 1 : 0,
          transform: animated ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isMobile ? 80 : 100,
            height: isMobile ? 80 : 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            marginBottom: 24,
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
            animation: 'float 3s ease-in-out infinite'
          }}>
            <SoundOutlined style={{ fontSize: isMobile ? 36 : 48, color: '#fff' }} />
          </div>

          <Title
            level={2}
            style={{
              marginBottom: 8,
              fontSize: isMobile ? 26 : 36,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Welcome to English Practice
          </Title>
          <Text
            type="secondary"
            style={{
              display: 'block',
              fontSize: isMobile ? 14 : 16,
              color: '#666'
            }}
          >
            Choose a category to start practicing
          </Text>
        </div>

        <Row gutter={[isMobile ? 12 : 24, isMobile ? 12 : 24]} justify="center">
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              {feature.disabled ? (
                <div
                  onClick={feature.onClick}
                  style={{
                    cursor: 'not-allowed',
                    opacity: 0.6,
                    transition: 'opacity 0.3s'
                  }}
                >
                  <Card
                    hoverable={false}
                    style={{
                      height: '100%',
                      textAlign: 'center',
                      borderRadius: 20,
                      background: '#f5f5f5',
                      border: '2px solid #e8e8e8',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                    bodyStyle={{
                      padding: isMobile ? 28 : 40,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{
                      background: '#e8e8e8',
                      width: isMobile ? 72 : 88,
                      height: isMobile ? 72 : 88,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                      opacity: 0.5
                    }}>
                      {React.cloneElement(feature.icon, { style: { ...feature.icon.props.style, opacity: 0.5 } })}
                    </div>
                    <Title
                      level={4}
                      style={{
                        marginBottom: 8,
                        fontSize: isMobile ? 18 : 20,
                        color: '#999'
                      }}
                    >
                      {feature.title}
                    </Title>
                    <Text
                      type="secondary"
                      style={{ fontSize: isMobile ? 13 : 14 }}
                    >
                      {feature.description}
                    </Text>
                  </Card>
                </div>
              ) : (
                <Link to={feature.link} style={{ textDecoration: 'none' }}>
                  <Card
                    hoverable
                    className="feature-card"
                    style={{
                      height: '100%',
                      textAlign: 'center',
                      borderRadius: 20,
                      border: 'none',
                      boxShadow: feature.shadow,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      opacity: animated ? 1 : 0,
                      transform: animated ? 'translateY(0)' : `translateY(${index * 30}px)`,
                      transitionDelay: `${index * 0.15}s`
                    }}
                    bodyStyle={{
                      padding: isMobile ? 28 : 40,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <div className="feature-icon-wrapper" style={{
                      background: feature.gradient,
                      width: isMobile ? 80 : 96,
                      height: isMobile ? 80 : 96,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                      boxShadow: feature.shadow,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                      {feature.icon}
                    </div>
                    <Title
                      level={4}
                      style={{
                        marginBottom: 8,
                        fontSize: isMobile ? 18 : 20,
                        fontWeight: 600,
                        color: '#333'
                      }}
                    >
                      {feature.title}
                    </Title>
                    <Text
                      type="secondary"
                      style={{ fontSize: isMobile ? 13 : 14 }}
                    >
                      {feature.description}
                    </Text>
                  </Card>
                </Link>
              )}
            </Col>
          ))}
        </Row>

        {/* Decorative background elements */}
        <div style={{
          position: 'fixed',
          top: '20%',
          left: '-10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        <div style={{
          position: 'fixed',
          bottom: '10%',
          right: '-5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .feature-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 16px 40px rgba(102, 126, 234, 0.5) !important;
        }

        .feature-card:hover .feature-icon-wrapper {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5) !important;
        }
      `}</style>
    </Content>
  )
}

export default Home
