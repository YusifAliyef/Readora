import React from "react";
import styles from "./index.module.scss";

const values = [
  {
    chapter: "Fəsil I",
    title: "Əlçatanlıq",
    text: "Hər kəs üçün kitab oxumağı sadə, sürətli və maneəsiz edirik.",
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M12 3 3 8v3c0 6 4 9.5 9 10 5-.5 9-4 9-10V8Z" />
      </svg>
    ),
  },
  {
    chapter: "Fəsil II",
    title: "Etibarlılıq",
    text: "Rezervasiya etdiyiniz kitab yalnız sizin üçün ayrılır, söz veririk.",
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M9 12.5 11 15l4-5" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    chapter: "Fəsil III",
    title: "İcma",
    text: "Oxucuları bir araya gətirən, fikir mübadiləsi edən bir platforma qururuq.",
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="8" cy="9" r="3" />
        <circle cx="16" cy="9" r="3" />
        <path d="M2 20c0-3.3 2.7-5 6-5s6 1.7 6 5M10 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
      </svg>
    ),
  },
];

const timeline = [
  {
    year: "2022",
    title: "Fikir doğulur",
    text: "Readora ideyası kiçik bir universitet layihəsi kimi başladı.",
  },
  {
    year: "2023",
    title: "İlk 1000 kitab",
    text: "Kolleksiyamız genişləndi, ilk rezervasiya sistemi işə düşdü.",
  },
  {
    year: "2024",
    title: "12K+ oxucu",
    text: "Minlərlə oxucu Readora vasitəsilə sevimli kitablarını tapdı.",
  },
  {
    year: "2025",
    title: "Premium üzvlük",
    text: "Fərdiləşdirilmiş profil və prioritet rezervasiya imkanları əlavə olundu.",
  },
];

function About() {
  return (
    <div className={styles.page}>
      <div className={styles.ambient} aria-hidden="true">
        <div className={styles.glowGold} />
        <div className={styles.glowEmerald} />
        <div className={styles.dotGrid} />
      </div>

      <div className={styles.wrap}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Bizim Hekayəmiz</span>
          <h1>
            Kitabla oxucu arasında
            <br />
            <span>körpü qururuq</span>
          </h1>
          <p>
            Readora 2022-ci ildə kiçik bir ideya kimi doğuldu: kitab tapmaq və
            rezerv etmək heç vaxt bu qədər sadə olmamalı idi. Bu gün minlərlə
            oxucuya xidmət edən rəqəmsal kitabxanaya çevrildik.
          </p>

          <div className={styles.heroFloatRow}>
            <div className={`${styles.floatCard} ${styles.floatCardA}`}>
              <strong>2022</strong>
              <span>Quruluş ili</span>
            </div>
            <div className={`${styles.floatCard} ${styles.floatCardB}`}>
              <strong>12K+</strong>
              <span>Kitab</span>
            </div>
            <div className={`${styles.floatCard} ${styles.floatCardC}`}>
              <strong>8.4K</strong>
              <span>Oxucu</span>
            </div>
            <div className={`${styles.floatCard} ${styles.floatCardD}`}>
              <strong>97%</strong>
              <span>Məmnuniyyət</span>
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <span className={styles.sectionEyebrow}>Dəyərlərimiz</span>
          <h2>Bizi hərəkətə gətirən prinsiplər</h2>

          <div className={styles.grid3}>
            {values.map((v, i) => (
              <div className={styles.card} key={i}>
                <span className={styles.cardIcon}>{v.icon}</span>
                <span className={styles.chapter}>{v.chapter}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className={styles.section}>
          <span className={styles.sectionEyebrow}>Yol Xəritəsi</span>
          <h2>Hekayəmizin fəsilləri</h2>

          <div className={styles.timeline}>
            <div className={styles.timelineLine} />
            {timeline.map((t, i) => (
              <div className={styles.timelineItem} key={i}>
                <div className={styles.timelineDot} />
                <span className={styles.timelineYear}>{t.year}</span>
                <h4>{t.title}</h4>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
