import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Typography, Card, message } from 'antd';
import { User, Lock, Mail, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const { Title, Text } = Typography;

const Login = () => {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Reset password states
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { setIsLoggedIn } = useApp();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      message.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@example.com' && password === '123456') {
        setIsLoggedIn(true);
        message.success('Đăng nhập thành công!');
        navigate('/dashboard');
      } else {
        message.error('Sai email hoặc mật khẩu!');
      }
      setLoading(false);
    }, 1000);
  };

  const handleResetPassword = async () => {
    if (!token || !newPassword) {
      message.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      message.success('Đặt lại mật khẩu thành công!');
      setMode('login');
      setToken('');
      setNewPassword('');
      setLoading(false);
    }, 1000);
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundShapes = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '420px',
    padding: '40px 30px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    zIndex: 1
  };

  const titleStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
    fontWeight: '600',
    fontSize: '28px'
  };

  const inputStyle = {
    height: '50px',
    borderRadius: '12px',
    border: '2px solid #e8e8e8',
    marginBottom: '20px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    paddingLeft: '50px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    height: '50px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    color: 'white',
    width: '100%'
  };

  const linkButtonStyle = {
    color: '#667eea',
    fontWeight: '500',
    padding: '0',
    height: 'auto',
    display: 'block',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      {/* Background decorative shapes */}
      <div style={backgroundShapes}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
      </div>

      <div style={cardStyle}>
        {mode === 'login' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}>
                <User size={32} color="white" />
              </div>
              <h2 style={titleStyle}>
                Chào mừng trở lại
              </h2>
              <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
                Đăng nhập để tiếp tục
              </p>
            </div>

            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <Mail size={20} style={{ 
                    position: 'absolute', 
                    left: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#667eea',
                    zIndex: 1
                  }} />
                  <input
                    type="email"
                    placeholder="Nhập địa chỉ email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    style={inputStyle}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{ 
                    position: 'absolute', 
                    left: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#667eea',
                    zIndex: 1
                  }} />
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <button 
                  onClick={handleLogin} 
                  disabled={loading}
                  className="gradient-button"
                  style={{
                    ...buttonStyle,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 0 }}>
                <button 
                  onClick={() => setMode('resetPassword')}
                  className="link-button"
                  style={linkButtonStyle}
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div>
          </>
        )}

        {mode === 'resetPassword' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}>
                <Shield size={32} color="white" />
              </div>
              <h2 style={titleStyle}>
                Đặt lại mật khẩu
              </h2>
              <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
                Nhập token và mật khẩu mới
              </p>
            </div>

            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <Shield size={20} style={{ 
                    position: 'absolute', 
                    left: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#667eea',
                    zIndex: 1
                  }} />
                  <input
                    type="text"
                    placeholder="Nhập token xác thực" 
                    value={token} 
                    onChange={e => setToken(e.target.value)} 
                    style={inputStyle}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{ 
                    position: 'absolute', 
                    left: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#667eea',
                    zIndex: 1
                  }} />
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <button 
                  onClick={handleResetPassword} 
                  disabled={loading}
                  className="gradient-button"
                  style={{
                    ...buttonStyle,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 0 }}>
                <button 
                  onClick={() => setMode('login')}
                  className="link-button"
                  style={linkButtonStyle}
                >
                  ← Quay lại đăng nhập
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        input:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
          outline: none;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        .gradient-button:hover:not(:disabled) {
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5) !important;
        }
        
        .link-button:hover {
          color: #764ba2 !important;
        }
      `}</style>
        
    </div>
  );
};

export default Login;