import { CHANGE_PAGE, FETCH_CHARACTER_DETAILS, FETCH_CHARACTER_FAILURE, FETCH_CHARACTER_REQUEST, FETCH_CHARACTER_SUCCESS, RESET_PAGE, SEARCH_CHARACTER } from "./characterTypes"

const initialState={
    characters:{
        info:{},
        results:[],
    },
    loading:false,
    characterDetails: {},
    error:'',
    pageNum:1,
    search_name:''
}

const characterReducer =(state=initialState,action)=>
{
    switch(action.type)
    {
        case FETCH_CHARACTER_REQUEST:return{
            ...state,
           loading:true
        }
        case FETCH_CHARACTER_SUCCESS:return{
            ...state,
            loading:false,
            characters:action.payload,
            error:''
        }
        case FETCH_CHARACTER_FAILURE:return{
            ...state,
            loading:false,
            error:action.payload
        }
        case FETCH_CHARACTER_DETAILS:return{
            ...state,
            loading:false,
            characterDetails: action.payload,
            error:''
        }
        case CHANGE_PAGE:return{
            ...state,
            pageNum:action.payload,
        }
        case SEARCH_CHARACTER:return{
            ...state,
            search_name:action.payload
        }
        case RESET_PAGE:return{
            ...state,
            pageNum:1
        }
        default:return state
    }
}
export default characterReducer;