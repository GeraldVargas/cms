# Deploy Guide - GUÍA DE DEPLOY

## 🚀 PASOS PARA DESPLEGAR TU APLICACIÓN

### **1️⃣ PREPARAR EL CÓDIGO (YA LISTO)**
✅ Backend configurado para Vercel
✅ Frontend configurado para Vercel  
✅ Base de datos MongoDB Atlas lista

---

### **2️⃣ DEPLOY DEL BACKEND (Railway)**

#### Opción A: CLI (Recomendado - 2 minutos)
```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Loguarse (se abrirá navegador)
railway login

# 3. Crear proyecto en Railway
cd backg
railway init

# 4. Conectar variables de entorno
railway variables set MONGODB_URI=tu_mongodb_uri
railway variables set JWT_SECRET=tu_jwt_secret
railway variables set NODE_ENV=production

# 5. Deploy
railway up
```

#### Opción B: Dashboard Web
1. Ir a https://railway.app
2. Click en "New Project" → "Deploy from GitHub"
3. Seleccionar tu repositorio
4. Railway detectará automaticamente que es Node.js
5. Agregar variables de entorno en "Variables"
6. Deploy automático

**URL del backend:** Railway te dará una URL pública como:
```
https://tu-app-production.up.railway.app
```

---

### **3️⃣ DEPLOY DEL FRONTEND (Vercel)**

#### Opción A: CLI
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Loguarse
vercel login

# 3. Deploy
cd frong
vercel
```

#### Opción B: Dashboard Web (MÁS FÁCIL)
1. Ir a https://vercel.com
2. Click en "New Project"
3. Importar repositorio de GitHub
4. Seleccionar carpeta: `frong`
5. En "Environment Variables" agregar:
   - `VITE_API_URL` = `https://tu-app-production.up.railway.app`
6. Deploy

**URL del frontend:** Vercel te dará:
```
https://tu-app.vercel.app
```

---

### **4️⃣ ACTUALIZAR URL EN FRONTEND**

Después de tener la URL de Railway, actualiza todas las URLs del backend en:
- `frong/src/pages/Inicio.jsx`
- `frong/src/pages/Noticias.jsx`
- `frong/src/pages/Actividades.jsx`
- `frong/src/pages/PublicCalendario.jsx`

Cambiar:
```javascript
// ❌ Viejo
const r = await axios.get('http://localhost:3000/api/noticias');

// ✅ Nuevo (usar variable de entorno)
const r = await axios.get(`${import.meta.env.VITE_API_URL}/api/noticias`);
```

---

### **5️⃣ CONFIGURACIÓN CORS (IMPORTANTE)**

En `backg/index.js`, actualizar CORS para producción:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://tu-app.vercel.app'  // Tu URL de Vercel
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

---

## 📋 CHECKLIST FINAL

- [ ] Variables de entorno configuradas en Railway
- [ ] Variables de entorno configuradas en Vercel
- [ ] CORS actualizado con URLs reales
- [ ] URLs del frontend apuntando a `import.meta.env.VITE_API_URL`
- [ ] `.env` agregado a `.gitignore`
- [ ] Todo pusheado a GitHub

---

## 🔍 VERIFICAR QUE FUNCIONA

1. Abre tu sitio en Vercel
2. Abre la consola del navegador (F12)
3. Ve a "Network" y recarga
4. Debería ver requests a Railway exitosos (status 200)
5. Las noticias/actividades deben cargar

---

## ⚠️ PROBLEMAS COMUNES

| Problema | Solución |
|----------|----------|
| CORS error | Actualizar `corsOptions` en backend con URL correcta de Vercel |
| 404 en API | Verificar que Railway esté deployado y la URL sea correcta |
| Imágenes no cargan | Las imágenes se guardan en `/uploads`, ese folder debe persistir |
| Variables no se leen | Verificar que están en Vercel/Railway dashboard |

---

## 📞 NOTAS

- Railway ofrece 5 GB/mes gratuito
- Vercel ofrece Hobby plan gratuito (perfecto para desarrollo)
- MongoDB Atlas ofrece 512 MB cluster gratuito
- Total costo inicial: **$0**

¿Necesitas ayuda con algún paso?
