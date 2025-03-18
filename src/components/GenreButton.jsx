const GenreButton = ({
  onClickHandler,
  genre_value,
  genre_title,
  isActive,
}) => {
  return (
    <button
      className={`genre-button ${isActive ? "active" : ""}`}
      value={genre_value}
      onClick={onClickHandler}
    >
      {genre_title}
    </button>
  );
};

export default GenreButton;
