import { useContext } from "react";

import {
    AutorizacionesContext
} from "../context/AutorizacionesContext.jsx";


const useAutorizaciones = () => {

    const context =
        useContext(
            AutorizacionesContext
        );


    if (!context) {

        throw new Error(
            "useAutorizaciones debe utilizarse dentro de AutorizacionesProvider"
        );
    }


    return context;
};


export default useAutorizaciones;