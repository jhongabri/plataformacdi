# TODO: Fix asignar grupo a docentes desde admin panel - ✅ COMPLETADO

## Cambios realizados:
1. ✅ Created TODO.md
2. ✅ Fixed API call in AdminDashboard.jsx: POST → PUT, correct endpoint `/admin/docentes/asignar-grupo`, body with `id_docente` and `id_grupo`
3. ✅ Verified axios.js supports PUT requests with auth interceptor

## Para probar:
1. Asegúrate backend corriendo: `cd backend && npm start`
2. Frontend: `cd frontend && npm run dev`
3. Login como admin → Gestión → Docentes → Click "Asignar" en cualquier docente
4. Selecciona grupo → Asignar → Verifica se actualiza "nombre_grupo"

¡Funcionalidad ahora disponible desde panel admin!
