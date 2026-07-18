import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./index.module.scss";

const API_URL = "http://localhost:3300";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Parollar uyğun gəlmir");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/register`, {
        userName: form.userName,
        password: form.password,
      });
      toast.success("Qeydiyyat uğurla tamamlandı! İndi daxil olun.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Qeydiyyat zamanı xəta baş verdi";
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

        <h1>Hesab yaradın</h1>
        <p>Kitabları rezerv etmək üçün qeydiyyatdan keçin.</p>

        <form onSubmit={handleSubmit}>
          <label>
            İstifadəçi adı
            <input
              type="text"
              name="userName"
              placeholder="İstifadəçi adınızı seçin"
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
              placeholder="Ən azı 6 simvol"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </label>

          <label>
            Parolu təkrarla
            <input
              type="password"
              name="confirmPassword"
              placeholder="Parolu yenidən daxil edin"
              value={form.confirmPassword}
              onChange={handleChange}
              minLength={6}
              required
            />
          </label>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Qeydiyyat gedir..." : "Qeydiyyatdan keç"}
          </button>
        </form>

        <p className={styles.switchText}>
          Artıq hesabınız var? <Link to="/login">Daxil olun</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;