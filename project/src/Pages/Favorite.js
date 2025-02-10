import React, { useState, useEffect } from "react";
import CardDetails from '../Components/Cards/CardDetails'



const Favorite = () => {
    const [favorite,setfavorite]=useState([]);

    // useEffect(()=>{
          
    //         (async function(){
    //           let data= await fetch(api).then(res=>res.json())
    //           setfetchData(data);
    //         })();
    //       },[api]);
    useEffect(()=>{
        (async function(){
            let fav=await fetch(api).then(res=>res.json())
            setfavorite(fav);

        })();
    },[])
  return (
    <div>
      Favorite characters here
    </div>
  )
}

export default Favorite
