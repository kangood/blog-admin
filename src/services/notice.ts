import { useMutation, useQuery } from '@tanstack/react-query';

import { service } from '@/http/axios/service';
import { queryClient } from '@/http/tanstack/react-query';
import { globalSuccess } from '@/utils/arcod-extract';
import { QueryResultType } from '@/utils/types';

export interface NoticeInputType {
    id?: number;
    content?: string;
}

export interface NoticeOutputType {
    id?: number;
    content?: string;
    state?: boolean;
    deletedAt?: Date;
    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    updatedBy?: number;
}

/**
 * 查询第一条
 */
export const useGetFirstNotice = () => {
    const { data, isLoading } = useQuery<QueryResultType<NoticeOutputType>>({
        queryKey: ['listNotice'], 
        queryFn: () => service.get('/notice', { params: { "limit": 1 } }).then((res) => res.data)
    })
    return {
        noticeContent: data ? data?.items[0]?.content : '',
        isLoading
    };
};

/**
 * 新建
 */
export const useCreateNotice = () => {
    return useMutation({
        mutationFn: async (params: NoticeInputType) => service.post('/notice', { ...params }),
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries({queryKey: ['listNotice']});
        }
    });
};
