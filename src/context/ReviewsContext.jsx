import { createContext, useContext, useState } from "react";

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("reviews")) || [];
    } catch {
      return [];
    }
  });

  const persist = (list) => {
    setReviews(list);
    try {
      localStorage.setItem("reviews", JSON.stringify(list));
    } catch {
      /* storage full: review stays until page reload */
    }
  };

  // One review per buyer per product: reviewing again replaces the old one
  const addReview = ({ productId, userId, userName, rating, comment }) => {
    const others = reviews.filter((r) => !(r.productId === productId && r.userId === userId));
    persist([
      { id: Date.now(), productId, userId, userName, rating, comment, date: new Date().toISOString() },
      ...others,
    ]);
  };

  const deleteReview = (id) => persist(reviews.filter((r) => r.id !== id));

  const getReviews = (productId) => reviews.filter((r) => r.productId === productId);

  const getStats = (productId) => {
    const list = getReviews(productId);
    const count = list.length;
    const avg = count ? list.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    return { avg, count };
  };

  return (
    <ReviewsContext.Provider value={{ addReview, deleteReview, getReviews, getStats }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export const useReviews = () => useContext(ReviewsContext);