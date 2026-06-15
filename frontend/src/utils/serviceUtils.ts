export const getRandomReviews = (): number => {
  // Returns a pseudo‑random number of reviews between 10 and 59.
  return Math.floor(Math.random() * 50) + 10;
};
