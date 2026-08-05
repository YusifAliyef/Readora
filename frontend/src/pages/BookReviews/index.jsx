import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import StarRating from "../../components/StarRating";
import styles from "./index.module.scss";

const API_URL = "http://localhost:3300";

function BookReviews() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookRes, reviewsRes] = await Promise.all([
        axios.get(`${API_URL}/books/${bookId}`),
        axios.get(`${API_URL}/reviews/book/${bookId}`),
      ]);
      setBook(bookRes.data);
      setReviews(reviewsRes.data || []);
    } catch (err) {
      console.error("Yüklənərkən xəta:", err);
      toast.error("Məlumatlar yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
   
  }, [bookId]);

  const myReview = reviews.find((r) => r.user?._id === currentUserId);
  const otherReviews = reviews.filter((r) => r.user?._id !== currentUserId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Rəy bildirmək üçün daxil olmalısınız");
      navigate("/login");
      return;
    }
    if (rating === 0) {
      toast.error("Zəhmət olmasa reytinq seçin");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${API_URL}/reviews`,
        { bookId, rating, comment },
        authHeaders,
      );
      setReviews((prev) => [
        {
          ...res.data.review,
          user: { _id: currentUserId, userName: localStorage.getItem("userName") },
        },
        ...prev,
      ]);
      setRating(0);
      setComment("");
      toast.success("Rəyiniz əlavə olundu");
    } catch (err) {
      const msg = err.response?.data?.message || "Xəta baş verdi";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("az-AZ", { day: "2-digit", month: "long", year: "numeric" });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return <div className={styles.stateWrapper}><p>Yüklənir...</p></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.ambient} aria-hidden="true">
        <div className={styles.glowGold} />
        <div className={styles.glowEmerald} />
      </div>

      <div className={styles.wrap}>
        <button className={styles.backLink} onClick={() => navigate(-1)}>
          ← Geri qayıt
        </button>

        <div className={styles.header}>
          <div className={styles.bookMini}>
            <img
              src={book?.image || "https://via.placeholder.com/70x100?text=R"}
              alt={book?.title}
            />
            <div>
              <span className={styles.eyebrow}>Kitab Rəyləri</span>
              <h1>{book?.title}</h1>
              <p className={styles.author}>{book?.author}</p>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className={styles.avgBox}>
              <strong>{avgRating}</strong>
              <StarRating value={Math.round(avgRating)} readOnly size={18} />
              <span>{reviews.length} rəy</span>
            </div>
          )}
        </div>

        {/* Rəy yazma formu — yalnız hələ rəy yazmayıbsa */}
        {token && !myReview && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formTop}>
              <span className={styles.formLabel}>Bu kitab haqqında rəyiniz</span>
              <StarRating value={rating} onChange={setRating} size={26} />
            </div>
            <textarea
              placeholder="Kitab haqqında fikirlərinizi yazın..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? "Göndərilir..." : "Rəy Bildir"}
              </button>
            </div>
          </form>
        )}

        {!token && (
          <div className={styles.loginPrompt}>
            <p>Rəy bildirmək üçün <button onClick={() => navigate("/login")}>daxil olun</button>.</p>
          </div>
        )}

        {/* Rəylər siyahısı */}
        {reviews.length === 0 ? (
          <p className={styles.stateText}>Bu kitaba hələ rəy bildirilməyib. İlk siz olun!</p>
        ) : (
          <div className={styles.list}>
            {myReview && (
              <div className={`${styles.reviewCard} ${styles.myReview}`}>
                <div className={styles.reviewTop}>
                  <div>
                    <span className={styles.reviewAuthor}>
                      {myReview.user?.userName || "Siz"} <span className={styles.youTag}>Siz</span>
                    </span>
                    <span className={styles.reviewDate}>{formatDate(myReview.createdAt)}</span>
                  </div>
                  <StarRating value={myReview.rating} readOnly size={16} />
                </div>
                <p>{myReview.comment}</p>
                <span className={styles.editHint}>
                  Rəyinizi redaktə etmək üçün <button onClick={() => navigate("/my-reviews")}>Mənim Rəylərim</button> səhifəsinə keçin
                </span>
              </div>
            )}

            {otherReviews.map((r) => (
              <div className={styles.reviewCard} key={r._id}>
                <div className={styles.reviewTop}>
                  <div>
                    <span className={styles.reviewAuthor}>{r.user?.userName || "Anonim"}</span>
                    <span className={styles.reviewDate}>{formatDate(r.createdAt)}</span>
                  </div>
                  <StarRating value={r.rating} readOnly size={16} />
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookReviews;