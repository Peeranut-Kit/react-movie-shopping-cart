import { useState, useRef } from "react";
import { FaStar, FaCalendarAlt } from "react-icons/fa";

const MovieCard = ({
  id,
  imgPath,
  title,
  vote_average,
  genres,
  release_date,
  addToCart,
}) => {
  // Retrieve the stored price
  const storedPrice = localStorage.getItem(`movie-price-${id}`);
  const [price, setPrice] = useState(
    storedPrice ? parseFloat(storedPrice) : null
  );
  const [priceInput, setPriceInput] = useState("");
  const priceInputRef = useRef(null);

  const handlePriceChange = (event) => {
    setPriceInput(event.target.value);
  };

  const handleSubmitPrice = () => {
    const priceString = priceInput.trim();
    if (!priceString) {
      alert("Input a price");
      priceInputRef.current.focus();
      return;
    }
    if (parseFloat(priceString) <= 0) {
      alert("Cannot set price to negative or zero value");
      priceInputRef.current.focus();
      return;
    }
    localStorage.setItem(`movie-price-${id}`, priceString);
    setPrice(parseFloat(priceString));
    setPriceInput("");
  };

  const handlePickToCart = () => {
    if (!price) {
      alert("Please set the price before adding to cart!");
      priceInputRef.current.focus();
      return;
    }
    addToCart({ id, title, price });
  };

  const imageUrl = `https://image.tmdb.org/t/p/w500${imgPath}`;

  return (
    <div className="card">
      <img src={imageUrl} alt={title} className="card-img" />
      <div className="card-details">
        <h3 className="card-title">{title}</h3>

        <div className="card-genres">
          {genres.map((genre, index) => (
            <span key={index} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>

        <div className="fixed-bottom-section">
          <div className="card-movie-info">
            <div className="movie-info">
              <FaStar className="movie-icon" />
              <span className="user-score">{vote_average * 10}%</span>
            </div>

            <div className="movie-info">
              <FaCalendarAlt className="movie-icon" />
              <span className="release-date">{release_date}</span>
            </div>
          </div>

          <div className="movie-price">
            <input
              type="number"
              value={priceInput}
              onChange={handlePriceChange}
              placeholder="New price..."
              className="price-input"
              ref={priceInputRef}
            />
            <button onClick={handleSubmitPrice} className="set-price-btn">
              Set Price
            </button>
          </div>

          <p className="price-display">
            Price: {price !== null ? `$${price}` : "-"}
          </p>

          <button onClick={handlePickToCart} className="cart-btn">
            Pick to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
