import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox'; // Asumiendo que quieres usar el Checkbox existente
import PrimaryButton from '@/Components/PrimaryButton'; // Asumiendo PrimaryButton
// Importar componentes de Material UI si se usan consistentemente como en Login.jsx
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Button, Box } from '@mui/material';

export default function Index({ auth, tickets }) {
    // tickets es un array de objetos ticket pasados desde el controlador Laravel
    // auth contiene la información del usuario autenticado

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'abierto':
                return 'error'; // Rojo para 'abierto'
            case 'en progreso':
                return 'warning'; // Naranja para 'en progreso'
            case 'resuelto':
                return 'success'; // Verde para 'resuelto'
            default:
                return 'default';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Typography variant="h5" component="h2" className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Tickets</Typography>}
        >
            <Head title="Tickets" />

            <Box sx={{ py: 6, maxWidth: 'xl', marginX: 'auto', paddingX: { xs: 2, sm: 4, lg: 6 } }}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                    {auth.user.role === 'admin' && (
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <PrimaryButton onClick={() => Inertia.visit(route('tickets.create'))}> */}
                            {/* Asumimos que la creación de tickets para admin se hace a través de una interfaz que llama a la API */}
                            {/* O se podría tener una página Inertia para crear tickets si se prefiere */}
                            <Button variant="contained" color="primary" component={Link} href="#"> {/* Temporalmente href="#" */}
                                Nuevo Ticket (Admin)
                            </Button>
                        </Box>
                    )}

                    {tickets.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', p: 3 }}>
                            No hay tickets para mostrar.
                        </Typography>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: 'grey.200' } }}>
                                        <TableCell>ID Evento</TableCell>
                                        <TableCell>Unidad Asignada</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Creado</TableCell>
                                        <TableCell>Última Actualización</TableCell>
                                        <TableCell align="right">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tickets.map((ticket) => (
                                        <TableRow
                                            key={ticket.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'grey.100' } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {ticket.evento_id}
                                            </TableCell>
                                            <TableCell>{ticket.unidad ? ticket.unidad.nombre_unidad : 'N/A'}</TableCell>
                                            <TableCell>
                                                <Chip label={ticket.estado} color={getStatusChipColor(ticket.estado)} size="small" />
                                            </TableCell>
                                            <TableCell>{new Date(ticket.created_at).toLocaleString()}</TableCell>
                                            <TableCell>{new Date(ticket.updated_at).toLocaleString()}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    component={Link}
                                                    href={route('tickets.show', ticket.id)}
                                                >
                                                    Ver Detalles
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Box>
        </AuthenticatedLayout>
    );
}
