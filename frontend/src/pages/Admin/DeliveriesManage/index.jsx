import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./index.module.scss";

const API_URL = "http://localhost:3300";

function AdminDeliveriesManage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [editTarget, setEditTarget] = useState(null);
  const [courierName, setCourierName] = useState("");
  const [saving, setSaving] = useState(false);

  const token =
    localStorage.getItem("adminToken") || localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const res = await axios.get(`${API_URL}/deliveries`, {
        ...authHeaders,
        params,
      });
      setDeliveries(res.data || []);
    } catch (err) {
      toast.error("Çatdırılmalar yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [filter]);

  const openEdit = (delivery) => {
    setEditTarget(delivery);
    setCourierName(delivery.courierName || "");
  };

  const handleUpdateStatus = async (status) => {
    if (!editTarget) return;
    setSaving(true);
    const loadingToast = toast.loading("Yenilənir...");
    try {
      const res = await axios.put(
        `${API_URL}/deliveries/${editTarget._id}`,
        { status, courierName },
        authHeaders,
      );
      toast.dismiss(loadingToast);
      toast.success("Status yeniləndi");
      setDeliveries((prev) =>
        prev.map((d) => (d._id === editTarget._id ? res.data.delivery : d)),
      );
      setEditTarget(null);
      setCourierName("");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("az-AZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "on_the_way":
        return (
          <span className={`${styles.badge} ${styles.onTheWay}`}>Yolda</span>
        );
      case "delivered":
        return (
          <span className={`${styles.badge} ${styles.delivered}`}>
            Çatdırıldı
          </span>
        );
      default:
        return (
          <span className={`${styles.badge} ${styles.pending}`}>Gözləyir</span>
        );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>İdarəetmə Paneli</span>
          <h1>Çatdırılmalar</h1>
        </div>

        <div className={styles.filters}>
          <button
            className={
              filter === "all" ? styles.filterActive : styles.filterBtn
            }
            onClick={() => setFilter("all")}
          >
            Hamısı
          </button>
          <button
            className={
              filter === "pending" ? styles.filterActive : styles.filterBtn
            }
            onClick={() => setFilter("pending")}
          >
            Gözləyir
          </button>
          <button
            className={
              filter === "on_the_way" ? styles.filterActive : styles.filterBtn
            }
            onClick={() => setFilter("on_the_way")}
          >
            Yolda
          </button>
          <button
            className={
              filter === "delivered" ? styles.filterActive : styles.filterBtn
            }
            onClick={() => setFilter("delivered")}
          >
            Çatdırılıb
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <p className={styles.stateText}>Yüklənir...</p>
        ) : deliveries.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kitab</th>
                <th>İstifadəçi</th>
                <th>Ünvan</th>
                <th>Telefon</th>
                <th>Kuryer</th>
                <th>Status</th>
                <th>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => (
                <tr key={d._id}>
                  <td>
                    <strong>{d.book?.title || "Silinmiş kitab"}</strong>
                  </td>
                  <td>{d.user?.fullName || d.user?.userName || "Naməlum"}</td>
                  <td>{d.address}</td>
                  <td>{d.phone || "-"}</td>
                  <td>{d.courierName || "-"}</td>
                  <td>{getStatusBadge(d.status)}</td>
                  <td>
                    {d.status !== "delivered" && (
                      <button
                        className={styles.editBtn}
                        onClick={() => openEdit(d)}
                      >
                        İdarə et
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <p>Heç bir çatdırılma tapılmadı.</p>
          </div>
        )}
      </div>

      {editTarget && (
        <div
          className={styles.modalOverlay}
          onClick={() => setEditTarget(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Çatdırılmanı İdarə Et</h3>
            <p className={styles.modalBookInfo}>
              <strong>{editTarget.book?.title}</strong> — {editTarget.address}
            </p>

            <label className={styles.courierLabel}>
              Kuryer adı
              <input
                type="text"
                placeholder="Məs: Elvin (moto)"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
              />
            </label>

            <div className={styles.statusActions}>
              <button
                className={styles.onTheWayBtn}
                onClick={() => handleUpdateStatus("on_the_way")}
                disabled={saving}
              >
                Yola çıxdı
              </button>
              <button
                className={styles.deliveredBtn}
                onClick={() => handleUpdateStatus("delivered")}
                disabled={saving}
              >
                Çatdırıldı
              </button>
            </div>

            <button
              className={styles.cancelBtn}
              onClick={() => setEditTarget(null)}
            >
              Bağla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDeliveriesManage;
