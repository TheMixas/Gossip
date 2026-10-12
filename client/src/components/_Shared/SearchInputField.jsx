import '../../scss/input-field.scss'
import {useContext} from "react";
import {QueryContext} from "../context/search-users-and-posts.context";
import {useNavigate} from "react-router-dom";
function SearchInputField({placeholder, type}) {
    const {query, setQuery} = useContext(QueryContext)

    const navigate = useNavigate();
    return  (
        <div className="input-field-box">
            <input
                onChange={async (e) => {
                    if(type === "nav-bar") {
                        setQuery(e.target.value)
                        navigate(`/`)
                        
                    }
                }}
                className={`input-field input-field__${type}`}
                   placeholder={placeholder} type="text"/>
            <button className="search-button"></button>
        </div>

    )
}
export default SearchInputField;
