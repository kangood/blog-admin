import { useMutation, useQuery } from '@tanstack/react-query';

import { service } from '@/http/axios/service';
import { queryClient } from '@/http/tanstack/react-query';
import { globalSuccess } from '@/utils/arcod-extract';
import { QueryResultType } from '@/utils/types';

export interface ArticleInputType {
    id?: number;
    fileName?: string;
    title?: string;
    tags?: string;
    classes?: string;
    page?: number;
    limit?: number;
    trash?: boolean;
}

export interface ArticleOutputType {
    id: number;
    title: string;
    titleEng?: string;
    classes?: string;
    url?: string;
    fileName: string;
    tags: string[];
    post?: boolean;
    state?: boolean;
    deletedAt?: Date;
    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    updatedBy?: number;
}

// 开启软删除功能
const trash = true;

/**
 * 分页条件查询
 */
export const useListArticle = (values?: ArticleInputType) => {
    return useQuery<QueryResultType<ArticleOutputType>>({
        queryKey: ['listArticle', values], 
        queryFn: () => service.get('/article', { params: values }).then((res) => res.data)
    })
};

/**
 * 获取md文件数据
 */
export const getMdFileData = (fileName: string) => {
    return useQuery<string>({
        queryKey: ['listArticle', fileName], 
        queryFn: () => service.get('/article/getMdFileData', { params: { fileName } }).then((res) => res.data),
        enabled: !!fileName
    })
};

/**
 * 新建
 */
export const useCreateArticle = () => {
    return useMutation({
        mutationFn: async (params: ArticleInputType) => service.post('/article', { ...params }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({ queryKey: ['listArticle'] });
        }
    });
};

/**
 * 更新
 */
export const useUpdateArticle = () => {
    return useMutation({
        mutationFn: async (params: ArticleInputType) => service.patch('/article', { ...params }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({ queryKey: ['listArticle'] });
        }
    });
};

/**
 * 批量删除
 */
export const useDeleteArticle = () => {
    return useMutation({
        mutationFn: async (ids: number[]) => service.delete('/article', { data: { ids, trash } }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({ queryKey: ['listArticle'] });
        }
    });
};