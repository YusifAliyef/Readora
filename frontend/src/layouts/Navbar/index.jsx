import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/Wishlist";
import styles from "./index.module.scss";

function Navbar() {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => navigate("/")}>
          Readora<span>.</span>
        </div>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Ana Səhifə</Link>
          <Link to="/about" className={styles.navLink}>Haqqımızda</Link>
          <Link to="/contact" className={styles.navLink}>Əlaqə</Link>
        </nav>

        <div className={styles.rightActions}>
          <button className={styles.wishlistBtn} onClick={() => navigate("/favorites")} aria-label="Bəyəndiklərim">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 20.5s-7.5-4.6-10-9.3C.6 8 2 4.5 5.4 4c2.2-.3 4.1 1 5.6 3 1.5-2 3.4-3.3 5.6-3C20 4.5 21.4 8 20 11.2c-2.5 4.7-8 9.3-8 9.3Z"/>
            </svg>
            {wishlist.length > 0 && (
              <span className={styles.wishlistBadge}>{wishlist.length}</span>
            )}
          </button>

          <button className={styles.reservationsBtn} onClick={() => navigate("/my-reservations")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 4h9a2 2 0 0 1 2 2v14l-6.5-3L4 20V6a2 2 0 0 1 2-2Z"/>
            </svg>
            Rezervasiyalarım
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;