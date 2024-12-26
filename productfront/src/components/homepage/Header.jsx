// Header.js
import React from 'react';
import '../styles/Home.css'

const Header = ({ searchQuery, handleSearchChange }) => {
  return (
    <div className="header">
      <div className="headerInner">
        <h1 className='text-white'>Order Management</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search by Order ID or Name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default Header;