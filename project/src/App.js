// import React, { useState,useEffect } from 'react'
// import './App.css';
// import Cards from './Components/Cards/Cards';
// import Pagination from './Components/Pagination/Pagination';
// import Search from './Components/Search/Search';
// import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
// import Episodes from "./Pages/Episodes";
// import Location from "./Pages/Location";
// import CardDetails from './Components/Cards/CardDetails';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchCharactersName } from './redux'; 

// function App(){
//   let [pageNumber,setpageNumber]=useState(1);
//   let [searchname,setsearchname]=useState("");
//   return(
//     <Router>
//       <div className="App"><Search setpageNumber ={setpageNumber} setsearchname={setsearchname}/></div>
//       <h1 style={{textAlign:'center'}}>Characters</h1>
      
    
//     <Routes>
//       <Route path="/" element={<Home pageNumber={pageNumber} setpageNumber={setpageNumber} searchname={searchname} setsearchname={setsearchname}/>}/>
//       <Route path="/:id" element={<CardDetails/>}/>

//       <Route path="/episodes" element={<Episodes/>}/>
//       <Route path="/episodes/:id" element={<CardDetails/>}/>

//       <Route path="/location" element={<Location/>}/>
//       <Route path="/location/:id" element={<CardDetails/>}/>
//     </Routes>
//     </Router>
//   )
// }

// const Home=({pageNumber,setpageNumber,searchname,setsearchname})=> {
  
//   let [fetchData,setfetchData]=useState([]);
//   let {info,results}=fetchData;
//   let api=`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${searchname}`;
//   useEffect(()=>{

//     (async function(){
//       let data= await fetch(api).then(res=>res.json())
//       setfetchData(data);
//     })();
//   },[api])
  
//   return (
//     <div className="App">
//       <div className="container">
//       <div className="row">
        
//         <div className="col-3">
//         </div>
//         <div className="col-8">
//         <div className="row">
//         <Cards page="/" />
//         </div>
//         </div>
//       </div>
//       </div>
//       <Pagination />
//     </div>
//   );
// }


// export default App;



import React, { useState, useEffect } from 'react';
import './App.css';
import Cards from './Components/Cards/Cards';
import Pagination from './Components/Pagination/Pagination';
import Search from './Components/Search/Search';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Episodes from "./Pages/Episodes";
import Location from "./Pages/Location";
import CardDetails from './Components/Cards/CardDetails';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCharactersName, setSearchName } from './redux'; 

function App() {
  

  return (
    <Router>
      <div className="App">
        <Search /> 
        <h1 style={{ textAlign: 'center' }}>Characters</h1>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<CardDetails />} />
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/episodes/:id" element={<CardDetails />} />
          <Route path="/location" element={<Location />} />
          <Route path="/location/:id" element={<CardDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

const Home = () => {
  const dispatch=useDispatch();
  const searchName = useSelector(state => state.search.searchName);
  const { characters, loading, error } = useSelector(state => state.character);
  const pageNum=useSelector(state=>state.character.pageNum)

  useEffect(() => {
    dispatch(fetchCharactersName(searchName,pageNum)); 
}, [dispatch, searchName,pageNum]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  console.log("Characters:", characters.results);

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col-3"></div>
          <div className="col-8">
            <div className="row">
              <Cards results={characters.results} page="/" /> 
            </div>
          </div>
        </div>
      </div>
      <Pagination />
    </div>
  );
};

export default App;




