import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "../Register/index.module.scss"; 

const API_URL = "http://localhost:3300";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.userName);
      localStorage.setItem("fullName", res.data.fullName || "");

      toast.success("Uğurla daxil oldunuz");

      if (res.data.role === "admin") {
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem(
          "adminName",
          res.data.fullName || res.data.userName,
        );
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Giriş zamanı xəta baş verdi";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.ambient} aria-hidden="true">
        <div className={styles.glowGold} />
        <div className={styles.glowEmerald} />
        <div className={styles.dotGrid} />
      </div>

      <div className={styles.card}>
        <div className={styles.brand}>
          Readora<span>.</span>
        </div>

        <h1>Xoş gəldiniz</h1>
        <p>Hesabınıza daxil olun və oxumağa davam edin.</p>

        <form onSubmit={handleSubmit}>
          <label>
            İstifadəçi adı
            <input
              type="text"
              name="userName"
              placeholder="İstifadəçi adınız"
              value={form.userName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Parol
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Yoxlanılır..." : "Daxil ol"}
          </button>
        </form>

        <p className={styles.switchText}>
          Hesabınız yoxdur? <Link to="/register">Qeydiyyatdan keçin</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
