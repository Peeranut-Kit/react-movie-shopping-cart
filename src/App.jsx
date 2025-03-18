import Header from "./header/Header";
import Movies from "./movies/Movies";
import Searchbar from "./searchbar/Searchbar";
import Sidebar from "./sidebar/Sidebar";
import Cart from "./cart/Cart";
import MovieCard from "./components/MovieCard";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import { FaShoppingCart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentModal from "./modal/PaymentModal";

const apiKey = "019dde41bae67b9d113f849ca5f9bdff";

function App() {
  // Cart feature

  // For Cart icon toggle
  const [isCartVisible, setIsCartVisible] = useState(false);

  // Initialize former cart state from localStorage if exists
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("movies-cart");
    if (savedCart) {
      const savedCartArray = JSON.parse(savedCart);
      if (savedCartArray.length > 0) setIsCartVisible(true);
      return savedCartArray;
    } else return [];
  });

  const [showModal, setShowModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalTotalPrice, setModalTotalPrice] = useState(0);
  const [timer, setTimer] = useState(60);
  const intervalRef = useRef(null);

  // Save to localStorage when the cart state changes
  useEffect(() => {
    localStorage.setItem("movies-cart", JSON.stringify(cartItems));

    // Calculate the total price
    let total = cartItems.reduce((accum, item) => accum + item.price, 0);
    if (cartItems.length > 5) {
      total = 0.8 * total;
    } else if (cartItems.length > 3) {
      total = 0.9 * total;
    }
    setTotalPrice(total);
  }, [cartItems]);

  // Timer countdown
  useEffect(() => {
    if (showModal && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [showModal, timer]);

  const addToCart = ({ id, title, price }) => {
    const uniqueId = `${id}-${uuidv4()}`;
    setCartItems((prev) => [...prev, { id: uniqueId, title, price }]);
    setIsCartVisible(true);
    toast(`"${title}" added to cart!`);
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((movie) => movie.id !== id));
  };

  const handlePurchase = () => {
    toast("Thank you for your purchase!");
    setModalTotalPrice(totalPrice);
    setShowModal(true);
    setCartItems([]);
    setIsCartVisible(false);
  };

  const handleClearCart = () => {
    toast("Clear the cart!");
    setCartItems([]);
  };

  const toggleCartVisibility = () => {
    setIsCartVisible((prev) => !prev);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimer(60); // Reset timer
  };

  // Create genre lookup table
  const genreLookupTableRef = useRef({});

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch genre list");
        }
        const genreData = await response.json();
        genreLookupTableRef.current = genreData.genres.reduce(
          (table, genre) => {
            table[genre.id] = genre.name;
            return table;
          },
          {}
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchGenre();
  }, []);

  const genreLookupTable = genreLookupTableRef.current;

  // Fetch movies
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = query
          ? await fetch(
              `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
            )
          : await fetch(
              `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
            );
        if (!response.ok) {
          throw new Error("Failed to fetch genre list");
        }
        const moviesData = await response.json();
        setMovies(moviesData.results);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMovies();
  }, [query]);

  // Handle genre selection
  const [selectedGenre, setSelectedGenre] = useState(null);
  // Button seletion handler
  const handleClickGenre = (event) => {
    setSelectedGenre(parseInt(event.target.value));
  };

  // Filter by genre
  const filteredAndSortMovie = (movies, selectedGenre) => {
    let filteredMovie = movies;
    if (selectedGenre) {
      filteredMovie = movies.filter((movie) =>
        movie.genre_ids.includes(selectedGenre)
      );
    }
    filteredMovie.sort(
      (a, b) => new Date(b.release_date) - new Date(a.release_date)
    );

    return filteredMovie.map(
      ({ id, poster_path, title, vote_average, genre_ids, release_date }) => {
        const genres = genre_ids.map((id) => genreLookupTable[id]);
        return (
          <MovieCard
            key={id}
            id={id}
            imgPath={poster_path}
            title={title}
            vote_average={vote_average}
            genres={genres}
            release_date={release_date}
            addToCart={addToCart}
          />
        );
      }
    );
  };

  const result = filteredAndSortMovie(movies, selectedGenre);

  return (
    <div className="app-container">
      <ToastContainer position="top-left" autoClose={2000} hideProgressBar />
      <Header />
      <Sidebar
        genreLookupTable={genreLookupTable}
        handleClickGenre={handleClickGenre}
      />

      <div className="main-content">
        <Searchbar query={query} handleQueryChange={handleQueryChange} />
        <Movies result={result} />
        {isCartVisible && (
          <Cart
            cartItems={cartItems}
            totalPrice={totalPrice}
            handleRemoveFromCart={handleRemoveFromCart}
            handleClearCart={handleClearCart}
            handlePurchase={handlePurchase}
          />
        )}
      </div>

      <div className="shopping-cart-icon" onClick={toggleCartVisibility}>
        <FaShoppingCart />
        {cartItems.length > 0 && (
          <div className="cart-item-count">{cartItems.length}</div>
        )}
      </div>

      {showModal && (
        <PaymentModal
          totalPrice={modalTotalPrice}
          timer={timer}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default App;
