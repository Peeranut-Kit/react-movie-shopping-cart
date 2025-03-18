import "./searchbar.css";

const Searchbar = ({ query, handleQueryChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        placeholder="Search for movies..."
        id="searchInput"
      />
    </div>
  );
};

export default Searchbar;
