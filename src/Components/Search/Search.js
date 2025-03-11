import React from "react";
import styles from "./Search.module.scss";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearchName } from "../../redux";
import "../../App.css";

const Search = () => {
    const dispatch = useDispatch();
    const searchName = useSelector(state => state.search.searchName || '');

    const handleScroll = () => {
        const section = document.getElementById("characters-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSearchChange = (e) => {
        dispatch(setSearchName(e.target.value));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleScroll();
    };

    return (
        <div className="header">
            <div className="nav-container">
                <Link to="/" className="Ricky">Ricky & Morty</Link>
                <form 
                    role="form"
                    className="Search_form"
                    onSubmit={handleSubmit}
                >
                    <input
                        value={searchName}
                        onChange={handleSearchChange}
                        placeholder="Search Characters"
                        type="text"
                        className={styles.input}
                        data-testid="search-input"
                    />
                    <button
                        type="submit"
                        className="Search_btn"
                    >
                        Search
                    </button>
                </form>
                <nav className="nav">
                    <NavLink to="/" className="nav-link">
                        Characters
                    </NavLink>
                    <NavLink to="/episodes" className="nav-link">
                        Episodes
                    </NavLink>
                    <NavLink to="/location" className="nav-link">
                        Location
                    </NavLink>
                </nav>
            </div>
        </div>
    );
};

export default Search;

