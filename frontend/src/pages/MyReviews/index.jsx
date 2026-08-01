import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import StarRating from "../../components/StarRating";
import styles from "./index.module.scss";

const API_URL = "http://localhost:3300";

function MyReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/reviews/my`, authHeaders);
      setReviews(res.data || []);
    } catch (err) {
      toast.error("Rəylər yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
  };

  const handleSave = async (id) => {
    setSaving(true);
    try {
      const res = await axios.put(
        `${API_URL}/reviews/${id}`,
        { rating: editRating, comment: editComment },
        authHeaders,
      );
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...res.data.review } : r)),
      );
      toast.success("Rəyiniz yeniləndi");
      cancelEdit();
    } catch (err) {
      const msg = err.response?.data?.message || "Xəta baş verdi";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const loadingToast = toast.loading("Silinir...");
    try {
      await axios.delete(`${API_URL}/reviews/${deleteTarget}`, authHeaders);
      toast.dismiss(loadingToast);
      toast.success("Rəy silindi");
      setReviews((prev) => prev.filter((r) => r._id !== deleteTarget));
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Silinmədi, yenidən cəhd edin");
    } finally {
      setDeleteTarget(null);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("az-AZ", { day: "2-digit", month: "long", year: "numeric" });

  if (loading) {
    return <div className={styles.stateWrapper}><p>Rəyləriniz yüklənir...</p></div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Mənim Rəylərim</h2>
        <p>Yazdığınız bütün rəyləri burada idarə edə bilərsiniz.</p>
      </header>

      {reviews.length > 0 ? (
        <div className={styles.list}>
          {reviews.map((r) => (
            <div className={styles.card} key={r._id}>
              <div
                className={styles.bookInfo}
                onClick={() => navigate(`/books/${r.book?._id}/reviews`)}
              >
                <img
                  src={r.book?.image || "https://via.placeholder.com/56x78?text=R"}
                  alt={r.book?.title}
                />
                <div>
                  <strong>{r.book?.title || "Silinmiş kitab"}</strong>
                  <span>{r.book?.author}</span>
                </div>
              </div>

              {editingId === r._id ? (
                <div className={styles.editForm}>
                  <StarRating value={editRating} onChange={setEditRating} size={22} />
                  <textarea
                    rows={3}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                  />
                  <div className={styles.editActions}>
                    <button className={styles.cancelBtn} onClick={cancelEdit}>İmtina et</button>
                    <button
                      className={styles.saveBtn}
                      onClick={() => handleSave(r._id)}
                      disabled={saving}
                    >
                      {saving ? "Yadda saxlanılır..." : "Yadda saxla"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.reviewTop}>
                    <StarRating value={r.rating} readOnly size={16} />
                    <span className={styles.date}>{formatDate(r.createdAt)}</span>
                  </div>
                  <p>{r.comment}</p>
                  <div className={styles.actions}>
                    <button onClick={() => startEdit(r)}>Redaktə et</button>
                    <button onClick={() => setDeleteTarget(r._id)}>Sil</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>Hələ ki, heç bir kitaba rəy bildirməmisiniz.</p>
          <button className={styles.browseBtn} onClick={() => navigate("/books")}>
            Kolleksiyaya Bax
          </button>
        </div>
      )}

      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Rəyi Sil</h3>
            <p>Bu rəyi silmək istədiyinizdən əminsiniz?</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)}>İmtina et</button>
              <button className={styles.deleteConfirmBtn} onClick={handleDeleteConfirm}>Bəli, silinsin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyReviews;