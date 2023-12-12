import { useMutation, useQuery } from '@tanstack/react-query';

import { service } from '@/http/axios/service';
import { queryClient } from '@/http/tanstack/react-query';
import { globalSuccess } from '@/utils/arcod-extract';
import { QueryResultType } from '@/utils/types';

export interface TagInputType {
    id?: number;
    content: string;
    trash?: boolean;
}

export interface TagOutputType {
    id: number;
    content: string;
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
 * 查询所有
 */
export const useGetAllTag = () => {
    const { data, isLoading } = useQuery<QueryResultType<TagOutputType>>({
        queryKey: ['listTag'], 
        queryFn: () => service.get('/tag', { params: { "limit": 1000 } }).then((res) => res.data)
    })
    return {
        tagList: data ? data?.items : [],
        tagIsLoading: isLoading
    };
};

/**
 * 查询标签的总数量
 */
export const useCountAllTag = () => {
    const { data } = useQuery<QueryResultType<TagOutputType>>({
        queryKey: ['listTag'], 
        queryFn: () => service.get('/tag').then((res) => res.data)
    })
    return data?.meta.totalItems;
}

/**
 * 新建
 */
export const useCreateTag = () => {
    return useMutation({
        mutationFn: async (params: TagInputType) => service.post('/tag', { ...params }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({ queryKey: ['listTag'] });
        }
    });
};

/**
 * 更新
 */
export const useUpdateTag = () => {
    return useMutation({
        mutationFn: async (params: TagInputType) => service.patch('/tag', { ...params }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({ queryKey: ['listTag'] });
        }
    });
};

/**
 * 批量删除
 */
export const useDeleteTag = () => {
    return useMutation({
        mutationFn: async (ids: number[]) => service.delete('/tag', { data: { ids, trash } }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({ queryKey: ['listTag'] });
        }
    });
};