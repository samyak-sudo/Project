import React, { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useSelector,useDispatch } from "react-redux";
import { ChangePage } from "../../redux";
import { fetchCharactersPage } from "../../redux";


const Pagination = () => {
  const handlePageChange = (data) => {
    dispatch(ChangePage(data.selected + 1)); 
  };
  const dispatch = useDispatch();
  const {characters,pageNum}=useSelector((state)=>state.character)
  const searchName=useSelector((state)=>state.search.searchName)
  useEffect(() => {
    if(!searchName)dispatch(fetchCharactersPage(pageNum));
    }, [dispatch,pageNum,searchName]);

  return (
    <ReactPaginate
      className="pagination justify-content-center"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      activeClassName="active"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      previousLabel="Previous"
      nextLabel="Next"
      pageCount={characters?.info?.pages || 1} // Ensure it has a valid number
      onPageChange={handlePageChange}
      forcePage={pageNum - 1} // Adjust index to start from 0
    />
  );
};

export default Pagination;

// let next=()=>{
    //     if (pageNumber ===42) return;
    //      setpageNumber((x) => x + 1);  // Correct usage of setpageNumber
    
    //     // console.log({pageNumber});
    
    // };
    // let prev=()=>{
        //         if(pageNumber===1)return;
        //         setpageNumber((x) => x - 1);  // Correct usage of setpageNumber
        
        //     // console.log({pageNumber});
        
        // };
        // console.log(info.pages);
    
  
//   <div>
/*     
     <button style={{color:'white' , backgroundColor:'blue',height:"50px",width:"100px"}} onClick={prev}><strong>Prev</strong></button>
     <button style={{color:'white' , backgroundColor:'blue',marginLeft:"10px",height:"50px",width:"100px"}} onClick={next}><strong>Next</strong></button>
      */
    //   console.log(info.pages);
      
    //  </div>
    




