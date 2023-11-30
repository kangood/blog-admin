import merge from 'deepmerge';
import { ConfigEnv, UserConfig } from 'vite';

import { createPlugins } from './plugins';
import { Configure } from './types';
import { pathResolve } from './utils';

export const createConfig = (params: ConfigEnv, configure?: Configure): UserConfig => {
    const isBuild = params.command === 'build';
    return merge<UserConfig>(
        {
            resolve: {
                alias: {
                    '@': pathResolve('src')
                }
            },
            css: {
                modules: {
                    localsConvention: 'camelCaseOnly'
                }
            },
            plugins: createPlugins(isBuild),
            server: {
                host: '0.0.0.0',
                port: 6602,
                proxy: {
                    '/api': {
                        target: 'http://127.0.0.1:6601',
                        changeOrigin: true
                    }
                }
            },
            // 生产端口
            preview: {
                port: 6602
            }
        },
        typeof configure === 'function' ? configure(params, isBuild) : {},
        {
            arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s]))
        }
    );
};
