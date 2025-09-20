import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm } from '../store/dashboardSlice';
import { IoSearch } from 'react-icons/io5';
import './SearchBar.css';

const SearchBar = () => {
  const { searchTerm } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();

  return (
    <div className="search-bar">
      <IoSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search anything..."
        value={searchTerm}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
      />
    </div>
  );
};

export default SearchBar;