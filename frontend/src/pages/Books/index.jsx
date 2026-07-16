import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import BookCard from "../../components/BookCard";
import styles from "./index.module.scss";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3300/books");
        setBooks(response.data.books || response.data);
        setLoading(false);
      } catch (err) {
        console.error("Məlumat çəkilərkən xəta baş verdi:", err);
        setError("Kitabları yükləmək mümkün olmadı.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleOpenConfirmModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleConfirmReservation = async () => {
    if (!selectedBook) return;

    setIsModalOpen(false);
    const loadingToast = toast.loading("Rezervasiya sorğusu göndərilir...");

    try {
      const response = await axios.post("http://localhost:3300/reservations", {
        bookId: selectedBook._id || selectedBook.id,
      });

      if (response.status === 201 || response.status === 200) {
        toast.dismiss(loadingToast);
        toast.success(`"${selectedBook.title}" uğurla rezervasiya olundu! 🎉`);
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
      setSelectedBook(null);
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
        <p>Troya platformasının zəngin kitab kolleksiyası.</p>
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

      {isModalOpen && selectedBook && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>📖</div>
            <h3>Rezervasiya Təsdiqi</h3>
            <p className={styles.modalText}>
              <strong>"{selectedBook.title}"</strong> kitabını rezervasiya etmək
              istədiyinizdən əminsiniz?
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedBook(null);
                }}
              >
                Xeyr, imtina et
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirmReservation}
              >
                Bəli, təsdiqləyirəm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Books;
