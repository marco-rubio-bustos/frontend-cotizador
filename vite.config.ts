import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// Función para cargar variables de entorno según el modo
export default defineConfig(({ mode }) => {
  // Cargar las variables de entorno correctas
  const env = loadEnv(mode, process.cwd());

  return {
    base: mode === 'production' ? '/cotizador' : '/',
    plugins: [react()],
    server: {
      port: 5173,
    },
    define: {
      VITE_LOCALHOST_URL: JSON.stringify(env.VITE_LOCALHOST_URL),
      VITE_API_URL: JSON.stringify(env.VITE_API_URL),
      VITE_FRONT_URL: JSON.stringify(env.VITE_FRONT_URL),
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  };
});
