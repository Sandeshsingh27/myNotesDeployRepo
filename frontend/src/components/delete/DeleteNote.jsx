import { useContext, useState, useEffect } from 'react';
import axios from 'axios';

import { Card, CardContent, CardActions, Typography, IconButton, Grid, Popover, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RestoreFromTrashOutlined as Restore, DeleteForeverOutlined as Delete } from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import ColorLensIcon from '@mui/icons-material/ColorLens';

import { DataContext } from '../../context/DataProvider';

const StyledCard = styled(Card)`
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    width: 240px;
    margin: 8px;
    box-shadow: none;
    position: relative;
    overflow: visible;
`;

const TitleTypography = styled(Typography)`
    font-weight: bold;
    font-size: 16px; /* Adjust the font size as needed */
`;

const DeleteNote = ({ deleteNote }) => {
    const { trashNotes, setNotes, setTrashNotes } = useContext(DataContext);
    const [colorPickerAnchorEl, setColorPickerAnchorEl] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState();

    useEffect(() => {
        const fetchColor = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/Note/${deleteNote.note_id}`);
                const color = response.data.bg_color;
                setBackgroundColor(color || '#FFFFFF');
            } catch (error) {
                console.error('Error fetching color:', error);
            }
        };

        fetchColor();
    }, [deleteNote.note_id]);

    const handleColorChange = (color) => {
        setBackgroundColor(color.hex);
        saveColorToDatabase(color.hex);
    };

    const handleColorPickerOpen = (event) => {
        setColorPickerAnchorEl(event.currentTarget);
    };

    const handleColorPickerClose = () => {
        setColorPickerAnchorEl(null);
    };

    const saveColorToDatabase = async (color) => {
        const data = {
            ...deleteNote,
            bg_color: color // Assuming 'bg_color' is the field name in the database
        };

        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/Note/${deleteNote.note_id}/`, data);
            console.log('Color updated successfully:', response.data);
            // Update the state with the new color
            const updatedNotes = trashNotes.map(data => {
                if (data.note_id === deleteNote.note_id) {
                    return { ...data, backgroundColor: color };
                }
                return data;
            });
            setTrashNotes(updatedNotes);
        } catch (error) {
            console.error('Error updating color:', error);
        }
    };

    const restoreNote = () => {
        const data = {
            ...deleteNote,
            isTrash: false  // Set isTrash to false to indicate restoring
        };
    
        axios.put(`http://127.0.0.1:8000/api/Note/${deleteNote.note_id}/`, data)
            .then(response => {
                const updatedNotes = trashNotes.filter(data => data.note_id !== deleteNote.note_id);
                setTrashNotes(updatedNotes);
                setNotes(prevNotes => [deleteNote, ...prevNotes]); // Add the restored note to the notes list
            })
            .catch(error => {
                console.error('Error restoring note:', error);
            });
    }

    const removeNote = () => {
        axios.delete(`http://127.0.0.1:8000/api/Note/${deleteNote.note_id}/`)
        .then(res => {
            const updatedNotes = trashNotes.filter(data => data.note_id !== deleteNote.note_id);
            setTrashNotes(updatedNotes);
        })
    }

    return (
        <Grid item xs={12} sm={12} md={6} lg={3}>
            <StyledCard style={{ backgroundColor: backgroundColor }}>
                    <CardContent>
                        <TitleTypography>{deleteNote.title}</TitleTypography>
                        <Typography>{deleteNote.body}</Typography>
                    </CardContent>
                    <CardActions>
                        <div onClick={restoreNote} aria-label="Restore note" title="Restore note">
                            <IconButton style={{ color: 'inherit' }}>
                                <Restore />
                            </IconButton>
                        </div>
                        <div>
                            <IconButton
                                aria-label="Change background color"
                                onClick={handleColorPickerOpen}
                                style={{ color: 'inherit' }}
                            >
                                <ColorLensIcon />
                            </IconButton>
                            <Popover
                                open={Boolean(colorPickerAnchorEl)}
                                anchorEl={colorPickerAnchorEl}
                                onClose={handleColorPickerClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <Box p={2}>
                                    <ChromePicker color={backgroundColor} onChange={handleColorChange} />
                                </Box>
                            </Popover>
                        </div>
                        <div onClick={removeNote} aria-label="Delete note permanently" title="Delete note">
                            <IconButton style={{ color: 'inherit' }}>
                                <Delete />
                            </IconButton>
                        </div>
                    </CardActions>
            </StyledCard>
        </Grid>
    )
}

export default DeleteNote;
