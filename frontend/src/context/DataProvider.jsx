import { createContext, useEffect, useState } from 'react';
import {getNote} from '../services/ApiService';

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {

    const [notes, setNotes] = useState([]);
    const [archiveNotes, setArchiveNotes] = useState([]);
    const [trashNotes, setTrashNotes] = useState([]);

    useEffect(() => {
        let mount = true;
        getNote()
        .then(res =>{
            console.log("res from api",res);
            setNotes(res);
        });

        return () => {
            mount = false; // Cleanup logic here if needed
        };
    }, []);

    return (
        <DataContext.Provider value={{
            notes,
            setNotes,
            archiveNotes,
            setArchiveNotes,
            trashNotes,
            setTrashNotes
        }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider;