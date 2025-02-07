import React from "react";
import './App.css';
export default function Character() {


  const [characterName,setcharacterName]=React.useState("");
  const [species,setSpecies]=React.useState("");
  const [status,setStatus]=React.useState("");
  const [image,setImage]=React.useState("");
  const [data,setData]=React.useState({ results: [] });
  const [error,setError]=React.useState("");

  React.useEffect(()=>
{
    const fetchData=async ()=>{
       try{
       const response=await fetch("https://rickandmortyapi.com/api/character")
       const data=await response.json();
       setData(data);
       }
       catch{
        console.log("Error")
        setError("Error fetching data")
       }


    }
    fetchData();
},[]);
   const findcharacter=()=>

   {
       setError("")
       const foundCharacter=data.results.find((character) =>(character.name.toLowerCase()===characterName.toLowerCase()));
       if(foundCharacter)
       {
           setImage(foundCharacter.image);
           setSpecies(foundCharacter.species);
           setStatus(foundCharacter.status);
       }
       else
       {
           setError("No such character exists")
       }
       
   }

  return (
    <div className="Character">
      <h1 className="characters_heading">Search Character</h1>
      <form className="Search_form">
        <input
          id="characterName"
          type="text"
          placeholder="Enter character name"
          value={characterName}
          onChange={(e) => setcharacterName(e.target.value)} 
        />
        <button type="button" onClick={findcharacter} className="Search_btn">
          Search
        </button>
        <info className="info">
        <h1>{`Name:${characterName}`}</h1>
        <h1>{`Status: ${status}`}</h1>
        <h1>{`Species: ${species}`}</h1>
        </info>

      <p>{error}</p>
      {image && (
          <div>
          <h2>Character Image:</h2>
          <img src={image} alt="Character" style={{ maxWidth: "300px" }} />
        </div>
      )}
      </form>
    </div>
  );
}
