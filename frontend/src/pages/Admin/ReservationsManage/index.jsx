import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./index.module.scss";

const API_URL = "http://localhost:3300";

function AdminReservationsManage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 

  const [rejectTarget, setRejectTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const res = await axios.get(`${API_URL}/reservations`, { ...authHeaders, params });
      setReservations(res.data || []);
    } catch (err) {
      toast.error("Rezervasiyalar yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    
  }, [filter]);

  const handleApprove = async (id) => {
    const loadingToast = toast.loading("Təsdiqlənir...");
    try {
      await axios.put(`${API_URL}/reservations/${id}/approve`, {}, authHeaders);
      toast.dismiss(loadingToast);
      toast.success("Rezervasiya təsdiqləndi");
      fetchReservations();
    } catch (err) {
      toast.dismiss(loadingToast);
      const msg = err.response?.data?.message || "Xəta baş verdi";
      toast.error(msg);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    const loadingToast = toast.loading("Rədd edilir...");
    try {
      await axios.put(`${API_URL}/reservations/${rejectTarget._id}/reject`, {}, authHeaders);
      toast.dismiss(loadingToast);
      toast.success("Rezervasiya rədd edildi");
      fetchReservations();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Xəta baş verdi");
    } finally {
      setRejectTarget(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const loadingToast = toast.loading("Silinir...");
    try {
      await axios.delete(`${API_URL}/reservations/${deleteTarget._id}`, authHeaders);
      toast.dismiss(loadingToast);
      toast.success("Rezervasiya silindi");
      setReservations((prev) => prev.filter((r) => r._id !== deleteTarget._id));
    } catch (err) {
      toast.dismiss(loadingToast);
      const msg = err.response?.data?.message || "Xəta baş verdi";
      toast.error(msg);
    } finally {
      setDeleteTarget(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approve":
      case "approved":
        return <span className={`${styles.badge} ${styles.approved}`}>Təsdiqləndi</span>;
      case "rejected":
        return <span className={`${styles.badge} ${styles.rejected}`}>Rədd edildi</span>;
      case "pending":
      default:
        return <span className={`${styles.badge} ${styles.pending}`}>Gözləyir</span>;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>İdarəetmə Paneli</span>
          <h1>Rezervasiyalar</h1>
        </div>

        <div className={styles.filters}>
          <button
            className={filter === "all" ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter("all")}
          >
            Hamısı
          </button>
          <button
            className={filter === "pending" ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter("pending")}
          >
            Gözləyir
          </button>
          <button
            className={filter === "approve" ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter("approve")}
          >
            Təsdiqlənib
          </button>
          <button
            className={filter === "rejected" ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter("rejected")}
          >
            Rədd edilib
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <p className={styles.stateText}>Yüklənir...</p>
        ) : reservations.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kitab</th>
                <th>İstifadəçi</th>
                <th>Qiymət</th>
                <th>Status</th>
                <th>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td><strong>{r.book?.title || "Silinmiş kitab"}</strong></td>
                  <td>{r.user?.fullName || r.user?.userName || "Naməlum"}</td>
                  <td>{r.book?.price ? `${r.book.price} AZN` : "-"}</td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td>
                    <div className={styles.actions}>
                      {(r.status === "pending" || !r.status) && (
                        <>
                          <button className={styles.approveBtn} onClick={() => handleApprove(r._id)}>
                            Təsdiqlə
                          </button>
                          <button className={styles.rejectBtn} onClick={() => setRejectTarget(r)}>
                            Rədd et
                          </button>
                        </>
                      )}
                      <button className={styles.deleteBtn} onClick={() => setDeleteTarget(r)}>
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <p>Heç bir rezervasiya tapılmadı.</p>
          </div>
        )}
      </div>

   
      {rejectTarget && (
        <div className={styles.modalOverlay} onClick={() => setRejectTarget(null)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </div>
            <h3>Rezervasiyanı Rədd Et</h3>
            <p>
              <strong>"{rejectTarget.book?.title}"</strong> kitabına olan rezervasiyanı rədd etmək istədiyinizdən əminsiniz?
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setRejectTarget(null)}>İmtina et</button>
              <button className={styles.rejectConfirmBtn} onClick={handleRejectConfirm}>Bəli, rədd et</button>
            </div>
          </div>
        </div>
      )}

      
      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3m-8 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13" />
              </svg>
            </div>
            <h3>Rezervasiyanı Sil</h3>
            <p>
              <strong>"{deleteTarget.book?.title}"</strong> kitabına olan rezervasiyanı tamamilə silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.
            </p>
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

export default AdminReservationsManage;