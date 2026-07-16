import React from 'react';
import styles from "./index.module.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p>&copy; 2026 Readora. Bütün hüquqlar qorunur.</p>
      </div>
    </footer>
  );
}

export default Footer;