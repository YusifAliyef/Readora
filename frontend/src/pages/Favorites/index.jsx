import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/Wishlist";
import styles from "./index.module.scss";

function Favorites() {
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <p>İstək siyahınız yüklənir...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Bəyəndiklərim</span>
        <h2>İstək Siyahınız</h2>
        <p>
          Bəyəndiyiniz kitabları burada saxlayın, sonra rezervasiya edə
          bilərsiniz.
        </p>
      </header>

      {wishlist.length > 0 ? (
        <div className={styles.grid}>
          {wishlist.map((item) => {
            const book = item.book;
            return (
              <div className={styles.card} key={item._id}>
                <div className={styles.imageWrapper}>
                  <button
                    className={styles.removeBtn}
                    onClick={() => toggleWishlist(book)}
                    aria-label="Sil"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                  <img
                    src={
                      book?.image ||
                      "https://via.placeholder.com/200x300?text=Readora"
                    }
                    alt={book?.title}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3>{book?.title}</h3>
                  <p className={styles.author}>{book?.author}</p>
                  <p className={styles.description}>
                    {book?.description
                      ? `${book.description.substring(0, 80)}...`
                      : "Açıqlama mövcud deyil."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M12 20.5s-7.5-4.6-10-9.3C.6 8 2 4.5 5.4 4c2.2-.3 4.1 1 5.6 3 1.5-2 3.4-3.3 5.6-3C20 4.5 21.4 8 20 11.2c-2.5 4.7-8 9.3-8 9.3Z" />
            </svg>
          </div>
          <p>Hələ ki, istək siyahınız boşdur.</p>
          <button
            className={styles.browseBtn}
            onClick={() => navigate("/books")}
          >
            Kolleksiyaya Bax
          </button>
        </div>
      )}
    </div>
  );
}

export default Favorites;
