import React from 'react';
import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogActions,
 Grid,
 Typography,
 Divider,
} from '@mui/material';
import { Button, Chip } from '@heroui/react';

export default function ConflictResolverModal({
 open,
 onClose,
 localData,
 serverData,
 onOverwrite,
 onDiscard,
}) {
 if (!localData || !serverData) return null;

 const fields = [
  { key: 'sellos', label: 'Sellos' },
  { key: 'name_remolque', label: 'Remolque' },
  { key: 'name_dolly', label: 'Dolly' },
  { key: 'observaciones', label: 'Observaciones' },
 ];

 return (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
   <DialogTitle>
    ⚠️ Conflicto de versión
   </DialogTitle>

   <DialogContent>
    <Typography variant="body2" sx={{ mb: 2 }}>
     Este registro fue modificado en otro lugar.
     Elige qué versión conservar.
    </Typography>

    <Divider sx={{ mb: 2 }} />

    <Grid container spacing={2}>
     <Grid item xs={6}>
      <Typography fontWeight="bold">💾 Tus cambios</Typography>
     </Grid>
     <Grid item xs={6}>
      <Typography fontWeight="bold">🖥 Servidor</Typography>
     </Grid>

     {fields.map(({ key, label }) => {
      const localValue = localData[key] ?? '—';
      const serverValue = serverData[key] ?? '—';
      const changed = localValue !== serverValue;

      return (
       <React.Fragment key={key}>
        <Grid item xs={6}>
         <Typography variant="body2">
          <strong>{label}:</strong>{' '}
          {localValue}
          {changed && (
           <Chip
            size="sm"
            color="warning"
            className="ml-2 text-white"
           >
            Modificado
           </Chip>
          )}
         </Typography>
        </Grid>

        <Grid item xs={6}>
         <Typography variant="body2">
          <strong>{label}:</strong>{' '}
          {serverValue}
         </Typography>
        </Grid>
       </React.Fragment>
      );
     })}
    </Grid>
   </DialogContent>

   <DialogActions>
    <Button
     color="danger"
     radius="full"
     className="text-white"
     onPress={onDiscard}
    >
     Descartar mis cambios
    </Button>

    <Button
     color="success"
     radius="full"
     className="text-white"
     onPress={onOverwrite}
    >
     Sobreescribir servidor
    </Button>
   </DialogActions>
  </Dialog>
 );
}
