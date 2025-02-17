// import React from 'react'
// import {Link} from 'react-router-dom'
// const Cards = ({results,page}) => {
//   let display;
//   if (results) {
//     display = results.map((x) => {
//       const { id, name, image, status, species } = x;
      
//       // Determine the class for status
//       const statusClass = status === "Alive" ? "status-alive" :status === "Dead" ? "status-dead" :"status-unknown";

//       return (
//         <Link style={{textDecoration:"none" , color:"black"}}to={`${page}${id}`} key={id} className="card">
//           <img src={image} alt={name} />
//           <div className="content">
//             <div><strong>Name:</strong> {name}</div>
//             <div><strong>Species:</strong> {species}</div>
//             <div>
//               <strong>Status:</strong>
//               <span className={`status-badge ${statusClass}`}>{status}</span>
//             </div>
//           </div>
//         </Link>
//       );
//     });
//   } 
//   else {
//     display = "No such character found";
//   }
  
//   return <div className="cards-container">{display}</div>;
// };

// export default Cards;


/*
--------------------------------------

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCharacters } from "../../redux";

const Cards = ({ page }) => {
  const dispatch = useDispatch();

  // Get characters from Redux state
  const { characters, loading, error } = useSelector((state) => state.character);

  useEffect(() => {
    dispatch(fetchCharacters());
  }, [dispatch]);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (error) {
    return <h3>Error: {error}</h3>;
  }

  if (!characters || characters.length === 0) {
    return <h3>No characters found</h3>;
  }

  return (
    <div className="cards-container">
      {characters.results.map(({ id, name, image, status, species }) => {
        const statusClass =
          status === "Alive" ? "status-alive" :
          status === "Dead" ? "status-dead" : "status-unknown";

        return (
          <Link to={`${page}${id}`} key={id} className="card">
            <img src={image} alt={name} />
            <div className="content">
              <div><strong>Name:</strong> {name}</div>
              <div><strong>Species:</strong> {species}</div>
              <div>
                <strong>Status:</strong>
                <span className={`status-badge ${statusClass}`}>{status}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Cards;


--------------------------------------  */

import React from "react";
import { Link } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";

const Cards = ({page}) => {  
  let display;
  const dispatch=useDispatch();
  const {characters,looading,error}=useSelector((state)=>state.character)
  const results=characters.results;
  if (results && results.length > 0) { 
    display = results.map((x) => {
      const { id, name, image, status, species } = x;
      const statusClass = status === "Alive" ? "status-alive" : status === "Dead" ? "status-dead" : "status-unknown";

      return (
        <Link style={{ textDecoration: "none", color: "black" }} to={`${page}${id}`} key={id} className="card">
          <img src={image} alt={name} />
          <div className="content">
            <div><strong>Name:</strong> {name}</div>
            <div><strong>Species:</strong> {species}</div>
            <div>
              <strong>Status:</strong>
              <span className={`status-badge ${statusClass}`}>{status}</span> {/* Template literal for className */}
            </div>
          </div>
        </Link>
      );
    });
  } else if (!results) {
    display = <h3>Loading...</h3>; 
  } else {
    display = "No such character found";
  }

  return <div className="cards-container">{display}</div>;
};

export default Cards;
