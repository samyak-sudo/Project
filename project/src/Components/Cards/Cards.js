import React from 'react'
import {Link} from 'react-router-dom'
const Cards = ({results,page}) => {
  let display;
  if (results) {
    display = results.map((x) => {
      const { id, name, image, status, species } = x;
      
      // Determine the class for status
      const statusClass = status === "Alive" ? "status-alive" :status === "Dead" ? "status-dead" :"status-unknown";

      return (
        <Link style={{textDecoration:"none" , color:"black"}}to={`${page}${id}`} key={id} className="card">
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
    });
  } 
  else {
    display = "No such character found";
  }
  
  return <div className="cards-container">{display}</div>;
};

export default Cards;
