import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ info, pageNumber, setpageNumber }) => {
  const handlePageChange = (data) => {
    setpageNumber(data.selected + 1); // API pages start from 1
  };

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
      pageCount={info?.pages || 1} // Ensure it has a valid number
      onPageChange={handlePageChange}
      forcePage={pageNumber - 1} // Adjust index to start from 0
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
    




