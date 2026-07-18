import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./index.module.scss";

const API_URL = "http://localhost:3300";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Statistika yüklənərkən xəta:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Ümumi Kitab",
      value: stats?.totalBooks ?? "-",
      color: "#0f3d3a",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M4 5c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v16l-7-3-7 3V5Z" />
        </svg>
      ),
    },
    {
      label: "Ümumi İstifadəçi",
      value: stats?.totalUsers ?? "-",
      color: "#c8a24d",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
        </svg>
      ),
    },
    {
      label: "Gözləyən Rezervasiya",
      value: stats?.pendingReservations ?? "-",
      color: "#7c2d3a",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />
        </svg>
      ),
    },
    {
      label: "Aktiv İcarə",
      value: stats?.activeLoans ?? "-",
      color: "#14110f",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>İdarəetmə Paneli</span>
        <h1>Ümumi Baxış</h1>
      </div>

      <div className={styles.grid}>
        {cards.map((c, i) => (
          <div className={styles.card} key={i} style={{ borderTopColor: c.color }}>
            <span className={styles.cardIcon} style={{ background: `${c.color}1a`, color: c.color }}>
              {c.icon}
            </span>
            <strong>{loading ? "…" : c.value}</strong>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;