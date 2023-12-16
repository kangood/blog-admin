import axios from 'axios';
import { isNil } from 'lodash';

import { globalError } from '@/utils/arcod-extract';

// 保存环境变量
const isPrd = process.env.NODE_ENV === 'production';

// 区分开发环境还是生产环境基础URL
export const basicUrl = isPrd ? 'https://admin.kangod.top' : 'http://127.0.0.1:6601';

// 设置axios的额外配置
export const service = axios.create({
    baseURL: `${basicUrl}/api`
});
// 拦截请求处理
service.interceptors.request.use(async (params) => {
    // 添加token
    // if (FetcherStore.getState().token && typeof window !== 'undefined') {
    //     params.headers.set('Authorization', `Bearer ${FetcherStore.getState().token}`);
    // }
    return params;
});
// 拦截响应处理
service.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        // if (import.meta.env.DEV) console.log('respError', error);
        if (!isNil(error.response))
            switch (error.response.status) {
                case 401: {
                    // 如果响应401就把原本的FetcherStore数据设置为空，好让页面跳至登录页
                    // FetcherStore.setState((state) => {
                    //     state.token = null;
                    // });
                    break;
                }
                default:
                    globalError(error);
                    break;
            }
        return Promise.reject(error);
    }
);
