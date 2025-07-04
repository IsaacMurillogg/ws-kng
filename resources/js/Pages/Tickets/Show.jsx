import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Paper, Typography, Grid, Chip, Box, TextField, Button, Divider, List, ListItem, ListItemText, Avatar, IconButton } from '@mui/material';
import { AccountCircle, Send as SendIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'; // Para iconos
import axios from 'axios'; // Para llamadas API directas
import { Inertia } from '@inertiajs/inertia'; // Para recargar o redirigir después de acciones

// Componente para un solo comentario (se podría mover a su propio archivo si crece)
const CommentItem = ({ comentario, currentUser, onEdit, onDelete }) => (
    <ListItem alignItems="flex-start" sx={{ borderBottom: '1px solid #eee' }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <AccountCircle />
        </Avatar>
        <ListItemText
            primary={
                <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>
                    {comentario.user ? comentario.user.name : 'Usuario desconocido'}
                    <Typography variant="caption" component="span" sx={{ ml: 1, color: 'text.secondary' }}>
                        {new Date(comentario.created_at).toLocaleString()}
                    </Typography>
                </Typography>
            }
            secondary={comentario.comentario}
        />
        {currentUser && (currentUser.id === comentario.user_id || currentUser.role === 'admin') && (
            <Box>
                <IconButton size="small" onClick={() => onEdit(comentario)} title="Editar Comentario">
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(comentario.id)} title="Eliminar Comentario">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        )}
    </ListItem>
);

export default function Show({ auth, ticket: initialTicket }) {
    const [ticket, setTicket] = useState(initialTicket); // Estado local para actualizar comentarios dinámicamente
    const { data, setData, post, processing, errors, reset } = useForm({
        comentario: '',
    });
    const [editingComment, setEditingComment] = useState(null); // Para el modal/formulario de edición

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        axios.post(route('api.comentarios.store', { ticket: ticket.id }), { comentario: data.comentario })
            .then(response => {
                // Actualizar la lista de comentarios en el estado local del ticket
                setTicket(prevTicket => ({
                    ...prevTicket,
                    comentarios: [...prevTicket.comentarios, response.data]
                }));
                reset('comentario'); // Limpiar el campo de texto
            })
            .catch(error => {
                console.error("Error al enviar comentario:", error);
                if (error.response && error.response.data && error.response.data.errors) {
                    // setData('errors', error.response.data.errors); // Si quieres mostrar errores de validación
                }
            });
    };

    const handleUpdateComment = (commentId, updatedText) => {
        axios.put(route('api.comentarios.update', { comentario: commentId }), { comentario: updatedText })
            .then(response => {
                setTicket(prevTicket => ({
                    ...prevTicket,
                    comentarios: prevTicket.comentarios.map(c => c.id === commentId ? response.data : c)
                }));
                setEditingComment(null); // Cerrar modal/formulario de edición
            })
            .catch(error => console.error("Error al actualizar comentario:", error));
    };

    const handleDeleteComment = (commentId) => {
        if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            axios.delete(route('api.comentarios.destroy', { comentario: commentId }))
                .then(() => {
                    setTicket(prevTicket => ({
                        ...prevTicket,
                        comentarios: prevTicket.comentarios.filter(c => c.id !== commentId)
                    }));
                })
                .catch(error => console.error("Error al eliminar comentario:", error));
        }
    };

    // Modal/Formulario de edición de comentario (simplificado)
    const EditCommentForm = ({ comment, onSave, onCancel }) => {
        const { data: editData, setData: setEditData, processing: editProcessing } = useForm({
            comentario: comment.comentario
        });

        const submitEdit = (e) => {
            e.preventDefault();
            onSave(comment.id, editData.comentario);
        };

        return (
            <Box component="form" onSubmit={submitEdit} sx={{ mt: 2, p:2, border: '1px solid #ccc', borderRadius: 1}}>
                <Typography variant="h6" gutterBottom>Editar Comentario</Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={editData.comentario}
                    onChange={e => setEditData('comentario', e.target.value)}
                    variant="outlined"
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" disabled={editProcessing} sx={{mr:1}}>Guardar</Button>
                <Button variant="outlined" onClick={onCancel}>Cancelar</Button>
            </Box>
        );
    };


    const getStatusChipColor = (status) => {
        // ... (misma función que en Index.jsx)
        switch (status) {
            case 'abierto': return 'error';
            case 'en progreso': return 'warning';
            case 'resuelto': return 'success';
            default: return 'default';
        }
    };

    // Estados para el cambio de estado del ticket
    const { data: statusData, setData: setStatusData, patch: patchStatus, processing: statusProcessing, errors: statusErrors } = useForm({
        estado: ticket.estado,
    });

    const handleStatusChange = (newStatus) => {
        setStatusData('estado', newStatus);
        // Usar patch para actualizar el estado del ticket vía API
        // Inertia.patch o axios.patch dependiendo de si es una acción completa de Inertia o solo API
        // Como es solo un cambio de estado, axios es más ligero
        axios.put(route('api.tickets.update', { ticket: ticket.id }), { estado: newStatus })
            .then(response => {
                setTicket(prevTicket => ({ ...prevTicket, estado: response.data.estado, updated_at: response.data.updated_at }));
                // Podríamos mostrar una notificación de éxito
            })
            .catch(error => {
                console.error("Error al actualizar estado:", error);
                // Manejar errores, por ejemplo, revirtiendo el estado en la UI o mostrando un mensaje
                setStatusData('estado', ticket.estado); // Revertir si falla
            });
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" component="h2">
                        Detalle del Ticket: {ticket.evento_id}
                    </Typography>
                    <Button component={Link} href={route('tickets.index')} variant="outlined">
                        Volver a la Lista
                    </Button>
                </Box>
            }
        >
            <Head title={`Ticket ${ticket.evento_id}`} />

            <Box sx={{ py: 6, maxWidth: 'lg', marginX: 'auto', paddingX: { xs: 2, sm: 4, lg: 6 } }}>
                <Paper sx={{ p: {xs: 2, md: 4}, borderRadius: 2, boxShadow: 3, mb: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>ID Evento:</Typography>
                            <Typography variant="body1">{ticket.evento_id}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Unidad Asignada:</Typography>
                            <Typography variant="body1">{ticket.unidad ? ticket.unidad.nombre_unidad : 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Estado Actual:</Typography>
                            <Chip label={ticket.estado} color={getStatusChipColor(ticket.estado)} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Cambiar Estado:</Typography>
                            <Box>
                                {['abierto', 'en progreso', 'resuelto'].map(estado => (
                                    <Button
                                        key={estado}
                                        variant={ticket.estado === estado ? "contained" : "outlined"}
                                        onClick={() => handleStatusChange(estado)}
                                        disabled={statusProcessing || ticket.estado === estado}
                                        sx={{ mr: 1, textTransform: 'capitalize' }}
                                        color={getStatusChipColor(estado)}
                                    >
                                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                                    </Button>
                                ))}
                            </Box>
                            {statusErrors.estado && <Typography color="error.main" variant="caption">{statusErrors.estado}</Typography>}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Fecha de Creación:</Typography>
                            <Typography variant="body1">{new Date(ticket.created_at).toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Última Actualización:</Typography>
                            <Typography variant="body1">{new Date(ticket.updated_at).toLocaleString()}</Typography>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ p: {xs: 2, md: 3}, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h6" gutterBottom>Comentarios ({ticket.comentarios ? ticket.comentarios.length : 0})</Typography>
                    <Divider sx={{ mb: 2 }} />

                    {editingComment && (
                        <EditCommentForm
                            comment={editingComment}
                            onSave={handleUpdateComment}
                            onCancel={() => setEditingComment(null)}
                        />
                    )}

                    <List sx={{ maxHeight: 400, overflow: 'auto', mb: 2 }}>
                        {ticket.comentarios && ticket.comentarios.length > 0 ? (
                            ticket.comentarios.map(comentario => (
                                <CommentItem
                                    key={comentario.id}
                                    comentario={comentario}
                                    currentUser={auth.user}
                                    onEdit={setEditingComment}
                                    onDelete={handleDeleteComment}
                                />
                            ))
                        ) : (
                            <Typography sx={{ textAlign: 'center', p: 2, color: 'text.secondary' }}>No hay comentarios aún.</Typography>
                        )}
                    </List>

                    <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Añadir un comentario..."
                            value={data.comentario}
                            onChange={e => setData('comentario', e.target.value)}
                            error={!!errors.comentario}
                            helperText={errors.comentario}
                            multiline
                            minRows={2}
                        />
                        <Button type="submit" variant="contained" color="primary" disabled={processing || !data.comentario.trim()} endIcon={<SendIcon />}>
                            Enviar
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </AuthenticatedLayout>
    );
}
