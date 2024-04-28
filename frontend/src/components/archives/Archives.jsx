import { useEffect, useContext} from 'react';

import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import { DataContext } from '../../context/DataProvider';
import { getArchivedNotes } from '../../services/ApiService';

//components
import Archive from './Archive';

const DrawerHeader = styled('div')(({ theme }) => ({
    ...theme.mixins.toolbar,
}));

const Archives = () => {

    const { archiveNotes, setArchiveNotes } = useContext(DataContext);
    // const [archivedNotes, setArchivedNotes] = useState([]);

    useEffect(() => {
        // Fetch archived notes when component mounts
        getArchivedNotes()
            .then(data => {
                setArchiveNotes(data);
            })
            .catch(error => {
                console.error('Error fetching archived notes:', error);
            });
    }, [setArchiveNotes]);

     // Filter archived notes
     const filteredArchivedNotes = archiveNotes.filter(note => note.isArchive);
     console.log("archived:", filteredArchivedNotes)

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <Box sx={{ p: 3, width: '100%' }}>
                <DrawerHeader />
                <Grid container>
                    {
                        filteredArchivedNotes.map(archive => (
                            <Grid item key={archive.note_id} xs={6} md={3}>
                                <Archive archive={archive} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        </Box>
    )
}

export default Archives;
