import { useContext, useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { DataContext } from '../../context/DataProvider';
import { reorder } from '../../utils/common-utils';

// Components
import Form from './Form';
import Note from './Note';
import EmptyNotes from './EmptyNotes';

const DrawerHeader = styled('div')(({ theme }) => ({
    ...theme.mixins.toolbar,
}));

const Notes = () => {
    const { notes, setNotes } = useContext(DataContext);
    const [pinnedNotes, setPinnedNotes] = useState([]);
    const [unpinnedNotes, setUnpinnedNotes] = useState([]);

    useEffect(() => {
        // Filter pinned and unpinned notes
        const pinned = notes.filter(note => note.isPinned);
        const unpinned = notes.filter(note => !note.isPinned);
        setPinnedNotes(pinned);
        setUnpinnedNotes(unpinned);
    }, [notes]);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = reorder(notes, result.source.index, result.destination.index);
        setNotes(items);
    };

    const handlePinToggle = () => {
        // Re-filter notes after pin/unpin operation
        const pinned = notes.filter(note => note.isPinned);
        const unpinned = notes.filter(note => !note.isPinned);
        setPinnedNotes(pinned);
        setUnpinnedNotes(unpinned);
    };

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <Box sx={{ p: 3, width: '100%' }}>
                <DrawerHeader />
                <Form onPinToggle={handlePinToggle} />
                {pinnedNotes.length > 0 && (
                    <>
                        <Typography variant="p" gutterBottom>
                            Pinned
                        </Typography>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="pinned-droppable">
                                {(provided, snapshot) => (
                                    <Grid
                                        container
                                        style={{ marginTop: 16 }}
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {pinnedNotes.map((note, index) => (
                                            <Draggable
                                                key={note.note_id.toString()}
                                                draggableId={note.note_id.toString()}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <Grid
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        item
                                                    >
                                                        <Note note={note} />
                                                    </Grid>
                                                )}
                                            </Draggable>
                                        ))}
                                    </Grid>
                                )}
                            </Droppable>
                        </DragDropContext>
                        {/* Render "Other" text when there are pinned notes */}
                        <Box sx={{ marginTop: 2 }}>
                            <Typography variant="p" gutterBottom>
                                Other
                            </Typography>
                        </Box>
                    </>
                )}
                {unpinnedNotes.length > 0 && (
                    <>
                        {/* <Typography variant="p" gutterBottom>
                            Other
                        </Typography> */}
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="unpinned-droppable">
                                {(provided, snapshot) => (
                                    <Grid
                                        container
                                        style={{ marginTop: 16 }}
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {unpinnedNotes.map((note, index) => (
                                            <Draggable
                                                key={note.note_id.toString()}
                                                draggableId={note.note_id.toString()}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <Grid
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        item
                                                    >
                                                        <Note note={note} />
                                                    </Grid>
                                                )}
                                            </Draggable>
                                        ))}
                                    </Grid>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </>
                )}
                {pinnedNotes.length === 0 && unpinnedNotes.length === 0 && <EmptyNotes />}
            </Box>
        </Box>
    );
};

export default Notes;
