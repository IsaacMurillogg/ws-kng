import React, { useEffect, useState } from 'react';
import { Head, Link as InertiaLink, useForm } from '@inertiajs/react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import {IconButton,InputAdornment} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';


export default function Login({ status, canResetPassword }) {
    const theme = useTheme();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, [reset]);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const kngPurple = '#642869';
    const kngGreen = '#63B32E';

    // Dentro de tu componente, antes del return
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault(); // Para evitar que el input pierda el foco
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.mode === 'light'
                    ? `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(100, 40, 105, 0.15), transparent),
                       linear-gradient(160deg, #eef2f7 0%, #d8e1e8 100%)`
                    : `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(180, 120, 185, 0.2), transparent),
                       linear-gradient(160deg, #2a2d2f 0%, #1e1f21 100%)`,
                p: { xs: 2, sm: 3 },
                overflow: 'hidden',
            }}
        >
            <Head title="Iniciar Sesión" />

            <Paper
                elevation={0}
                sx={{
                    padding: { xs: 3, sm: 4, md: 5 },
                    width: '100%',
                    maxWidth: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: '20px',
                    backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(255, 255, 255, 0.7)'
                        : 'rgba(30, 30, 35, 0.6)',
                    backdropFilter: 'blur(12px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(12px) saturate(150%)',
                    border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(209, 213, 219, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                    boxShadow: theme.palette.mode === 'light'
                        ? '0px 8px 32px rgba(100, 40, 105, 0.1)'
                        : '0px 8px 32px rgba(0, 0, 0, 0.2)',
                }}
            >
                <Box
                    sx={{
                        width: { xs: 70, sm: 80 },
                        height: { xs: 70, sm: 80 },
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        component="img"
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                        }}
                        alt="Logo KNG"
                        src="/img/kng.png"
                    />
                </Box>

                <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                        mb: 1,
                        fontWeight: 700,
                        color: 'text.primary',
                    }}
                >
                    Bienvenido
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }} align="center">
                    Ingresa tus credenciales para acceder a KNG.
                </Typography>

                {status && (
                    <Alert severity="success" variant="filled" sx={{ width: '100%', mb: 2, borderRadius: '12px' }}>
                        {status}
                    </Alert>
                )}
                 {errors.email && !status && (
                    <Alert severity="error" variant="outlined" sx={{ width: '100%', mb: 2, borderRadius: '12px' }}>
                        {errors.email}
                    </Alert>
                )}


                <Box component="form" onSubmit={submit} noValidate sx={{ width: '100%', mt: 1 }}>
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
                        error={!!errors.email && !status}
                        helperText={!status && errors.email}
                        size="medium"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                '&.Mui-focused fieldset': {
                                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
                                },
                            },
                        }}
                        InputLabelProps={{ shrink: true }}
                    />
                   <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        // El 'type' ahora depende del estado 'showPassword'
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        size="medium"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                '&.Mui-focused fieldset': {
                                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
                                },
                            },
                        }}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        // --- FIN DE LA NUEVA SECCIÓN ---
                    />

                    <Grid container alignItems="center" justifyContent="space-between" sx={{ mt: 1, mb: 2.5 }}>
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        color="primary" // Usará el color primario del tema
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        name="remember"
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                    />
                                }
                                label={<Typography variant="body2" color="text.secondary">Recuérdame</Typography>}
                            />
                        </Grid>
                        <Grid item>

                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={processing}
                        sx={{
                            py: '12px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: '12px',
                            textTransform: 'none',
                            backgroundColor: kngPurple,
                            color: '#ffffff',
                            boxShadow: `0 4px 12px ${kngPurple}4D`,
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                backgroundColor: kngGreen,
                                boxShadow: `0 6px 16px ${kngGreen}59`,
                                transform: 'scale(1.02)',
                            },
                            '&:active': {
                                transform: 'scale(0.99)',
                                boxShadow: `0 3px 8px ${kngGreen}4D`,
                            },
                            '&.Mui-disabled': {
                                backgroundColor: 'action.disabledBackground',
                                color: 'action.disabled',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        {processing ? 'Verificando...' : 'Entrar'}
                    </Button>
                </Box>
            </Paper>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                KNG Plafatorma de Rastreo &copy; {new Date().getFullYear()}
                <br />
            </Typography>
        </Box>
    );
}
