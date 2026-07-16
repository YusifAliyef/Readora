import React, { useState } from "react";
import styles from "./index.module.scss";

const infoItems = [
  {
    title: "E-poçt",
    value: "info@readora.az",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
  {
    title: "Telefon",
    value: "+994 12 345 67 89",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M4 5c0 8.3 6.7 15 15 15l3-4-6-3-2 2c-2.2-1-4-2.8-5-5l2-2-3-6Z" />
      </svg>
    ),
  },
  {
    title: "Ünvan",
    value: "Nizami küç. 203, Bakı",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    title: "İş saatları",
    value: "B.e – Ş: 09:00 – 19:00",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    ),
  },
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.ambient} aria-hidden="true">
        <div className={styles.glowGold} />
        <div className={styles.glowEmerald} />
        <div className={styles.dotGrid} />
      </div>

      <div className={styles.wrap}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Bizimlə Əlaqə</span>
          <h1>
            Sualınız var? <span>Yazın bizə</span>
          </h1>
          <p>
            Kitab, rezervasiya və ya üzvlük ilə bağlı hər hansı sualınız varsa,
            komandamız sizə kömək etməyə hazırdır.
          </p>
        </section>

        <section className={styles.contentGrid}>
          <form className={styles.formCard} onSubmit={handleSubmit}>
            <span className={styles.chapter}>Fəsil I — Mesaj Yazın</span>
            <h2>Bizə mesaj göndərin</h2>

            <label>
              Ad Soyad
              <input
                type="text"
                name="name"
                placeholder="Adınızı daxil edin"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              E-poçt
              <input
                type="email"
                name="email"
                placeholder="E-poçt ünvanınız"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Mesaj
              <textarea
                name="message"
                rows={5}
                placeholder="Sualınızı bura yazın..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className={styles.submitBtn}>
              Göndər
            </button>

            {sent && (
              <p className={styles.successMsg}>
                ✓ Mesajınız göndərildi, tezliklə cavab veriləcək.
              </p>
            )}
          </form>

          <div className={styles.infoCol}>
            <span className={styles.chapter}>Fəsil II — Bizi Tapın</span>
            <h2>Əlaqə məlumatları</h2>

            <div className={styles.infoList}>
              {infoItems.map((item, i) => (
                <div className={styles.infoItem} key={i}>
                  <span className={styles.infoIcon}>{item.icon}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.mapCard}>
              <svg
                className={styles.bookWatermark}
                viewBox="0 0 200 200"
                aria-hidden="true"
              >
                <path
                  d="M100 20 L20 45 V170 L100 150 L180 170 V45 Z"
                  fill="none"
                  stroke="#c8a24d"
                  strokeWidth="1.4"
                />
                <path d="M100 20 V150" stroke="#c8a24d" strokeWidth="1.4" />
              </svg>
              <p>
                Bakı, Nizami rayonu — mərkəzi kitabxana filialımıza baş çəkin.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;
