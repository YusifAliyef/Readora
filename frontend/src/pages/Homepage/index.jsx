import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const shelf = [
  { h: 78, c: "#7c2d3a" },
  { h: 92, c: "#0f3d3a" },
  { h: 65, c: "#c8a24d" },
  { h: 88, c: "#14110f" },
  { h: 70, c: "#0f3d3a" },
  { h: 95, c: "#7c2d3a" },
  { h: 60, c: "#c8a24d" },
  { h: 84, c: "#14110f" },
  { h: 72, c: "#7c2d3a" },
  { h: 90, c: "#0f3d3a" },
];

const genres = [
  "Roman",
  "Poeziya",
  "Fantastika",
  "Tarix",
  "Fəlsəfə",
  "Detektiv",
  "Psixologiya",
  "Klassika",
  "Uşaq Ədəbiyyatı",
  "Biznes",
  "Elmi-Populyar",
];

const cardIcons = {
  clock: (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  archive: (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3" y="4" width="18" height="5" rx="1.2" />
      <path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
      <path d="M10 13h4" />
    </svg>
  ),
  crown: (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M4 17 2.5 8l5 4 4.5-7 4.5 7 5-4L20 17Z" />
      <path d="M4 20h16" />
    </svg>
  ),
};

function Homepage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.ambient} aria-hidden="true">
        <div className={styles.glowGold} />
        <div className={styles.glowEmerald} />
        <div className={styles.dotGrid} />
      </div>

      <div className={styles.homepage}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>Rəqəmsal Kitabxana</span>
            <h1>
              Hər kitabın <span>öz səhifəsi</span>
              <br />
              sizi gözləyir
            </h1>
            <p>
              Klassik və müasir ədəbiyyatın ən zəngin kolleksiyası artıq bir
              klik uzağınızda. Premium rezervasiya sistemi ilə kitabları öz
              adınıza təmin edin.
            </p>
            <div className={styles.heroActions}>
              <button
                className={styles.ctaBtn}
                onClick={() => navigate("/books")}
              >
                Kolleksiyaya Bax
              </button>
              <button
                className={styles.ghostBtn}
                onClick={() => navigate("/about")}
              >
                Necə işləyir?
              </button>
            </div>
          </div>

          <div className={styles.heroArt}>
            <div className={styles.blobBehind} aria-hidden="true" />

            <div className={styles.shelfWrap}>
              <div className={styles.spines}>
                {shelf.map((b, i) => (
                  <div
                    key={i}
                    className={
                      i === 3
                        ? `${styles.spine} ${styles.spineOut}`
                        : styles.spine
                    }
                    style={{
                      height: `${b.h}%`,
                      background: b.c,
                      animationDelay: `${i * 0.06}s`,
                    }}
                  />
                ))}
              </div>
              <div className={styles.shelfBoard} />
            </div>

            <div className={`${styles.floatCard} ${styles.floatCardTop}`}>
              <span className={styles.floatIcon}>★</span>
              <div>
                <strong>4.9</strong>
                <span>Oxucu reytinqi</span>
              </div>
            </div>

            <div className={`${styles.floatCard} ${styles.floatCardBottom}`}>
              <span className={styles.floatDotLive} />
              <div>
                <strong>Onlayn</strong>
                <span>Anında rezervasiya</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.statsBar}>
          <div>
            <strong>12K+</strong>
            <span>Kitab</span>
          </div>
          <div className={styles.divider} />
          <div>
            <strong>8.4K</strong>
            <span>Oxucu</span>
          </div>
          <div className={styles.divider} />
          <div>
            <strong>97%</strong>
            <span>Məmnuniyyət</span>
          </div>
          <div className={styles.divider} />
          <div>
            <strong>24/7</strong>
            <span>Dəstək</span>
          </div>
        </section>

        <div className={styles.marquee}>
          <div className={styles.marqueeTrack}>
            {[...genres, ...genres].map((g, i) => (
              <span key={i} className={styles.chip}>
                {g}
              </span>
            ))}
          </div>
        </div>

        <section className={styles.features}>
          <div className={styles.card}>
            <span className={styles.cardIcon}>{cardIcons.clock}</span>
            <span className={styles.chapter}>Fəsil I</span>
            <h3>Sürətli Rezervasiya</h3>
            <p>Növbə gözləmədən, rəqəmsal sistemimizlə dərhal seçim edin.</p>
          </div>
          <div className={styles.card}>
            <span className={styles.cardIcon}>{cardIcons.archive}</span>
            <span className={styles.chapter}>Fəsil II</span>
            <h3>Zəngin Arxiv</h3>
            <p>Minlərlə kitab, peşəkar təsnifat və asan axtarış imkanı.</p>
          </div>
          <div className={styles.card}>
            <span className={styles.cardIcon}>{cardIcons.crown}</span>
            <span className={styles.chapter}>Fəsil III</span>
            <h3>Premium Üzvlük</h3>
            <p>Oxucu profiliniz vasitəsilə rezervasiyalarınızı idarə edin.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Homepage;
