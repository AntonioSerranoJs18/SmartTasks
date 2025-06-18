import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Buscar..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-icon">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar; 