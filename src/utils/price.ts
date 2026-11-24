const DEFAULT_PRICE = 2

// Mismo criterio que el backend: el día cuesta lo que el género más caro
export const getPrice = (movie: { genres?: { price?: number }[] }) => (
  movie.genres?.length ? Math.max(...movie.genres.map((genre) => genre.price ?? DEFAULT_PRICE)) : DEFAULT_PRICE
)
