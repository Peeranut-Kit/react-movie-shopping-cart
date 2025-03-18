import { useState } from "react";
import GenreButton from "../components/GenreButton";
import "./sidebar.css";

const Sidebar = ({ genreLookupTable, handleClickGenre }) => {
  const [selectedGenreButton, setSelectedGenreButton] = useState("");

  const handleGenreButtonClick = (event) => {
    setSelectedGenreButton(event.target.value);
    handleClickGenre(event);
  };

  return (
    <>
      <div className="sidebar">
        <div className="topic-container">
          <h2>Genre</h2>
        </div>

        <GenreButton
          onClickHandler={handleGenreButtonClick}
          genre_value=""
          genre_title="All Genre"
          isActive={selectedGenreButton === ""}
        />
        {Object.entries(genreLookupTable).map(([genre_id, genre]) => (
          <GenreButton
            key={genre_id}
            onClickHandler={handleGenreButtonClick}
            genre_value={genre_id}
            genre_title={genre}
            isActive={selectedGenreButton === genre_id}
          />
        ))}
      </div>
    </>
  );
};

export default Sidebar;
