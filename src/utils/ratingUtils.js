// Rating Utility for Client Ratings & Reviews (Frontend Persistence)

const STORAGE_KEY = 'adalat_lawyer_ratings_v1';

export const getLawyerRatingData = (lawyerId) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const lId = String(lawyerId);
    
    if (data[lId]) {
      return data[lId];
    }
    
    // Default zero state for advocates with no reviews yet
    return {
      average: 0,
      count: 0,
      reviews: []
    };
  } catch (e) {
    return { average: 0, count: 0, reviews: [] };
  }
};

export const saveLawyerRating = (lawyerId, rating, comment = '', customerName = 'Customer') => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const lId = String(lawyerId);

    const existing = data[lId] || { average: 0, count: 0, reviews: [] };
    const newCount = existing.count + 1;
    const newAverage = Math.round(((existing.average * existing.count + rating) / newCount) * 10) / 10;

    const newReview = {
      id: Date.now(),
      name: customerName,
      rating,
      comment,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    data[lId] = {
      average: newAverage,
      count: newCount,
      reviews: [newReview, ...(existing.reviews || [])]
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data[lId];
  } catch (e) {
    return { average: rating, count: 1, reviews: [] };
  }
};
