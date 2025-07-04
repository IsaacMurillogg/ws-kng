import React, { useEffect } from 'react';
import { Head, useForm, Link as InertiaLink } from '@inertiajs/react'; // Importar Link as InertiaLink
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Icono opcional

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <Box
        sx={(theme) => ({ // Add theme access for mode check
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            // --- Elegant Background ---
            background: theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #f5f7fa 0%, #e1e8ed 100%)' // Light grey gradient
                : 'linear-gradient(135deg, #232526 0%, #414345 100%)', // Dark grey gradient
            // bgcolor: 'background.default', // Removed plain color
            p: 2,
        })}
        >
            <Head title="¿Olvidaste tu Contraseña?" />

            <Paper
                 elevation={4}
                 sx={(theme) => ({
                     padding: { xs: 3, sm: 5 },
                     width: '100%',
                     maxWidth: '450px',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     borderRadius: '24px',
                     backgroundColor: theme.palette.background.paper,
                     // Optional: Add subtle border matching the background gradient transition
                     // border: `1px solid ${theme.palette.mode === 'light' ? '#e1e8ed' : '#414345'}`,
                 })}
            >
                {/* Botón de Regresar (opción 1: esquina superior) */}
                {/*
                <Button
                    component={InertiaLink}
                    href={route('login')}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        color: 'text.secondary',
                        textTransform: 'none',
                    }}
                >
                    Regresar
                </Button>
                 */}

                 <Box
                     sx={{
                         width: 100, // Ajustado el ancho
                         height: 120, // Ajustado el alto si es necesario
                         // Eliminados alignitems y justifycontent de aquí
                         // mb: 3, // Se puede ajustar el margen
                     }}
                 >
                    <Box
                        component="img"
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            marginTop: '-20px', // Mantenido para ajustar posición
                            objectFit: 'contain', // 'contain' puede ser mejor para logos
                        }}
                        alt="Logo KNG"
                        src="/img/kng.png"
                    />
                 </Box>

                 <Typography variant="h6" component="h1" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                    Recuperar Contraseña
                 </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                    Solo indícanos tu
                    dirección de correo electrónico y te enviaremos un enlace para restablecer
                    la contraseña que te permitirá elegir una nueva.
                </Typography>

                {status && (
                    <Alert severity="success" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
                        {status}
                    </Alert>
                )}

                <Box component="form" onSubmit={submit} noValidate sx={{ width: '100%' }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Correo Electrónico"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        size="medium"
                        sx={(theme) => ({
                           '& .MuiOutlinedInput-root': {
                                borderRadius: '25px',
                                '& fieldset': {
                                    borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
                                },
                                '&:hover fieldset': {
                                     borderColor: theme.palette.text.primary,
                                 },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-error fieldset': {
                                     borderColor: theme.palette.error.main,
                                },
                            },
                        })}
                        InputLabelProps={{ shrink: true }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, width: '100%' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={(theme) => ({
                                py: '10px',
                                px: '25px',
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 600,
                                borderRadius: '30px',
                                backgroundColor: '#642869',
                                color: '#ffffff',
                                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: '#63B32E',
                                    color: '#ffffff',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
                                },
                                '&:active': {
                                    transform: 'translateY(0)',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                                },
                                 '&.Mui-disabled': {
                                     backgroundColor: theme.palette.action.disabledBackground,
                                     color: theme.palette.action.disabled,
                                     boxShadow: 'none',
                                 },
                            })}
                            disabled={processing}
                        >
                            Enviar Enlace
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
