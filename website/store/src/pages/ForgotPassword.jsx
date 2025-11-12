import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header as Headers, Footer } from "../components";
import "./AuthPage.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("email");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage(`Mã xác nhận đã được gửi đến ${email}. Vui lòng kiểm tra email của bạn.`);
      setStep("verify");
    } catch (err) {
      setError("Không thể gửi mã xác nhận. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!code || code.length < 6) {
      setError("Vui lòng nhập mã xác nhận hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem("resetEmail", email);
      setMessage("Xác minh thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/reset-password"), 1500);
    } catch (err) {
      setError("Mã xác nhận không đúng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Headers />
      
      <div className="breadcrumbs">
        <div className="container">
          <span className="breadcrumb-link" onClick={() => navigate('/home')}>Trang chủ</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-link" onClick={() => navigate('/login')}>Đăng nhập</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Quên mật khẩu</span>
        </div>
      </div>

      <div className="auth-content">
        <div className="container">
          <div className="auth-form-container">
            <div className="auth-form">
              <h1 className="auth-title">QUÊN MẬT KHẨU</h1>
              
              <div className="auth-switch">
                <span>Đã nhớ mật khẩu? </span>
                <Link to="/login" className="auth-link">Đăng nhập ngay</Link>
              </div>

              {step === "email" && (
                <form onSubmit={handleSendCode} className="forgot-password-form">
                  <p className="form-description">
                    Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.
                  </p>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Nhập địa chỉ email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={error ? 'error' : ''}
                      disabled={isLoading}
                    />
                    {error && <span className="error-message">{error}</span>}
                  </div>

                  {message && (
                    <div className="success-message">
                      {message}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="auth-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang gửi...' : 'Gửi Mã Xác Nhận'}
                  </button>
                </form>
              )}

              {step === "verify" && (
                <form onSubmit={handleVerifyCode} className="verify-code-form">
                  <p className="form-description">
                    Mã xác nhận đã được gửi đến <strong>{email}</strong>. 
                    Vui lòng kiểm tra email và nhập mã xác nhận bên dưới.
                  </p>

                  <div className="form-group">
                    <label htmlFor="code">Mã xác nhận *</label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      placeholder="Nhập mã 6 số"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className={error ? 'error' : ''}
                      maxLength="6"
                      disabled={isLoading}
                    />
                    {error && <span className="error-message">{error}</span>}
                  </div>

                  {message && (
                    <div className="success-message">
                      {message}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="auth-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xác minh...' : 'Xác Nhận'}
                  </button>

                  <div className="form-options">
                    <button
                      type="button"
                      className="resend-code-btn"
                      onClick={() => setStep("email")}
                      disabled={isLoading}
                    >
                      Gửi lại mã
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
