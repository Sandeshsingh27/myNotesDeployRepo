// Note.jsx

import React, { useContext, useState, useEffect } from 'react';
import axios from "axios";
import { Card, CardContent, CardActions, Typography, Grid, IconButton, Popover, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArchiveOutlined as Archive, DeleteOutlineOutlined as Delete, PushPinOutlined as PushPin, PhotoCamera } from '@mui/icons-material';
import { DataContext } from '../../context/DataProvider';
import { ChromePicker } from 'react-color';
import ColorLensIcon from '@mui/icons-material/ColorLens';

const StyledCard = styled(Card)`
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    width: 240px;
    margin: 8px;
    box-shadow: none;
    position: relative;
    overflow: hidden;
`;

const PinIconButton = styled(IconButton)`
    position: absolute;
    top: 8px;
    right: 8px;
`;

const TitleTypography = styled(Typography)`
    font-weight: bold;
    font-size: 14px;
`;

const Note = ({ note }) => {
    const { notes, setNotes, setArchiveNotes, setTrashNotes } = useContext(DataContext);
    const [colorPickerAnchorEl, setColorPickerAnchorEl] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState(note.bg_color || '#FFFFFF'); // Set initial color from note data

    useEffect(() => {
        const savedColor = localStorage.getItem(`note_${note.note_id}_color`);
        if (savedColor) {
            setBackgroundColor(savedColor);
        }
    }, [note.note_id]);

    const handleColorChange = async (color) => {
        setBackgroundColor(color.hex);
        // Save the color to local storage
        localStorage.setItem(`note_${note.note_id}_color`, color.hex);
        // Call a function to save the color to the database
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
            ...note,
            bg_color: color // Assuming 'bg_color' is the field name in the database
        };

        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/Note/${note.note_id}/`, data);
            console.log('Color updated successfully:', response.data);
            // Update the state with the new color
            const updatedNotes = notes.map(data => {
                if (data.note_id === note.note_id) {
                    return { ...data, bg_color: color };
                }
                return data;
            });
            setNotes(updatedNotes);
        } catch (error) {
            console.error('Error updating color:', error);
        }
    };

    const archiveNote = (note) => {
        const data = {
            ...note,
            isArchive: true
        };
    
        axios.put(`http://127.0.0.1:8000/api/Note/${note.note_id}/`, data)
            .then(response => {
                const updatedNotes = notes.filter(data => data.note_id !== note.note_id);
                setNotes(updatedNotes);
                setArchiveNotes(prevArr => [note, ...prevArr]);
            })
            .catch(error => {
                console.error('Error archiving note:', error);
            });
    };

    const trashNote = (note) => {
        const data = {
            ...note,
            isTrash: true
        };

        axios.put(`http://127.0.0.1:8000/api/Note/${note.note_id}/`, data)
            .then(response => {
                const updatedNotes = notes.filter(data => data.note_id !== note.note_id);
                setNotes(updatedNotes);
                setTrashNotes(prevArr => [note, ...prevArr]);
            })
            .catch(error => {
                console.error('Error trashing note:', error);
            });
    };

    const togglePin = (note) => {
        const updatedNote = { ...note, isPinned: !note.isPinned };
        const updatedNotes = notes.map(data => {
            if (data.note_id === note.note_id) {
                return updatedNote;
            }
            return data;
        });

        axios.put(`http://127.0.0.1:8000/api/Note/${note.note_id}/`, updatedNote)
            .then(response => {
                setNotes(updatedNotes);
            })
            .catch(error => {
                console.error('Error updating note:', error);
            });
    };

    return (
        <Grid item xs={12} sm={12} md={6} lg={3}>
            <StyledCard style={{ backgroundColor: backgroundColor }}>
                <CardContent>
                    <TitleTypography>{note.title}</TitleTypography>
                    <Typography>{note.body}</Typography>
                </CardContent>
                <CardActions>
                    <PinIconButton
                        onClick={() => togglePin(note)}
                        aria-label={note.isPinned ? "Unpin note" : "Pin note"}
                        title={note.isPinned ? "Unpin note" : "Pin note"}
                    >
                        <PushPin style={{ color: note.isPinned ? "#000000" : "inherit" }} />
                    </PinIconButton>

                    <div title="Archive note" onClick={() => archiveNote(note)}>
                        <IconButton style={{ color: 'inherit' }} aria-label="Archive note">
                            <Archive />
                        </IconButton>
                    </div>
                    <div>
                        <IconButton
                            title="Change background color"
                            style={{ color: 'inherit' }}
                            aria-label="Change background color"
                            onClick={handleColorPickerOpen}
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
                    <div title="Delete note" onClick={() => trashNote(note)}>
                        <IconButton style={{ color: 'inherit' }} aria-label="Move to trash">
                            <Delete />
                        </IconButton>
                    </div>
                </CardActions>
            </StyledCard>
        </Grid>
    );
};

export default Note;
