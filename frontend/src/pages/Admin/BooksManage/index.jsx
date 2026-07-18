import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./index.module.scss";

const API_URL = "http://localhost:3300";
const emptyForm = { title: "", author: "", description: "", price: "", image: "", stock: "" };

function AdminBooksManage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const token = localStorage.getItem("adminToken");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/books`, { params: { search, limit: 100 } });
      setBooks(res.data.books || []);
    } catch (err) {
      toast.error("Kitablar yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingId(book._id);
    setForm({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      price: book.price || "",
      image: book.image || "",
      stock: book.stock || "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingId ? "Yenilənir..." : "Əlavə olunur...");
    try {
      if (editingId) {
        await axios.put(`${API_URL}/books/${editingId}`, form, authHeaders);
        toast.dismiss(loadingToast);
        toast.success("Kitab uğurla yeniləndi");
      } else {
        await axios.post(`${API_URL}/books`, form, authHeaders);
        toast.dismiss(loadingToast);
        toast.success("Kitab uğurla əlavə olundu");
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (err) {
      toast.dismiss(loadingToast);
      const msg = err.response?.data?.message || "Xəta baş verdi";
      toast.error(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const loadingToast = toast.loading("Silinir...");
    try {
      await axios.delete(`${API_URL}/books/${deleteTarget._id}`, authHeaders);
      toast.dismiss(loadingToast);
      toast.success("Kitab silindi");
      setBooks((prev) => prev.filter((b) => b._id !== deleteTarget._id));
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Silinmədi, yenidən cəhd edin");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>İdarəetmə Paneli</span>
          <h1>Kitablar</h1>
        </div>
        <button className={styles.addBtn} onClick={openAddModal}>
          + Yeni Kitab
        </button>
      </div>

      <div className={styles.searchRow}>
        <input
          type="text"
          placeholder="Kitab axtar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <p className={styles.stateText}>Yüklənir...</p>
        ) : books.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Şəkil</th>
                <th>Ad</th>
                <th>Müəllif</th>
                <th>Qiymət</th>
                <th>Stok</th>
                <th>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>
                    <div className={styles.thumb}>
                      <img
                        src={book.image || "https://via.placeholder.com/60x80?text=R"}
                        alt={book.title}
                      />
                    </div>
                  </td>
                  <td><strong>{book.title}</strong></td>
                  <td>{book.author}</td>
                  <td>{book.price ? `${book.price} AZN` : "-"}</td>
                  <td>
                    <span className={`${styles.stockBadge} ${book.stock > 0 ? styles.inStock : styles.outStock}`}>
                      {book.stock ?? 0}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEditModal(book)}>
                        Redaktə et
                      </button>
                      <button className={styles.deleteBtn} onClick={() => setDeleteTarget(book)}>
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
            <p>Heç bir kitab tapılmadı.</p>
          </div>
        )}
      </div>

   
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Kitabı Redaktə Et" : "Yeni Kitab Əlavə Et"}</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Ad
                <input type="text" name="title" value={form.title} onChange={handleChange} required />
              </label>

              <label>
                Müəllif
                <input type="text" name="author" value={form.author} onChange={handleChange} required />
              </label>

              <div className={styles.formRow}>
                <label>
                  Qiymət (AZN)
                  <input type="number" name="price" value={form.price} onChange={handleChange} step="0.01" required />
                </label>
                <label>
                  Stok
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} required />
                </label>
              </div>

              <label>
                Şəkil (URL)
                <input type="text" name="image" placeholder="https://..." value={form.image} onChange={handleChange} />
              </label>

              <label>
                Təsvir
                <textarea name="description" rows={4} value={form.description} onChange={handleChange} />
              </label>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  İmtina et
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingId ? "Yadda saxla" : "Əlavə et"}
                </button>
              </div>
            </form>
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
            <h3>Kitabı Sil</h3>
            <p><strong>"{deleteTarget.title}"</strong> kitabını silmək istədiyinizdən əminsiniz?</p>
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

export default AdminBooksManage;