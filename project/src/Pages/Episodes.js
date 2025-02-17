import React,{useState,useEffect, } from "react";

const Episodes = () => {
    let [id,setid]=useState(1);
    let [info,setinfo]=useState({});
    let{air_date,name}=info;
   let api=`https://rickandmortyapi.com/api/episode/${id}`
   useEffect(()=>{
    (async function(){
        let data=await fetch(api).then(res=>res.json());
        setinfo(data);
    })()
   },[api]);
  return <div className="container">
    <div className="row">
        <h1 style={{textAlign:"center"}}className="text-center">
         Episodes:{" "}<span style={{color:"blue"}}>{name===""?"Unknown":name}</span>
        </h1>
        <h5 style={{textAlign:"center"}} className="text-center">Air Date{air_date===""?"Unknown":air_date}</h5>
    </div>
    <div className="row"></div>
  </div>;
  
}

export default Episodes
