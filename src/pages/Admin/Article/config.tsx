import { Button, Popconfirm, Tag } from '@arco-design/web-react';
import dayjs from 'dayjs';
import React from 'react';

import TableTag from '@/components/TableTag';
import { ArticleOutputType } from '@/services/article';

interface Props {
  handleEdit: (record: ArticleOutputType) => void;
  handleDelete: (id: number) => void;
}

export const useColumns = ({
  handleEdit,
  handleDelete
}: Props) => [
  {
    title: '标题',
    dataIndex: 'title',
    render: (title: string) => <strong>{title}</strong>
  },
  {
    title: '发布时间',
    dataIndex: 'postedAt',
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
          onOk={() => handleDelete(record.id)}
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
