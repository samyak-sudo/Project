// import React,{useState,useEffect} from 'react'
// import { useParams } from 'react-router-dom'
// import { useDispatch, useSelector } from "react-redux";
// /*
// id
// name
// status
// species
// image
// location
// origin
// gender
// episode (array of episode links)
// */
// const CardDetails = () => {
//     let {id}=useParams();
//     // const dispatch=useDispatch();
//     // const {characterDetails,loading,error}=useSelector((state)=>state.character);
//     let [fetchData,setfetchData]=useState([]);
//     let { name, status, species, image, location = {}, origin = {}, gender, episode = [] } = fetchData;
//     console.log(fetchData);
//     let api=`https://rickandmortyapi.com/api/character/${id}`
//     const statusClass = status === "Alive" ? "status-alive" :status === "Dead" ? "status-dead" :"status-unknown";
//     useEffect(()=>{
      
//         (async function(){
//           let data= await fetch(api).then(res=>res.json())
//           setfetchData(data);
//         })();
//       },[api]);
//       const episodeNumbers = episode.map(ep => ep.split("/").pop());
//   return <div style={{display:"flex",justifyContent:"center",border:"none"}}className="container">
//     <div className="" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
//         <h1 className="">{name}</h1>
//         <img src={image} alt="" className="img-fluid"/>
//         <div style={{display:"flex",flexDirection:"row",gap:"10px",alignContent:"center"}}>
//         <strong>Status:</strong>
//         <span className={`status-badge ${statusClass}`}>{status}</span>
//         </div>
//         <div><strong>Location:</strong>{location.name}</div>
//         <div><strong>Origin:</strong>{origin.name}</div>
//         <div><strong>Gender</strong>{gender}</div>
//         <strong>Episodes:</strong>
//         <ul>
//         {episodeNumbers.map((ep, index) => (
//                 <li key={index}>{ep}</li>
//             ))}
//         </ul>
//     </div>
//   </div>
  
// }

// export default CardDetails





import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCharacterDetails } from "../../redux";
// import "./Card.css";

const CardDetails = () => {
  let { id } = useParams();
  const dispatch = useDispatch();

  
  const { characterDetails, loading, error } = useSelector((state) => state.character);


  useEffect(() => {
    dispatch(fetchCharacterDetails(id));
  }, [dispatch, id]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  if (!characterDetails) {
    return <h2>No Character Found</h2>;
  }

  let { name, status, species, image, location = {}, origin = {}, gender, episode = [] } = characterDetails;
  const statusClass =
    status === "Alive" ? "status-alive" :
    status === "Dead" ? "status-dead" : "status-unknown";

  return (
    <div className="container">
      <div className="card-details">
        <h1>{name}</h1>
        <img src={image} alt={name} className="img-fluid" />
        <div>
          <strong>Status:</strong>
          <span className={`status-badge ${statusClass}`}> {status}</span>
        </div>
        <div><strong>Location:</strong> {location.name || "Unknown"}</div>
        <div><strong>Origin:</strong> {origin.name || "Unknown"}</div>
        <div><strong>Gender:</strong> {gender}</div>
        <strong>Episodes:</strong>
        <ul>
          {episode.map((ep) => (
            <li key={ep.split("/").pop()}>{ep.split("/").pop()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CardDetails;

