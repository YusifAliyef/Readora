import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import BookCard from "../../components/BookCard";
import styles from "./index.module.scss";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `http://localhost:3300/books?page=${page}&limit=12`,
        );

        setBooks(response.data.books);
        setTotalPages(response.data.totalPage);
      } catch (err) {
        console.error(err);
        setError("Kitabları yükləmək mümkün olmadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page]);

  const handleOpenConfirmModal = (book) => {
    setSelectedBook(book);
    setDeliveryMethod("pickup");
    setAddress("");
    setPhone("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    setDeliveryMethod("pickup");
    setAddress("");
    setPhone("");
  };

  const handleConfirmReservation = async () => {
    if (!selectedBook) return;

    if (deliveryMethod === "delivery" && !address.trim()) {
      toast.error("Zəhmət olmasa çatdırılma ünvanını daxil edin");
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading("Rezervasiya sorğusu göndərilir...");

    try {
      const response = await axios.post("http://localhost:3300/reservations", {
        bookId: selectedBook._id || selectedBook.id,
        deliveryMethod,
        address: deliveryMethod === "delivery" ? address : "",
        phone: deliveryMethod === "delivery" ? phone : "",
      });

      if (response.status === 201 || response.status === 200) {
        toast.dismiss(loadingToast);
        toast.success(`"${selectedBook.title}" uğurla rezervasiya olundu! 🎉`);
        handleCloseModal();
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Rezervasiya xətası:", err);

      const errorData = err.response?.data;
      let serverMessage = "";

      if (errorData && typeof errorData === "object") {
        if (errorData.messages && Array.isArray(errorData.messages)) {
          serverMessage = errorData.messages.join(", ");
        } else {
          serverMessage =
            errorData.message || errorData.error || JSON.stringify(errorData);
        }
      } else {
        serverMessage = errorData || err.message;
      }

      toast.error(`Xəta: ${serverMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <p>Kitablar bazadan yüklənir, zəhmət olmasa gözləyin...</p>
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
    <div className={styles.booksWrapper}>
      <header className={styles.pageHeader}>
        <h2>Bütün Kitablar</h2>
        <p>Readora platformasının zəngin kitab kolleksiyası.</p>
      </header>

      <div className={styles.booksGrid}>
        {books?.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book._id || book.id}
              book={book}
              onReserve={handleOpenConfirmModal}
            />
          ))
        ) : (
          <p className={styles.noBooks}>Bazada hələ heç bir kitab tapılmadı.</p>
        )}
      </div>
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ⬅ Əvvəlki
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Sonrakı ➡
        </button>
      </div>

      {isModalOpen && selectedBook && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Rezervasiya Təsdiqi</h3>
            <p className={styles.modalText}>
              <strong>"{selectedBook.title}"</strong> kitabını rezervasiya etmək
              istədiyinizdən əminsiniz?
            </p>

       
            <div className={styles.deliveryOptions}>
              <button
                type="button"
                className={
                  deliveryMethod === "pickup"
                    ? `${styles.optionBtn} ${styles.optionBtnActive}`
                    : styles.optionBtn
                }
                onClick={() => setDeliveryMethod("pickup")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M4 5c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v16l-7-3-7 3V5Z" />
                </svg>
                Özüm gedib götürəcəm
              </button>

              <button
                type="button"
                className={
                  deliveryMethod === "delivery"
                    ? `${styles.optionBtn} ${styles.optionBtnActive}`
                    : styles.optionBtn
                }
                onClick={() => setDeliveryMethod("delivery")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" />
                </svg>
                Evə çatdırılsın
              </button>
            </div>

           
            {deliveryMethod === "delivery" && (
              <div className={styles.deliveryForm}>
                <label>
                  Ünvan
                  <input
                    type="text"
                    placeholder="Küçə, bina, mənzil..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Telefon (istəyə bağlı)
                  <input
                    type="tel"
                    placeholder="+994 XX XXX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
              </div>
            )}

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={handleCloseModal}
              >
                Xeyr, imtina et
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirmReservation}
                disabled={submitting}
              >
                {submitting ? "Göndərilir..." : "Bəli, təsdiqləyirəm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Books;