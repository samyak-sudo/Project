import React from 'react'
import styles from "./Search.module.scss";
import { NavLink,Link } from 'react-router-dom';
import "../../App.css"; 


const Search = ({setpageNumber,setsearchname}) => {
    function handleScroll() {
        const section = document.getElementById("characters-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the section
        }
    }
  return (
    <div className="header">
        <Link to="/" className="Ricky">Ricky & Morty</Link>
        <form style={{alignItems:"center",justifyContent:"center"}}className="Search_form">
        <input style={{alignItems:"center",justifyContent:"center",height:"20px"}} onChange={(e)=>{
            setpageNumber(1);
            setsearchname(e.target.value)}} 
        placeholder="Search Characters" type="text" className={styles.input}/>
        <button style={{alignItems:"center",justifyContent:"center"}}  onClick={(e)=>{e.preventDefault();}}className="Search_btn" ><strong>Search</strong>
        <i className="fa-solid fa-bars open"></i>
        <i className="fa-solid fa-xmark close"></i>
        </button>
    </form>
        <div className="nav">
            <NavLink activeClassName="active" style={{padding:"30px",color:"black"}} to="/" className="nav-link">Characters</NavLink>
            <NavLink activeClassName="active" style={{padding:"30px",color:"black"}} to="/episodes" className="nav-link">Episodes</NavLink>
            <NavLink activeClassName="active" style={{padding:"30px",color:"black"}} to="/location" className="nav-link">Location</NavLink>
        </div>
        
        </div>
    
  )
}

export default Search
