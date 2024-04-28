import { useContext, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataContext } from '../../context/DataProvider';
import { getTrashedNotes } from '../../services/ApiService';
import DeleteNote from './DeleteNote';

const DrawerHeader = styled('div')(({ theme }) => ({
    ...theme.mixins.toolbar,
}));

const DeleteNotes = () => {
    const { trashNotes, setTrashNotes } = useContext(DataContext);

    useEffect(() => {
        // Fetch trashed notes when component mounts
        getTrashedNotes()
            .then(data => {
                setTrashNotes(data);
            })
            .catch(error => {
                console.error('Error fetching trashed notes:', error);
            });
    }, [setTrashNotes]);

    // Filter trashed notes
    const filteredTrashedNotes = trashNotes.filter(note => note.isTrash);

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <Box sx={{ p: 3, width: '100%' }}>
                <DrawerHeader />
                <Grid container spacing={2}> 
                    {filteredTrashedNotes.map(deleteNote => (
                        <Grid item key={deleteNote.note_id} xs={6} md={3}>
                            <DeleteNote deleteNote={deleteNote} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}

export default DeleteNotes;
