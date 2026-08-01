import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./index.module.scss";

const API_URL = "http://localhost:3300";

function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/loans/my`, authHeaders);
        setLoans(res.data || []);
      } catch (err) {
        console.error("İcarələr yüklənərkən xəta:", err);
        setError("İcarə tarixçəniz yüklənə bilmədi.");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("az-AZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <p>İcarə tarixçəniz yüklənir...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>İcarələrim</h2>
        <p>Aldığınız kitabların icarə tarixçəsi və gecikmə cərimələri.</p>
      </header>

      {loans.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kitab</th>
                <th>Son Tarix</th>
                <th>Qaytarılma Tarixi</th>
                <th>Cərimə</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id}>
                  <td><strong>{loan.book?.title || "Bilinməyən Kitab"}</strong></td>
                  <td>{formatDate(loan.dueDate)}</td>
                  <td>{loan.returnDate ? formatDate(loan.returnDate) : "-"}</td>
                  <td className={loan.fine > 0 ? styles.fineText : ""}>
                    {loan.fine > 0 ? `${loan.fine.toFixed(2)} AZN` : "-"}
                  </td>
                  <td>{getStatusBadge(loan)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>Hələ ki, heç bir kitab icarəyə götürməmisiniz.</p>
        </div>
      )}
    </div>
  );
}

export default Loans;