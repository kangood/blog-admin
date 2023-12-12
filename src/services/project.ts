import { useMutation, useQuery } from '@tanstack/react-query';

import { service } from '@/http/axios/service';
import { queryClient } from '@/http/tanstack/react-query';
import { globalSuccess } from '@/utils/arcod-extract';
import { QueryResultType } from '@/utils/types';

export interface ProjectInputType {
    id?: number;
    title: string;
    description?: string;
    href?: string;
    imgSrc?: string;
    techStack?: string[];
    sortValue?: number;
    page?: number;
    limit?: number;
    trash?: boolean;
}

export interface ProjectOutputType {
    id: number;
    title: string;
    description?: string;
    href?: string;
    imgSrc?: string;
    techStack?: string[];
    sortValue?: number;
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
export const uselistProject = (values?: ProjectInputType) => {
    return useQuery<QueryResultType<ProjectOutputType>>({
        queryKey: ['listProject', values], 
        queryFn: () => service.get('/project', { params: values }).then((res) => res.data)
    })
};

/**
 * 新建
 */
export const useCreateProject = () => {
    return useMutation({
        mutationFn: async (params: ProjectInputType) => service.post('/project', { ...params }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({ queryKey: ['listProject'] });
        }
    });
};

/**
 * 更新
 */
export const useUpdateProject = () => {
    return useMutation({
        mutationFn: async (params: ProjectInputType) => service.patch('/project', { ...params }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({ queryKey: ['listProject'] });
        }
    });
};

/**
 * 批量删除
 */
export const useDeleteProject = () => {
    return useMutation({
        mutationFn: async (ids: number[]) => service.delete('/project', { data: { ids, trash } }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({ queryKey: ['listProject'] });
        }
    });
};
