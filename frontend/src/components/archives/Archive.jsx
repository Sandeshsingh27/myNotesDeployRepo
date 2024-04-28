import { useContext, useState, useEffect } from 'react';
import axios from 'axios';

import { Card, CardContent, CardActions, Typography, IconButton, Grid, Popover, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { UnarchiveOutlined as Unarchive, DeleteOutlineOutlined as Delete } from '@mui/icons-material';
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
`;

const TitleTypography = styled(Typography)`
    font-weight: bold;
    font-size: 16px; /* Adjust the font size as needed */
`;

const Archive = ({ archive }) => {
    const { archiveNotes, setNotes, setArchiveNotes, setTrashNotes } = useContext(DataContext);
    const [colorPickerAnchorEl, setColorPickerAnchorEl] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState();

    useEffect(() => {
        const fetchColor = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/Note/${archive.note_id}`);
                const color = response.data.bg_color;
                setBackgroundColor(color || '#FFFFFF');
            } catch (error) {
                console.error('Error fetching color:', error);
            }
        };

        fetchColor();
    }, [archive.note_id]);

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
            ...archive,
            bg_color: color // Assuming 'bg_color' is the field name in the database
        };

        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/Note/${archive.note_id}/`, data);
            console.log('Color updated successfully:', response.data);
            const updatedNotes = archiveNotes.map(data => {
                if (data.note_id === archive.note_id) {
                    return { ...data, backgroundColor: color };
                }
                return data;
            });
            setArchiveNotes(updatedNotes);
        } catch (error) {
            console.error('Error updating color:', error);
        }
    };

    const unArchiveNote = () => {
        const data = {
            ...archive,
            isArchive: false  // Set isArchive to false to indicate unarchiving
        };
    
        axios.put(`http://127.0.0.1:8000/api/Note/${archive.note_id}/`, data)
            .then(response => {
                const updatedNotes = archiveNotes.filter(data => data.note_id !== archive.note_id);
                setArchiveNotes(updatedNotes);
                setNotes(prevNotes => [archive, ...prevNotes]); // Add the unarchived note to the notes list
            })
            .catch(error => {
                console.error('Error unarchiving note:', error);
            });
    };

    const trashNote = () => {
        const data = {
            ...archive,
            isArchive: false,
            isTrash: true
        };
        axios.put(`http://127.0.0.1:8000/api/Note/${archive.note_id}/`, data)
            .then(response => {
                const updatedNotes = archiveNotes.filter(data => data.note_id !== archive.note_id);
                setArchiveNotes(updatedNotes);
                setTrashNotes(prevArr => [archive, ...prevArr]);
            })
            .catch(error => {
                console.error('Error trashing note:', error);
            });
    };

    return (
        <Grid item xs={12} sm={12} md={6} lg={3}>
            <StyledCard style={{ backgroundColor: backgroundColor }}>
                <CardContent>
                    <TitleTypography>{archive.title}</TitleTypography>
                    <Typography>{archive.body}</Typography>
                </CardContent>
                <CardActions>
                    <div onClick={unArchiveNote} aria-label="Unarchive note" title="Unarchive note">
                        <IconButton style={{ color: 'inherit' }}>
                            <Unarchive />
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
                    <div onClick={trashNote} aria-label="Trash note" title="Trash note">
                        <IconButton style={{ color: 'inherit' }}>
                            <Delete />
                        </IconButton>
                    </div>
                </CardActions>
            </StyledCard>
        </Grid>
    );
};

export default Archive;
