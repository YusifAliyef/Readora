import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./index.module.scss";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyReservations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3300/reservations/my",
        );

        const data = response.data.reservations || response.data || [];
        setReservations(data);

        setLoading(false);
      } catch (err) {
        console.error("Rezervasiyaları gətirərkən xəta:", err);
        setError("Rezervasiyaları yükləmək mümkün olmadı.");
        setLoading(false);
      }
    };

    fetchMyReservations();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approve":
      case "approved":
      case "təsdiqləndi":
        return (
          <span className={`${styles.badge} ${styles.approved}`}>
            Təsdiqləndi
          </span>
        );
      case "pending":
      case "gözləyir":
        return (
          <span className={`${styles.badge} ${styles.pending}`}>Gözləmədə</span>
        );
      case "rejected":
      case "rədd edildi":
        return (
          <span className={`${styles.badge} ${styles.rejected}`}>
            Rədd edildi
          </span>
        );
      default:
        return (
          <span className={`${styles.badge} ${styles.default}`}>
            {status || "Gözləmədə"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <p>Rezervasiyalarınız yüklənir, zəhmət olmasa gözləyin...</p>
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
        <h2>Rezervasiyalarım</h2>
        <p>
          Readora platformasında hazırda icarədə olan və ya gözləyən
          kitablarınız.
        </p>
      </header>

      {reservations.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kitab Adı</th>
                <th>Müəllif</th>
                <th>Qiymət</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((resItem) => {
                const bookData = resItem.book;
                const itemId = resItem._id || resItem.id;
                return (
                  <tr key={itemId}>
                    <td>
                      <strong>{bookData?.title || "Bilinməyən Kitab"}</strong>
                    </td>
                    <td>{bookData?.author || "Bilinməyən Müəllif"}</td>
                    <td>{bookData?.price ? `${bookData.price} AZN` : "-"}</td>
                    <td>{getStatusBadge(resItem.status)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.noReservations}>
          <p>Hələ ki, heç bir kitab rezervasiya etməmisiniz.</p>
        </div>
      )}
    </div>
  );
}

export default MyReservations;