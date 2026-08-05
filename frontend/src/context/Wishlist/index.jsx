import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:3300";
const WishlistContext = createContext();

const CURRENT_USER_ID = "6696b8e8f8d9b1234567890a";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/wishlist/?userId=${CURRENT_USER_ID}`,
      );
      setWishlist(res.data || []);
    } catch (err) {
      console.error("İstək siyahısı yüklənərkən xəta:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (bookId) => {
    return wishlist.some((item) => (item.book?._id || item.book) === bookId);
  };

  const getWishlistItemId = (bookId) => {
    const found = wishlist.find(
      (item) => (item.book?._id || item.book) === bookId,
    );
    return found?._id;
  };

  const toggleWishlist = async (book) => {
    const bookId = book._id || book.id;
    const alreadyIn = isInWishlist(bookId);

    if (alreadyIn) {
      const itemId = getWishlistItemId(bookId);
      setWishlist((prev) => prev.filter((item) => item._id !== itemId));
      try {
        await axios.delete(`${API_URL}/wishlist/${itemId}`);
        toast.success("İstək siyahısından çıxarıldı");
      } catch (err) {
        toast.error("Xəta baş verdi");
        fetchWishlist();
      }
    } else {
      try {
        const res = await axios.post(`${API_URL}/wishlist`, {
          bookId,
          userId: CURRENT_USER_ID,
        });
        setWishlist((prev) => [...prev, { _id: res.data.item._id, book }]);
        toast.success("İstək siyahısına əlavə olundu 🤍");
      } catch (err) {
        toast.error(err.response?.data?.message || "Xəta baş verdi");
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, isInWishlist, toggleWishlist, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
