import { useMutation, useQuery } from '@tanstack/react-query';

import { service } from '@/http/axios/service';
import { queryClient } from '@/http/tanstack/react-query';
import { globalSuccess } from '@/utils/arcod-extract';
import { QueryResultType } from '@/utils/types';

export interface ArticleInputType {
    id?: number;
    fileName?: string;
    title?: string;
    titleEng?: string;
    content?: string;
    url?: string;
    // get请求时是string，'yyds,awsl'; post请求是数组['yyds','awsl']
    tags?: string | string[];
    classes?: string;
    post?: boolean;
    postedAt?: string;
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
    postedAt?: Date;
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
 * 查询未分类的文章数量
 */
export const useCountNotClassesArticle = () => {
    return useQuery<number>({
        queryKey: ['countNotClassesArticle'], 
        queryFn: () => service.get('/article/countNotClassesArticle').then((res) => res.data)
    })
};

/**
 * 获取md文件数据
 */
export const getMdFileData = (titleEng: string, enabled: boolean) => {
    return useQuery<string>({
        queryKey: ['listArticle', titleEng], 
        queryFn: () => service.get('/article/getMdFileData', { params: { titleEng } }).then((res) => res.data),
        enabled
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