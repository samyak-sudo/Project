// import React from "react";
// import styles from "./Search.module.scss";
// import { NavLink, Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { setSearchName, resetPageNumber } from "../../redux";
// import "../../App.css";


// const Search = ({setpageNumber,setsearchname}) => {

//     const dispatch=useDispatch();
//     const searchName=useSelector((state)=>state.search.searchName)
//     function handleScroll() {
//         const section = document.getElementById("characters-section");
//         if (section) {
//           section.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the section
//         }
//     }
//     const handleSearchChange = (e) => {
//       dispatch(setSearchName(e.target.value)); // Update Redux state
//   };
    
//   return (
//     <div className="header">
//         <Link to="/" className="Ricky">Ricky & Morty</Link>
//         <form style={{alignItems:"center",justifyContent:"center"}}className="Search_form">
//         <input style={{alignItems:"center",justifyContent:"center",height:"20px"}} 
//             value={searchName}
//             onChange={handleSearchChange}
//         placeholder="Search Characters" type="text" className={styles.input}/>
//         <button style={{alignItems:"center",justifyContent:"center"}}  onClick={(e)=>{e.preventDefault();}}className="Search_btn" ><strong>Search</strong>
        
//         </button>
//     </form>
//         <div className="nav">
//             <NavLink activeClassName="active" style={{padding:"30px",color:"black"}} to="/" className="nav-link">Characters</NavLink>
//             <NavLink activeClassName="active" style={{padding:"30px",color:"black"}} to="/episodes" className="nav-link">Episodes</NavLink>
//             <NavLink activeClassName="active" style={{padding:"30px",color:"black"}} to="/location" className="nav-link">Location</NavLink>
//         </div>
        
//         </div>
    
//   )
// }

// export default Search

import React,{useEffect} from "react";
import styles from "./Search.module.scss";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetPage, setSearchName} from "../../redux";
import { fetchCharactersName } from "../../redux";

import "../../App.css";

const Search = () => {
    const dispatch = useDispatch();
  const { searchName } = useSelector(state => state.search.searchName);
    function handleScroll() {
        const section = document.getElementById("characters-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" }); 
        }
    }

    const handleSearchChange = (e) => {
        // console.log("Search input:", e.target.value);
        dispatch(setSearchName(e.target.value)); // Update Redux state
      
    };

    return (
        <div className="header">
            <Link to="/" className="Ricky">Ricky & Morty</Link>
            <form style={{ alignItems: "center", justifyContent: "center" }} className="Search_form">
                <input
                    style={{ alignItems: "center", justifyContent: "center", height: "20px" }}
                    value={searchName}
                    onChange={(e) => {
                        dispatch(setSearchName(e.target.value)); // Dispatch search name to Redux
                    }}
                    placeholder="Search Characters"
                    type="text"
                    className={styles.input}
                />
                <button
                    style={{ alignItems: "center", justifyContent: "center" }}
                    onClick={(e) => e.preventDefault()} 
                    className="Search_btn"
                >
                    <strong>Search</strong>
                </button>
            </form>
            <div className="nav">
                <NavLink activeClassName="active" style={{ padding: "30px", color: "black" }} to="/" className="nav-link">
                    Characters
                </NavLink>
                <NavLink activeClassName="active" style={{ padding: "30px", color: "black" }} to="/episodes" className="nav-link">
                    Episodes
                </NavLink>
                <NavLink activeClassName="active" style={{ padding: "30px", color: "black" }} to="/location" className="nav-link">
                    Location
                </NavLink>
            </div>
        </div>
    );
};

export default Search;

