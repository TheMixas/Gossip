import {createContext, useState} from "react";


export const QueryContext = createContext()
export const QueryContextProvider = ({children}) => {

    const [query, setQuery] = useState('')

    return(
        <QueryContext.Provider value={{query,setQuery}}>
            {children}
        </QueryContext.Provider>
    )
}