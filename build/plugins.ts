import { vitePluginForArco } from '@arco-plugins/vite-react'
import react from '@vitejs/plugin-react';
import Icons from 'unplugin-icons/vite';
import { PluginOption } from 'vite';

export function createPlugins(isBuild: boolean) {
    const vitePlugins: (PluginOption | PluginOption[])[] = [
        react(),
        Icons({ compiler: 'jsx', jsx: 'react' }),
        vitePluginForArco()
    ];
    return vitePlugins;
}
