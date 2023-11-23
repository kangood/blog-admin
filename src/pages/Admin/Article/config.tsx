import { Button, Popconfirm, Tag } from '@arco-design/web-react';
import dayjs from 'dayjs';
import React from 'react';

import TableTag from '@/components/TableTag';
import { ArticleOutputType } from '@/services/article';
import { DeleteProps } from '@/utils/hooks/useTableData';

interface Props {
  showSearchData: boolean;
  handleEdit: (record: ArticleOutputType) => void;
  handleDelete?: (id: number, props: DeleteProps) => void;
  handleDeleteSearch: (id: number, props: DeleteProps) => void;
  deleteProps: DeleteProps;
}

export const useColumns = ({
  handleEdit,
  handleDelete,
  deleteProps,
  showSearchData,
  handleDeleteSearch
}: Props) => [
  {
    title: '标题',
    dataIndex: 'title',
    render: (title: string) => <strong>{title}</strong>
  },
  {
    title: '发布时间',
    dataIndex: 'createdAt',
    render: (timeLine: string) => <>{dayjs(timeLine).format('YYYY-MM-DD HH:mm:ss')}</>
  },
  {
    title: '分类',
    dataIndex: 'classes',
    render: (classText: string) => (
      <>{classText ? <Tag color='#2db7f5'>{classText}</Tag> : null}</>
    )
  },
  {
    title: '标签',
    dataIndex: 'tags',
    render: (tags: string[]) => <TableTag tags={tags} />
  },
  {
    title: '操作',
    render: (_: any, record: ArticleOutputType) => (
      <>
        <Button
          type='primary'
          style={{ marginRight: 10 }}
          onClick={() => window.open(record.url)}
        >
          查看
        </Button>
        <Button
          type='primary'
          style={{ marginRight: 10 }}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>
        <Popconfirm
          position='br'
          title='确定要删除该文章吗？'
          onOk={() => {
            // showSearchData ? 
              handleDeleteSearch(record.id, deleteProps)
              // : handleDelete(_id, deleteProps);
          }}
          okText='Yes'
          cancelText='No'
        >
          <Button type='primary' status='danger'>
            删除
          </Button>
        </Popconfirm>
      </>
    )
  }
];
