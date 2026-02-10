import React, { useRef } from 'react';
import { Search } from 'lucide-react';
import './ExpandingSearch.css';

const ExpandingSearch = ({ search, setSearch }) => {
  return (
    <div className="expanding-search-wrapper">
        {/* We use specific IDs/Classes from the user snippet logic */}
        <input
            id="search-box"
            type="text"
            className="search-box"
            name="q"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
        />
        <label htmlFor="search-box" className="search-label">
            <Search className="search-icon" size={20} />
        </label>
    </div>
  );
};

export default ExpandingSearch;
