import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./index.module.scss";

const API_URL = "http://localhost:3300";

function AdminLoansManage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | borrowed | returned
  const [returnTarget, setReturnTarget] = useState(null);

  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const res = await axios.get(`${API_URL}/loans`, { ...authHeaders, params });
      setLoans(res.data || []);
    } catch (err) {
      toast.error("İcarələr yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleReturnConfirm = async () => {
    if (!returnTarget) return;
    const loadingToast = toast.loading("Qeyd olunur...");
    try {
      const res = await axios.put(`${API_URL}/loans/${returnTarget._id}/return`, {}, authHeaders);
      toast.dismiss(loadingToast);
      const fine = res.data.fineAmount;
      toast.success(fine > 0 ? `Qaytarıldı — cərimə: ${fine} AZN` : "Kitab uğurla qaytarıldı");
      fetchLoans();
    } catch (err) {
      toast.dismiss(loadingToast);
      const msg = err.response?.data?.message || "Xəta baş verdi";
      toast.error(msg);
    } finally {
      setReturnTarget(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("az-AZ", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  };

  const getStatusBadge = (loan) => {
    if (loan.status === "returned") {
      return <span className={`${styles.badge} ${styles.returned}`}>Qaytarılıb</span>;
    }
    const isOverdue = new Date() > new Date(loan.dueDate);
    if (isOverdue) {
      return <span className={`${styles.badge} ${styles.overdue}`}>Gecikib</span>;
    }
    return <span className={`${styles.badge} ${styles.active}`}>Aktiv</span>;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>İdarəetmə Paneli</span>
          <h1>İcarələr</h1>
        </div>

        <div className={styles.filters}>
          <button className={filter === "all" ? styles.filterActive : styles.filterBtn} onClick={() => setFilter("all")}>Hamısı</button>
          <button className={filter === "borrowed" ? styles.filterActive : styles.filterBtn} onClick={() => setFilter("borrowed")}>Aktiv</button>
          <button className={filter === "returned" ? styles.filterActive : styles.filterBtn} onClick={() => setFilter("returned")}>Qaytarılıb</button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <p className={styles.stateText}>Yüklənir...</p>
        ) : loans.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kitab</th>
                <th>İstifadəçi</th>
                <th>Son Tarix</th>
                <th>Cərimə</th>
                <th>Status</th>
                <th>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id}>
                  <td><strong>{loan.book?.title || "Bilinməyən Kitab"}</strong></td>
                  <td>{loan.user?.fullName || loan.user?.userName || "Naməlum"}</td>
                  <td>{formatDate(loan.dueDate)}</td>
                  <td className={loan.fine > 0 ? styles.fineText : ""}>
                    {loan.fine > 0 ? `${loan.fine.toFixed(2)} AZN` : "-"}
                  </td>
                  <td>{getStatusBadge(loan)}</td>
                  <td>
                    {loan.status !== "returned" && (
                      <button className={styles.returnBtn} onClick={() => setReturnTarget(loan)}>
                        Qaytarıldı kimi qeyd et
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}><p>Heç bir icarə tapılmadı.</p></div>
        )}
      </div>

      {returnTarget && (
        <div className={styles.modalOverlay} onClick={() => setReturnTarget(null)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 12.5 11 15l4-5" /><circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <h3>Kitabı Qaytarıldı Kimi Qeyd Et</h3>
            <p>
              <strong>"{returnTarget.book?.title}"</strong> kitabının qaytarıldığını təsdiqləyirsiniz? Gecikmə varsa, cərimə avtomatik hesablanacaq.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setReturnTarget(null)}>İmtina et</button>
              <button className={styles.returnConfirmBtn} onClick={handleReturnConfirm}>Bəli, qaytarıldı</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLoansManage;