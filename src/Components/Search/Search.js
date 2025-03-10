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
            <Link to="/" className="Ricky">Ricky & Morty</Link>
            <form 
                role="form"
                className="Search_form"
                style={{ alignItems: "center", justifyContent: "center" }}
                onSubmit={handleSubmit}
            >
                <input
                    style={{ alignItems: "center", justifyContent: "center", height: "20px" }}
                    value={searchName}
                    onChange={handleSearchChange}
                    placeholder="Search Characters"
                    type="text"
                    className={styles.input}
                    data-testid="search-input"
                />
                <button
                    type="submit"
                    style={{ alignItems: "center", justifyContent: "center" }}
                    className="Search_btn"
                >
                    <strong>Search</strong>
                </button>
            </form>
            <nav className="nav">
                <NavLink style={{ padding: "30px", color: "black" }} to="/" className="nav-link">
                    Characters
                </NavLink>
                <NavLink style={{ padding: "30px", color: "black" }} to="/episodes" className="nav-link">
                    Episodes
                </NavLink>
                <NavLink style={{ padding: "30px", color: "black" }} to="/location" className="nav-link">
                    Location
                </NavLink>
            </nav>
        </div>
    );
};

export default Search;

