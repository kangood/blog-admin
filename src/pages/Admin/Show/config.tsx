import { Button, Popconfirm } from '@arco-design/web-react';
import React from 'react';

import TableTechStack from '@/components/TableTechStack';
import { DeleteProps } from '@/utils/hooks/useTableData';

import s from './index.module.scss';

interface Props {
  handleEdit: (id: number) => void;
  handleDelete: (id: number, props: DeleteProps) => void;
  deleteProps: DeleteProps;
  onClickImg: (url: string) => void;
}

export const useColumns = ({
  handleEdit,
  handleDelete,
  deleteProps,
  onClickImg
}: Props) => [
  {
    title: '序号',
    dataIndex: 'sortValue'
  },
  {
    title: '封面',
    dataIndex: 'imgSrc',
    render: (url: string) => (
      <div className={s.tableCoverBox}>
        {url &&
          <img
            src={url}
            alt='cover'
            className={s.tableCover}
            onClick={() => onClickImg(url)}
          />
        }
      </div>
    )
  },
  {
    title: '名称',
    dataIndex: 'title'
  },
  {
    title: '描述',
    dataIndex: 'description'
  },
  {
    title: '技术栈',
    dataIndex: 'techStack',
    render: (techStacks: string[]) => <TableTechStack techStacks={techStacks} />,
    width: 300
  },
  {
    title: '操作',
    render: (_: any, { id, href }: { id: number; href: string }) => (
      <>
        <Button
          type='primary'
          style={{ marginRight: 10 }}
          onClick={() => window.open(href)}
        >
          查看
        </Button>
        <Button
          style={{ marginRight: 10 }}
          type='primary'
          onClick={() => handleEdit(id)}
        >
          编辑
        </Button>
        <Popconfirm
          position='br'
          title='确定要删除该作品吗？'
          onOk={() => handleDelete(id, deleteProps)}
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
