import { SET_SEARCH_NAME } from "./searchType"


const initialState={
    searchName: "",
}


const searchReducer=(state=initialState,action)=>
{
    switch(action.type)
    {
        case SET_SEARCH_NAME:return{
            ...state,
            searchName:action.payload
        }
        
        default: return state;
    }
}



export default searchReducer;