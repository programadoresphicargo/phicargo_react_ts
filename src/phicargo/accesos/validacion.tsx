
import { useEffect, useState } from 'react';
import { Button, InputOtp } from '@heroui/react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { Box, Typography, Divider } from '@mui/material';

import LockIcon from '@mui/icons-material/Lock';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

type Props = {
    id_acceso: number;
    estado_acceso: string;
    open: boolean;
    handleClose: () => void;
};

const Validador: React.FC<Props> = ({
    id_acceso,
    estado_acceso,
    open,
    handleClose,
}) => {
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (open) {
            setPin('');
            setIsLoading(false);
            setIsVerified(false);
        }
    }, [open]);

    const validar_pin = async () => {
        if (isLoading) return;

        if (pin.length !== 4) {
            toast.error('Ingresa tu PIN de 4 dígitos');
            return;
        }

        setIsLoading(true);
        setIsVerified(false);

        try {
            // Verificar PIN
            const response = await odooApi.post('/users/by_pin/' + pin);
            const data = response.data;

            if (!data.id_usuario) {
                toast.error(data.error || 'PIN incorrecto');
                return;
            }

            // Mostrar animación de éxito
            setIsVerified(true);
            toast.success('PIN válido');

            // Dar tiempo para apreciar la animación
            await new Promise(resolve => setTimeout(resolve, 700));

            // Cambiar estado del acceso
            await cambiar_estado(id_acceso, data.id_usuario);

        } catch (error: any) {
            const mensaje =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                'No fue posible verificar el PIN';

            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    const cambiar_estado = async (
        id_acceso: number,
        id_usuario: number
    ) => {
        try {
            let baseUrl = '';

            if (
                estado_acceso === 'espera' ||
                estado_acceso === 'autorizado'
            ) {
                baseUrl = `/accesos/${id_acceso}/accion?accion=validar&id_usuario=${id_usuario}`;
            } else if (
                estado_acceso === 'validado' ||
                estado_acceso === 'rechazado'
            ) {
                baseUrl = `/accesos/${id_acceso}/accion?accion=archivar&id_usuario=${id_usuario}`;
            }

            if (!baseUrl) {
                toast.error('No se reconoce el estado del acceso');
                setIsVerified(false);
                return;
            }

            const response = await odooApi.patch(baseUrl);

            if (response.data.status === 'success') {
                toast.success(response.data.message);
                handleClose();
            } else {
                toast.error(response.data.message);
                setIsVerified(false);
            }

        } catch (error: any) {
            const mensaje =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                'Ocurrió un error inesperado';

            toast.error(mensaje);
            setIsVerified(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={isLoading ? undefined : handleClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    borderRadius: 5,
                    p: { xs: 2.5, sm: 3 },
                    boxShadow: '0 24px 80px rgba(15, 23, 42, 0.16)',
                    backgroundImage: 'none',
                    overflow: 'hidden',
                },
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                >
                    {/* Icono animado */}
                    <Box
                        sx={{
                            width: 76,
                            height: 76,
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            background: isVerified
                                ? 'linear-gradient(145deg, #DCFCE7, #BBF7D0)'
                                : isLoading
                                    ? '#EFF6FF'
                                    : 'linear-gradient(145deg, #E8F1FF, #DCE9FF)',
                            transition: 'all 0.35s ease',
                            mb: 2.5,

                            animation: isLoading
                                ? 'pulse 1.5s ease-in-out infinite'
                                : 'none',

                            '@keyframes pulse': {
                                '0%, 100%': {
                                    transform: 'scale(1)',
                                },
                                '50%': {
                                    transform: 'scale(1.06)',
                                },
                            },
                        }}
                    >
                        {isLoading && !isVerified ? (
                            <>
                                <CircularProgress
                                    size={62}
                                    thickness={2.5}
                                    sx={{
                                        color: '#2563EB',
                                        position: 'absolute',
                                    }}
                                />

                                <LockIcon
                                    sx={{
                                        fontSize: 27,
                                        color: '#2563EB',
                                    }}
                                />
                            </>
                        ) : isVerified ? (
                            <CheckCircleRoundedIcon
                                sx={{
                                    fontSize: 42,
                                    color: '#16A34A',
                                    animation: 'successPop 0.4s ease',

                                    '@keyframes successPop': {
                                        '0%': {
                                            transform: 'scale(0.4)',
                                            opacity: 0,
                                        },
                                        '70%': {
                                            transform: 'scale(1.15)',
                                            opacity: 1,
                                        },
                                        '100%': {
                                            transform: 'scale(1)',
                                            opacity: 1,
                                        },
                                    },
                                }}
                            />
                        ) : (
                            <LockIcon
                                sx={{
                                    fontSize: 32,
                                    color: '#2563EB',
                                }}
                            />
                        )}
                    </Box>

                    {/* Título */}
                    <Typography
                        variant="h5"
                        fontWeight={800}
                        sx={{
                            color: isVerified ? '#15803D' : '#172033',
                            letterSpacing: '-0.7px',
                            mb: 0.8,
                            fontFamily: 'Inter',
                            transition: 'color 0.3s ease',
                        }}
                    >
                        {isVerified
                            ? '¡Identidad confirmada!'
                            : isLoading
                                ? 'Comprobando identidad'
                                : 'Verificación de seguridad'}
                    </Typography>

                    {/* Descripción */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#64748B',
                            maxWidth: 280,
                            lineHeight: 1.7,
                            fontFamily: 'Inter',
                        }}
                    >
                        {isVerified
                            ? 'Tu identidad ha sido verificada. Estamos procesando la operación.'
                            : isLoading
                                ? 'Estamos comprobando tus credenciales. Por favor, espera un momento.'
                                : 'Para continuar con esta operación, confirma tu identidad ingresando tu PIN de seguridad.'}
                    </Typography>

                    <Divider
                        sx={{
                            width: '100%',
                            my: 3,
                            borderColor: '#E9EEF5',
                        }}
                    />

                    {/* PIN */}
                    <Box width="100%">
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            sx={{
                                color: '#334155',
                                mb: 2,
                                fontFamily: 'Inter',
                            }}
                        >
                            INGRESA TU PIN
                        </Typography>

                        <Box
                            display="flex"
                            justifyContent="center"
                            sx={{
                                '& input': {
                                    width: '52px',
                                    height: '58px',
                                    borderRadius: '14px',
                                    border: '1.5px solid #DCE3ED',
                                    backgroundColor: '#F8FAFC',
                                    color: '#172033',
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                },

                                '& input:focus': {
                                    borderColor: '#2563EB',
                                    backgroundColor: '#FFFFFF',
                                    boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.10)',
                                },
                            }}
                        >
                            <InputOtp
                                length={4}
                                value={pin}
                                onValueChange={setPin}
                                size="lg"
                                autoFocus
                                isDisabled={isLoading || isVerified}
                            />
                        </Box>
                    </Box>

                    {/* Estado de validación */}
                    <Box
                        sx={{
                            height: 30,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mt: 2,
                            gap: 1,
                        }}
                    >
                        {isLoading && !isVerified && (
                            <>
                                <CircularProgress
                                    size={14}
                                    thickness={5}
                                />

                                <Typography
                                    variant="caption"
                                    color="primary"
                                    fontWeight={600}
                                    fontFamily={"Inter"}
                                >
                                    Comprobando PIN...
                                </Typography>
                            </>
                        )}

                        {isVerified && (
                            <>
                                <CheckCircleRoundedIcon
                                    sx={{
                                        fontSize: 17,
                                        color: '#16A34A',
                                    }}
                                />

                                <Typography
                                    variant="caption"
                                    fontWeight={600}
                                    sx={{ color: '#16A34A' }}
                                    fontFamily={"Inter"}
                                >
                                    Verificación exitosa
                                </Typography>
                            </>
                        )}
                    </Box>

                    {/* Confidencialidad */}
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={0.8}
                        mt={1}
                    >
                        <LockIcon
                            sx={{
                                fontSize: 14,
                                color: '#94A3B8',
                            }}
                        />

                        <Typography
                            variant="caption"
                            sx={{ color: '#94A3B8', fontFamily: 'Inter' }}
                        >
                            Tu PIN está protegido y es confidencial
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            {/* Acciones */}
            <DialogActions
                sx={{
                    px: 0,
                    pt: 3,
                    pb: 0,
                    gap: 1.5,
                }}
            >
                <Button
                    radius="full"
                    onPress={handleClose}
                    color="default"
                    variant="flat"
                    className="flex-1 font-semibold"
                    size="lg"
                    isDisabled={isLoading}
                >
                    Cancelar
                </Button>

                <Button
                    radius="full"
                    onPress={validar_pin}
                    color={isVerified ? 'success' : 'primary'}
                    size="lg"
                    className="flex-1 font-semibold shadow-md shadow-blue-200"
                    isDisabled={pin.length !== 4 || isLoading}
                    isLoading={isLoading}
                >
                    {isVerified ? 'Verificado' : 'Validar PIN'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Validador;
