import React from "react";
import { useWishlist } from "../../context/Wishlist";
import styles from "./index.module.scss";

function BookCard({ book, onReserve }) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  const imageUrl = book.image?.startsWith("http")
    ? book.image
    : `${import.meta.env.VITE_API_URL.replace("/api", "")}${book.image}`;

  const getStatusClass = (status) => {
    const s = status?.toLowerCase();
    if (s === "mövcud deyil" || s === "icarədədir" || s === "busy") {
      return styles.busy;
    }
    return styles.available;
  };

  const bookId = book._id || book.id;
  const active = isInWishlist(bookId);

  const handleWishlistClick = async(e) => {
    e.stopPropagation();
      await toggleWishlist(book);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <button
          className={`${styles.wishlistBtn} ${active ? styles.wishlistBtnActive : ""}`}
          onClick={handleWishlistClick}
          aria-label="İstək siyahısına əlavə et"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={active ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 20.5s-7.5-4.6-10-9.3C.6 8 2 4.5 5.4 4c2.2-.3 4.1 1 5.6 3 1.5-2 3.4-3.3 5.6-3C20 4.5 21.4 8 20 11.2c-2.5 4.7-8 9.3-8 9.3Z" />
          </svg>
        </button>

        <img
          src={
            book.image
              ? imageUrl
              : "https://via.placeholder.com/200x300?text=Readora"
          }
          alt={book.title}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200x300?text=Readora";
          }}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{book.author}</p>

          <span
            className={`${styles.statusBadge} ${getStatusClass(book.status)}`}
          >
            {book.status || "Mövcuddur"}
          </span>
        </div>

        <p className={styles.description}>
          {book.description || "Bu kitabın qısa təsviri hələ daxil edilməyib."}
        </p>

        <div className={styles.footerRow}>
          <button className={styles.reserveBtn} onClick={() => onReserve(book)}>
            Rezervasiya Et
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
