import React, { useState, useEffect } from 'react'
import { Layout, Typography, Button, Drawer } from 'antd'
import { SoundOutlined, BookOutlined, MenuOutlined, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const { Header: AntHeader } = Layout
const { Title } = Typography

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
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

  // Detect scroll for desktop header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/') return 'Practice IELTS'
    if (path === '/listening') return 'Listening'
    if (path.startsWith('/listening/')) {
      return 'Exercise'
    }
    return 'Practice IELTS'
  }

  const getSubtitle = () => {
    const path = location.pathname
    if (path === '/') return null
    if (path === '/listening') return 'Choose an audio'
    if (path.startsWith('/listening/')) {
      const audioId = path.split('/').pop()
      return `Audio ${audioId.replace('audio', '')}`
    }
    return null
  }

  const handleBack = () => {
    const path = location.pathname
    if (path.startsWith('/listening/')) {
      navigate('/listening')
    } else {
      navigate('/')
    }
  }

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
      onClick: () => {
        navigate('/')
        setMobileMenuOpen(false)
      }
    },
    {
      key: '/listening',
      icon: <SoundOutlined />,
      label: 'Listening',
      onClick: () => {
        navigate('/listening')
        setMobileMenuOpen(false)
      }
    }
  ]

  // Desktop Header
  if (!isMobile) {
    return (
      <AntHeader
        className="site-header"
        style={{
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : '#fff',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'all 0.3s ease'
        }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img 
            src="/Gemini_Generated_Image_8bu6ie8bu6ie8bu6.png" 
            alt="Logo" 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '12px', 
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }} 
          />
          <Title level={4} style={{ margin: 0, color: '#333', fontWeight: 600 }}>Practice IELTS</Title>
        </Link>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', height: '100%' }}>
          <Link
            to="/listening"
            style={{
              color: location.pathname.startsWith('/listening') ? '#667eea' : '#666',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 10,
              background: location.pathname.startsWith('/listening') ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
              transition: 'all 0.2s ease',
              fontSize: 14,
              fontWeight: location.pathname.startsWith('/listening') ? 500 : 400,
              height: 40
            }}
          >
            <BookOutlined style={{ fontSize: 16 }} />
            Listening
          </Link>
        </div>
      </AntHeader>
    )
  }

  // Mobile Header with Modern Gradient
  return (
    <>
      <div
        className="mobile-main-header"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '0 12px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 12,
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        {/* Back Button - Modern Style */}
        <button
          onClick={handleBack}
          className="mobile-back-btn"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: 10,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            backdropFilter: 'blur(4px)'
          }}
        >
          <ArrowLeftOutlined style={{ color: '#fff', fontSize: 16 }} />
        </button>

        {/* Title Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              margin: 0,
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block'
            }}
          >
            {getPageTitle()}
          </span>
          {getSubtitle() && (
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11,
                display: 'block',
                marginTop: 2
              }}
            >
              {getSubtitle()}
            </span>
          )}
        </div>

        {/* Menu Button - Modern Style */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="mobile-menu-btn-header"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: 10,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            backdropFilter: 'blur(4px)'
          }}
        >
          <MenuOutlined style={{ color: '#fff', fontSize: 16 }} />
        </button>
      </div>

      {/* Mobile Navigation Drawer - Modern Style */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img 
              src="/Gemini_Generated_Image_8bu6ie8bu6ie8bu6.png" 
              alt="Logo" 
              style={{ width: 36, height: 36, borderRadius: '10px', objectFit: 'cover' }} 
            />
            <span style={{ fontWeight: 600, fontSize: 16 }}>Menu</span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={300}
        styles={{
          header: {
            background: '#fff',
            borderBottom: '1px solid #f0f0f0'
          },
          body: {
            background: '#fff',
            padding: '16px'
          }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {menuItems.map(item => (
            <Button
              key={item.key}
              type={location.pathname === item.key ||
                (item.key === '/listening' && location.pathname.startsWith('/listening'))
                ? 'primary' : 'default'}
              icon={item.icon}
              onClick={item.onClick}
              style={{
                width: '100%',
                textAlign: 'left',
                justifyContent: 'flex-start',
                height: 52,
                fontSize: 15,
                borderRadius: 12,
                background: location.pathname === item.key ||
                  (item.key === '/listening' && location.pathname.startsWith('/listening'))
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
                border: location.pathname === item.key ||
                  (item.key === '/listening' && location.pathname.startsWith('/listening'))
                  ? 'none' : undefined
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </Drawer>
    </>
  )
}

export default Header
