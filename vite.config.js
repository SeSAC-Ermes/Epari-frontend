import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        // React Refresh 설정 최적화
        fastRefresh: true,
        // Babel 설정 제거 (Vite의 기본 설정 사용)
      })
    ],

    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'terser',
      sourcemap: command === 'serve',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': [
              'react',
              'react-dom',
              'react-router-dom'
            ],
            'excalidraw': ['@excalidraw/excalidraw']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@assets': path.resolve(__dirname, './src/assets')
      }
    },

    server: {
      proxy: {
        '/api': {
          target: 'https://mrw10sc2ic.execute-api.ap-northeast-2.amazonaws.com',
          // target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.error('Proxy Error:', {
                error: err.message,
                path: req.path,
                timestamp: new Date().toISOString()
              });

              res.writeHead(500, {
                'Content-Type': 'application/json',
              });
              res.end(JSON.stringify({ error: 'Proxy Error' }));
            });

            // Authorization 헤더 전달
            proxy.on('proxyReq', (proxyReq, req, res) => {
              if (req.headers.authorization) {
                proxyReq.setHeader('Authorization', req.headers.authorization);
              }
              console.log('Proxy Request:', {
                method: req.method,
                path: req.url,
                hasAuth: !!req.headers.authorization,
                timestamp: new Date().toISOString()
              });
            });

            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Proxy Response:', {
                status: proxyRes.statusCode,
                path: req.url,
                timestamp: new Date().toISOString()
              });
            });
          }
        }
      }
    },

    // Excalidraw 호환성을 위한 process 전역 변수 정의
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(mode)
      },
      'process.platform': JSON.stringify('browser'),
      'process.version': JSON.stringify(''),
      'global': 'globalThis'
    }
  };
});
