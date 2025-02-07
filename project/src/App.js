import React, { useState,useEffect } from 'react'
import './App.css';
import Header from "./Header"
import Filters from './Components/Filters/Filters';
import Cards from './Components/Cards/Cards';
import Pagination from './Components/Pagination/Pagination';
import Search from './Components/Search/Search';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Episodes from "./Pages/Episodes";
import Location from "./Pages/Location";
import CardDetails from './Components/Cards/CardDetails';

function App(){
  let [pageNumber,setpageNumber]=useState(1);
  let [searchname,setsearchname]=useState("");
  return(
    <Router>
      <div className="App"><Search setpageNumber ={setpageNumber} setsearchname={setsearchname}/></div>
      <h1 style={{textAlign:'center'}}>Characters</h1>
      
    
    <Routes>
      <Route path="/" element={<Home pageNumber={pageNumber} setpageNumber={setpageNumber} searchname={searchname} setsearchname={setsearchname}/>}/>
      <Route path="/:id" element={<CardDetails/>}/>

      <Route path="/episodes" element={<Episodes/>}/>
      <Route path="/episodes/:id" element={<CardDetails/>}/>

      <Route path="/location" element={<Location/>}/>
      <Route path="/location/:id" element={<CardDetails/>}/>
    </Routes>
    </Router>
  )
}

const Home=({pageNumber,setpageNumber,searchname,setsearchname})=> {
  
  let [fetchData,setfetchData]=useState([]);
  let {info,results}=fetchData;
  let api=`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${searchname}`;
  useEffect(()=>{

    (async function(){
      let data= await fetch(api).then(res=>res.json())
      setfetchData(data);
    })();
  },[api])
  
  return (
    <div className="App">
      {/* <Header /> */}
      {/* <Search setpageNumber ={setpageNumber} setsearchname={setsearchname}/> */}
      {/* <Character id="characters-section" /> */}
      <div className="container">
      <div className="row">
        <div className="col-3">
        {/* <Filters/> */}
        </div>
        <div className="col-8">
        <div className="row">
        <Cards page="/" results={results} />
        </div>
        </div>
      </div>

      </div>
      <Pagination info={info} pageNumber={pageNumber} setpageNumber={setpageNumber}/>
    </div>
  );
}


export default App;
