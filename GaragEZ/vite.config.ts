import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000, // 프론트엔드 서버 포트 설정 (리액트 실행 포트)
    proxy: {
      '/api': 'http://localhost:8094', // '/api'로 시작하는 요청은 백엔드 서버(스프링부트)로 프록시
    },
  },
  preview: {
    port: 3000,
  }
});
