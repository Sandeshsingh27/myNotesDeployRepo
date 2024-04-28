import { useState, useRef, useContext } from 'react';
import { Box, TextField, ClickAwayListener, IconButton, Popover } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PhotoCamera, PushPinOutlined as PushPin, ColorLensOutlined as ColorLens } from '@mui/icons-material';
import { DataContext } from '../../context/DataProvider';
import { addNote} from '../../services/ApiService';
import { ChromePicker } from 'react-color';
import axios from 'axios';

const Container = styled(Box)`
    display: flex;
    flex-direction: column;
    margin: auto;
    box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);
    border-color: #e0e0e0;
    width: 600px;
    border-radius: 8px;
    min-height: 30px;
    padding: 10px 15px;
`;

const Form = () => {
    const [showTextField, setShowTextField] = useState(false);
    const [noteData, setNoteData] = useState({ title: '', body: '', bg_color: '#FFFFFF', isPinned: false }); // Updated field names
    const [colorPickerAnchorEl, setColorPickerAnchorEl] = useState(null);
    const { setNotes } = useContext(DataContext);
    const containerRef = useRef();

    const handleClickAway = () => {
        setShowTextField(false);
        containerRef.current.style.minHeight = '30px';
    
        // Add the new note
        if (noteData.title.trim() || noteData.body.trim()) {
            addNote(noteData)
                .then(newNote => {
                    // Update note data with new values
                    const updatedNoteData = { ...newNote };
                    if (noteData.bg_color !== '#FFFFFF') {
                        updatedNoteData.bg_color = noteData.bg_color;
                    }
                    if (noteData.isPinned !== false) {
                        updatedNoteData.isPinned = noteData.isPinned;
                    }
    
                    // Update note in the database
                    axios.put(`http://127.0.0.1:8000/api/Note/${newNote.note_id}/`, updatedNoteData)
                        .then(response => {
                            console.log('Note updated successfully:', response.data);
                        })
                        .catch(error => {
                            console.error('Error updating note:', error);
                        });
    
                    // Update local state with the new note
                    setNotes(prevNotes => [newNote, ...prevNotes]);
                    setNoteData({ title: '', body: '', bg_color: '#FFFFFF', isPinned: false });
                })
                .catch(error => {
                    console.error('Error adding note:', error);
                });
        }
    };
    

    const onTextAreaClick = () => {
        setShowTextField(true);
        containerRef.current.style.minHeight = '70px';
    };

    const onTextChange = e => {
        const { name, value } = e.target;
        setNoteData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleColorPickerOpen = (event) => {
        setColorPickerAnchorEl(event.currentTarget);
    };

    const handleColorPickerClose = () => {
        setColorPickerAnchorEl(null);
    };

    const handleColorChange = (color) => {
        setNoteData(prevData => ({ ...prevData, bg_color: color.hex }));
    };

    const togglePin = () => {
        setNoteData(prevData => ({ ...prevData, isPinned: !prevData.isPinned }));
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Container ref={containerRef}>
                {showTextField && (
                    <TextField
                        placeholder="Title"
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        style={{ marginBottom: 10 }}
                        onChange={onTextChange}
                        name="title"
                        value={noteData.title}
                    />
                )}
                <TextField
                    placeholder="Take a note..."
                    multiline
                    maxRows={Infinity}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    onClick={onTextAreaClick}
                    onChange={onTextChange}
                    name="body"
                    value={noteData.body}
                />
                {showTextField && (
                    <Box display="flex" justifyContent="right">
                        <IconButton onClick={handleColorPickerOpen} title="Change background color"
                            style={{ color: 'inherit' }}
                            aria-label="Change background color">
                            <ColorLens />
                        </IconButton>
                        {/* <IconButton aria-label="upload picture" component="span">
                            <PhotoCamera />
                        </IconButton> */}
                        <IconButton onClick={togglePin} aria-label={noteData.isPinned ? "Unpin note" : "Pin note"}
                        title={noteData.isPinned ? "Unpin note" : "Pin note"}>
                            <PushPin style={{ color: noteData.isPinned ? "#000000" : "inherit" } } />
                        </IconButton>
                    </Box>
                )}
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
                        <ChromePicker color={noteData.bg_color} onChange={handleColorChange} />
                    </Box>
                </Popover>
            </Container>
        </ClickAwayListener>
    );
};

export default Form;
