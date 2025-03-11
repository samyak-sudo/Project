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
        <div className="character-info">
          <div>
            <strong>Status:</strong>
            <span className={`status-badge ${statusClass}`}> {status}</span>
          </div>
          <div><strong>Location:</strong> {location.name || "Unknown"}</div>
          <div><strong>Origin:</strong> {origin.name || "Unknown"}</div>
          <div><strong>Gender:</strong> {gender}</div>
          <div className="episodes-section">
            <strong>Episodes:</strong>
            <div className="episodes-grid">
              {episode.map((ep) => (
                <span key={ep.split("/").pop()} className="episode-number">
                  {ep.split("/").pop()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;

