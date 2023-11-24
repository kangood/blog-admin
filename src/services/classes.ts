import { useMutation, useQuery } from '@tanstack/react-query';

import { service } from '@/http/axios/service';
import { queryClient } from '@/http/tanstack/react-query';
import { globalSuccess } from '@/utils/arcod-extract';
import { QueryResultType } from '@/utils/types';

export interface ClassesInputType {
    id?: number;
    content: string;
    trash?: boolean;
}

export interface ClassesOutputType {
    id: number;
    content: string;
    state?: boolean;
    deletedAt?: Date;
    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    updatedBy?: number;
}

export interface ArticleClassesCountType {
    // 分类ID，关联字段
    classesId: number;
    // 分类名称
    classesName: string;
    // sql count(*) 数量，非数据库字段
    count: number;
}

// 开启软删除功能
const trash = true;

/**
 * 查询所有
 */
export const useGetAllClasses = () => {
    const { data, isLoading } = useQuery<QueryResultType<ClassesOutputType>>({
        queryKey: ['listClasses'], 
        queryFn: () => service.get('/classes', { params: { "limit": 1000 } }).then((res) => res.data)
    })
    return {
        classesList: data ? data?.items : [],
        classesIsLoading: isLoading
    };
};

/**
 * 分组查询各个分类对应文章数量
 */
export const useCountListArticleClasses = () => {
    return useQuery<ArticleClassesCountType[]>({
        queryKey: ['countListArticleClasses'], 
        queryFn: () => service.get('/classes/countListArticleClasses').then((res) => res.data)
    })
};

/**
 * 新建
 */
export const useCreateClasses = () => {
    return useMutation({
        mutationFn: async (params: ClassesInputType) => service.post('/classes', { ...params }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({ queryKey: ['countListArticleClasses'] });
        }
    });
};

/**
 * 更新
 */
export const useUpdateClasses = () => {
    return useMutation({
        mutationFn: async (params: ClassesInputType) => service.patch('/classes', { ...params }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({ queryKey: ['countListArticleClasses'] });
        }
    });
};

/**
 * 批量删除
 */
export const useDeleteClasses = () => {
    return useMutation({
        mutationFn: async (ids: number[]) => service.delete('/classes', { data: { ids, trash } }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({ queryKey: ['countListArticleClasses'] });
        }
    });
};