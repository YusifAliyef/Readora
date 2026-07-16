import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./index.module.scss";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResId, setSelectedResId] = useState(null);
  const [selectedBookTitle, setSelectedBookTitle] = useState("");

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

  const handleOpenDeleteModal = (id, bookTitle) => {
    setSelectedResId(id);
    setSelectedBookTitle(bookTitle || "Bilinməyən Kitab");
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResId) return;

    setIsModalOpen(false);
    const loadingToast = toast.loading("Rezervasiya silinir...");

    try {
      await axios.delete(`http://localhost:3300/reservations/${selectedResId}`);

      toast.dismiss(loadingToast);
      toast.success("Rezervasiya uğurla silindi! 🎉");

      setReservations((prev) =>
        prev.filter(
          (item) => item._id !== selectedResId && item.id !== selectedResId,
        ),
      );
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Rezervasiya silinərkən xəta baş verdi:", err);

      const errorData = err.response?.data;
      let serverMessage = "";

      if (errorData && typeof errorData === "object") {
        serverMessage =
          errorData.message || errorData.error || JSON.stringify(errorData);
      } else {
        serverMessage = errorData || err.message;
      }

      toast.error(`Silinmədi: ${serverMessage}`);
    } finally {
      setSelectedResId(null);
      setSelectedBookTitle("");
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
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
                <th>Əməliyyat</th>
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
                    <td>
                      <button
                        onClick={() =>
                          handleOpenDeleteModal(itemId, bookData?.title)
                        }
                        className={styles.cancelBtn}
                      >
                        Sil
                      </button>
                    </td>
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

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>🗑️</div>
            <h3>Rezervasiyanı Sil</h3>
            <p className={styles.modalText}>
              <strong>"{selectedBookTitle}"</strong> kitabına olan
              rezervasiyanızı silmək istədiyinizdən əminsiniz?
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedResId(null);
                  setSelectedBookTitle("");
                }}
              >
                İmtina et
              </button>
              <button
                className={styles.modalConfirmBtn}
                onClick={handleDeleteConfirm}
              >
                Bəli, silinsin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyReservations;
