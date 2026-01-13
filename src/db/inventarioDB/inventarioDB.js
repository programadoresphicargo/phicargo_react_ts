// inventarioDB.js
import Dexie from 'dexie';

export const inventarioDB = new Dexie('inventarioDB');

inventarioDB.version(3).stores({
 contenedores: `
   id,
   id_checklist,
   pending_sync,
   sync_action,
   updated_at
 `,
 trailers: 'id, name',
 dollies: 'id, name',
}).upgrade(async (tx) => {
 await tx.contenedores.toCollection().modify(row => {
  if (row.pending_sync === undefined) row.pending_sync = false;
  if (row.sync_action === undefined) row.sync_action = null;
  if (!row.updated_at) row.updated_at = new Date().toISOString();
 });
});

