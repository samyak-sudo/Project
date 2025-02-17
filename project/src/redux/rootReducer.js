import { combineReducers } from "redux"
import characterReducer from "./character/characterReducer"
import searchReducer from "./search/searchReducer"
const rootReducer=combineReducers({
    character:characterReducer,
    search:searchReducer
})
export default rootReducer