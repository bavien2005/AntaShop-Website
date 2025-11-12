import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts";
import mockAuthService from "../services/authService";
import "./AuthForm.css";

export default function AuthForm({ type }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (type === "register") {
        const result = await mockAuthService.register(formData);
        alert(result.message);
        navigate("/login");
      } else {
        const result = await mockAuthService.login({
          username: formData.username,
          password: formData.password
        });

        login(result.token);

        if (result.user.role === "ADMIN") {
          alert("Đăng nhập thành công! Chào mừng Admin!");
          navigate("/admin");
        } else {
          alert("Đăng nhập thành công!");
          navigate("/account");
        }
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{type === "register" ? "Đăng Ký" : "Đăng Nhập"}</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {type === "register" && (
          <>
            <div className="form-field">
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                disabled={loading}
              />
              <small className="field-hint">Tối thiểu 3 ký tự</small>
            </div>
            <div className="form-field">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </>
        )}

        {type === "login" && (
          <div className="form-field">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        )}

        <div className="form-field">
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            disabled={loading}
          />
          <small className="field-hint">Tối thiểu 6 ký tự</small>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Đang xử lý..." : (type === "register" ? "Đăng Ký" : "Đăng Nhập")}
        </button>

        {type === "login" && (
          <p className="form-footer-text">
            <Link to="/forgot-password" className="link-text">Quên mật khẩu?</Link>
          </p>
        )}

        <p className="form-footer-text">
          {type === "register" ? (
            <>
              Đã có tài khoản? <Link to="/login" className="link-text">Đăng nhập</Link>
            </>
          ) : (
            <>
              Chưa có tài khoản? <Link to="/register" className="link-text">Đăng ký</Link>
            </>
          )}
        </p>

        {type === "login" && (
          <div className="test-accounts">
            <p className="test-title">Tài khoản test:</p>
            <small>👤 User: <strong>user</strong> / <strong>123456</strong></small>
            <small>👨‍💼 Admin: <strong>admin</strong> / <strong>abc123!@#</strong></small>
          </div>
        )}
      </form>
    </div>
  );
}
