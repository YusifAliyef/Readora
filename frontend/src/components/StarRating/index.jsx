import React from "react";
import styles from "./index.module.scss";

function StarRating({ value = 0, onChange, readOnly = false, size = 20 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={styles.stars}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={styles.starBtn}
          disabled={readOnly}
          onClick={() => onChange && onChange(star)}
          aria-label={`${star} ulduz`}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={star <= value ? "#c8a24d" : "none"}
            stroke={star <= value ? "#c8a24d" : "#c9c3b8"}
            strokeWidth="1.6"
          >
            <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8Z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default StarRating;