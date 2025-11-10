import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Host amigável para acessar na rede local após adicionar no arquivo hosts.
// Exemplo de entrada em C:\Windows\System32\drivers\etc\hosts :
//   192.168.1.143    app-personal.local
// Isso permite abrir: http://app-personal.local:5173
// A configuração de HMR abaixo garante que o websocket use o mesmo host.
const FRIENDLY_HOST = 'app-personal.local';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      host: FRIENDLY_HOST,
      protocol: 'ws',
      port: 5173,
    },
    origin: `http://${FRIENDLY_HOST}:5173`,
  },
});
