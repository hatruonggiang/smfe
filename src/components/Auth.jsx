import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, message } from 'antd';
import { User, Lock, Mail, Shield, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiRequest } from '../services/api';

const { Title, Text } = Typography;

const Auth = () => {
  const [mode, setMode] = useState('login'); // login | register | forgot | reset
  const [loading, setLoading] = useState(false);

  // common states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // register
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');

  // reset password
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { setIsLoggedIn } = useApp();
  const navigate = useNavigate();

  // Hàm xử lý đăng nhập
  const handleLogin = async () => {
    if (!email || !password) {
      message.error('Vui lòng nhập email và mật khẩu!');
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        useAuth: false,
      });
      const accessToken = res.data;
      localStorage.setItem('token', accessToken);
      setIsLoggedIn(true);
      message.success('Đăng nhập thành công!');
      setTimeout(() => navigate('/dashboard'), 200);
    } catch (err) {
      message.error('Sai email hoặc mật khẩu!');
    }
    setLoading(false);
  };

  // Hàm xử lý đăng ký
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !userName || !phone) {
      message.error('Vui lòng nhập đầy đủ thông tin đăng ký!');
      return;
    }
    if (password !== confirmPassword) {
      message.error('Mật khẩu không khớp!');
      return;
    }
    setLoading(true);
    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, confirmPassword, userName, phone }),
        useAuth: false,
      });
      message.success('Đăng ký thành công! Hãy đăng nhập.');
      setMode('login');
    } catch (err) {
      message.error(err.message || 'Đăng ký thất bại, vui lòng thử lại.');
    }
    setLoading(false);
  };

  // Quên mật khẩu - gửi email
  const handleForgot = async () => {
    if (!email) {
      message.error('Vui lòng nhập email để khôi phục mật khẩu!');
      return;
    }
    setLoading(true);
    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        useAuth: false,
      });
      message.success('Email khôi phục đã được gửi. Kiểm tra hộp thư của bạn.');
      setMode('login');
    } catch (err) {
      message.error(err.message || 'Gửi email khôi phục thất bại.');
    }
    setLoading(false);
  };

  // Đặt lại mật khẩu bằng token
  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) {
      message.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    setLoading(true);
    try {
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: resetToken, newPassword }),
        useAuth: false,
      });
      message.success('Đặt lại mật khẩu thành công!');
      setMode('login');
    } catch (err) {
      message.error(err.message || 'Đặt lại mật khẩu thất bại.');
    }
    setLoading(false);
  };

  // Các style giống với Login.jsx của bạn (đã rút gọn cho dễ nhìn)
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f0f0 0%, #d9d9d9 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  };
  

  const backgroundShapes = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0,
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '420px',
    padding: '40px 30px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(200, 200, 200, 0.5)',
    position: 'relative',
    zIndex: 1,
  };
  

  const titleStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#111',
    fontWeight: '600',
    fontSize: '28px',
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
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    height: '50px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '20px',
    background: '#333',
    border: 'none',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    color: 'white',
    width: '100%',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
  };
  

  const linkButtonStyle = {
    color: '#333',
    fontWeight: '500',
    padding: '0',
    height: 'auto',
    display: 'block',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  };
  

  // Biểu diễn từng form theo mode
  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: '#444',

                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',

                }}
              >
                <User size={32} color="white" />
              </div>
              <h2 style={titleStyle}>Chào mừng trở lại</h2>
              <p style={{ color: '#555', fontSize: '16px', margin: 0 }}>
Đăng nhập để tiếp tục</p>
            </div>

            <div>
              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Mail
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '##444',
                    zIndex: 1,
                  }}
                />
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  disabled={loading}
                />
              </div>

              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Lock
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '##444',
                    zIndex: 1,
                  }}
                />
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  disabled={loading}
                />
              </div>

              <button style={buttonStyle} onClick={handleLogin} disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button style={linkButtonStyle} onClick={() => setMode('register')}>
                  Đăng ký
                </button>
                <button style={{ ...linkButtonStyle, marginTop: 8 }} onClick={() => setMode('forgot')}>
                  Quên mật khẩu?
                </button>
              </div>
            </div>
          </>
        );
      case 'register':
        return (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: '#444',

                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                }}
              >
                <User size={32} color="white" />
              </div>
              <h2 style={titleStyle}>Đăng ký tài khoản</h2>
              <p style={{ color: '#555', fontSize: '16px', margin: 0 }}>
Tạo tài khoản mới</p>
            </div>

            <div>
              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <User
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '##444',
                    zIndex: 1,
                  }}
                />
                <input
                  placeholder="Họ tên"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={inputStyle}
                  disabled={loading}
                />
              </div>

              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Phone
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '##444',
                    zIndex: 1,
                  }}
                />
                <input
                  placeholder="Số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                  disabled={loading}
                />
              </div>

              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Mail
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '##444',
                    zIndex: 1,
                  }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  disabled={loading}
                />
              </div>

              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Lock
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '##444',
                    zIndex: 1,
                  }}
                />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  disabled={loading}
                />
              </div>

              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Lock
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '##444',
                    zIndex: 1,
                  }}
                />
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                  disabled={loading}
                />
              </div>

              <button style={buttonStyle} onClick={handleRegister} disabled={loading}>
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button style={linkButtonStyle} onClick={() => setMode('login')}>
                  Quay lại đăng nhập
                </button>
              </div>
            </div>
          </>
        );
      case 'forgot':
        return (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: '#444',

                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                }}
              >
                <Mail size={32} color="white" />
              </div>
              <h2 style={titleStyle}>Quên mật khẩu</h2>
              <p style={{ color: '#555', fontSize: '16px', margin: 0 }}>
Nhập email để lấy lại mật khẩu</p>
            </div>

            <div>
              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Mail
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '##444',
                    zIndex: 1,
                  }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  disabled={loading}
                />
              </div>

              <button style={buttonStyle} onClick={handleForgot} disabled={loading}>
                {loading ? 'Đang gửi...' : 'Gửi email khôi phục'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button style={linkButtonStyle} onClick={() => setMode('login')}>
                  Quay lại đăng nhập
                </button>
                <button style={{ ...linkButtonStyle, marginTop: 8 }} onClick={() => setMode('reset')}>
                  Tôi đã có token, đặt lại mật khẩu
                </button>
              </div>
            </div>
          </>
        );
      case 'reset':
        return (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: '#444',

                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                }}
              >
                <Shield size={32} color="white" />
              </div>
              <h2 style={titleStyle}>Đặt lại mật khẩu</h2>
              <p style={{ color: '#555', fontSize: '16px', margin: 0 }}>

                Nhập token và mật khẩu mới của bạn
              </p>
            </div>

            <div>
              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Shield
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '##444',
                    zIndex: 1,
                  }}
                />
                <input
                  placeholder="Token"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  style={inputStyle}
                  disabled={loading}
                />
              </div>

              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Lock
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '##444',
                    zIndex: 1,
                  }}
                />
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputStyle}
                  disabled={loading}
                />
              </div>

              <button style={buttonStyle} onClick={handleResetPassword} disabled={loading}>
                {loading ? 'Đang xác nhận...' : 'Xác nhận'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button style={linkButtonStyle} onClick={() => setMode('login')}>
                  Quay lại đăng nhập
                </button>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      {/* Background shapes, nếu muốn bạn có thể thêm hiệu ứng bằng CSS hoặc SVG */}
      <div style={backgroundShapes}></div>

      <div style={cardStyle}>{renderForm()}</div>
    </div>
  );
};

export default Auth;
