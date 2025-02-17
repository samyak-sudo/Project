
import axios from 'axios'
import { CHANGE_PAGE, FETCH_CHARACTER_DETAILS, FETCH_CHARACTER_FAILURE, FETCH_CHARACTER_REQUEST, FETCH_CHARACTER_SUCCESS, RESET_PAGE, SEARCH_CHARACTER } from './characterTypes'
export const fetchCharacterRequest=()=>
{
    return{
        type:FETCH_CHARACTER_REQUEST
    }
}
export const fetchCharacterSuccess=characters=>
{
    return{
            type:FETCH_CHARACTER_SUCCESS,
            payload:characters
    }
}
export const fetchCharacterFailure=error=>
{
    return{
        type:FETCH_CHARACTER_FAILURE,
        payload:error
    }
}
export const ChangePage=(newPage)=>
{
    return {
        type:CHANGE_PAGE,
        payload:newPage
    }
}
export const SearchCharacter=(nam)=>
{
    return{
        type:SEARCH_CHARACTER,
        payload:nam
    }
}
export const resetPage = () => ({
    type: RESET_PAGE
  });
// export const fetchCharacter=()


export const fetchCharacters=()=>
{
    return(dispatch)=>
    {
        dispatch(fetchCharacterRequest());
        axios.get('https://rickandmortyapi.com/api/character').then(response=>{
            const characters=response.data
            dispatch(fetchCharacterSuccess(characters))
        })
        .catch(error=>
        {    const errorMsg=error.message
            dispatch(fetchCharacterFailure(errorMsg))
        })
    }
} 
export const fetchCharactersName = (searchName = "", pageNum = 1) => {
    return (dispatch) => {
        dispatch(fetchCharacterRequest());
        const apiUrl = `https://rickandmortyapi.com/api/character/?name=${searchName}&page=${pageNum}`

        axios.get(apiUrl)
            .then((response) => {
                dispatch(fetchCharacterSuccess(response.data));
            })
            .catch((error) => {
                dispatch(fetchCharacterFailure(error.message));
            });
    };
};

export const fetchCharactersPage=(pageNum=1)=>
{
    return(dispatch)=>{
        axios.get(`https://rickandmortyapi.com/api/character?page=${pageNum}`).then(response=>{
            dispatch(fetchCharacterSuccess(response.data))
        })
        .catch(error=>{
            dispatch(fetchCharacterFailure(error.message))
        })
    }
}



export const fetchCharacterDetails=(id) =>{
    return (dispatch)=>
    {
        dispatch(fetchCharacterRequest());
        axios.get(`https://rickandmortyapi.com/api/character/${id}`).then(response=>{
            dispatch({
                type: FETCH_CHARACTER_DETAILS,
                payload: response.data,
              });
        })
        .catch((error) => {
            dispatch(fetchCharacterFailure(error.message));
          });
    }
}