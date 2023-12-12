import { useResetState, useTitle } from 'ahooks';
import React, { useState } from 'react';

import CustomModal from '@/components/CustomModal';
import ImgView from '@/components/ImgView';
import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { ProjectInputType, useCreateProject, useDeleteProject, uselistProject, useUpdateProject } from '@/services/project';
import { showPageSize, siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { usePage } from '@/utils/hooks/usePage';

import { Title } from '../titleConfig';
import { useColumns } from './config';

const Show: React.FC = () => {
  useTitle(`${Title.Show} | ${siteTitle}`);

  const { page, setPage } = usePage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // 定义表格字段的状态，用于编辑时 "手动" 填充值，也方面后续修改
  const [id, setId, resetId] = useResetState(0);
  const [sortValue, setSortValue, resetSortValue] = useResetState('');
  const [title, setTitle, resetTitle] = useResetState('');
  const [description, setDescription, resetDescription] = useResetState('');
  const [imgSrc, setImgSrc, resetImgSrc] = useResetState('');
  const [href, setHref, resetHref] = useResetState('');
  const [techStack, setTechStack, resetTechStack] = useResetState<string[]>([]);

  // 图片展示
  const [imgUrl, setImgUrl] = useState('');
  const [isViewShow, setIsViewShow] = useState(false);

  // API hooks
  const { data, isLoading } = uselistProject();
  const { mutateAsync: createMutateAsync } = useCreateProject();
  const { mutateAsync: updateMutateAsync } = useUpdateProject();
  const { mutateAsync: deleteMutateAsync } = useDeleteProject();

  // 数据过滤器，用于编辑时 modal 窗口的数据填充和更新
  const dataFilter = [
    {
      text: '序号',
      data: sortValue,
      setData: setSortValue,
      reSet: resetSortValue,
      require: true
    },
    {
      text: '名称',
      data: title,
      setData: setTitle,
      reSet: resetTitle,
      require: true
    },
    {
      text: '描述',
      data: description,
      setData: setDescription,
      reSet: resetDescription,
      require: true
    },
    {
      text: '封面',
      data: imgSrc,
      setData: setImgSrc,
      reSet: resetImgSrc,
      require: true
    },
    {
      text: '链接',
      data: href,
      setData: setHref,
      reSet: resetHref,
      require: true
    },
    {
      text: '技术栈',
      data: techStack,
      setData: setTechStack,
      reSet: resetTechStack,
      require: true,
      selectOptions: [
        'Python',
        'TypeScript',
        'JavaScript',
        'Java',
        'React',
        'NextJS',
        'Svelte',
        'TensorFlow',
        'PyTorch',
        'Streamlit',
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Firebase',
        'FastAPI',
        'Docker',
        'Git',
        'Prisma',
        'Drizzle',
        'TailwindCSS',
        'ShadcnUI',
        'Vite',
        'AntDesign',
        'TanStackQuery'
      ]
    }
  ];

  const clearData = () => {
    for (const { reSet } of dataFilter) {
      reSet();
    }
    resetId();
  };

  const modalCancel = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    clearData();
  };

  const handleEdit = (id: number) => {
    setIsModalOpen(true);
    setIsEdit(true);
    setId(id);
    for (const item of data!.items) {
      if (id === item.id) {
        setTitle(item.title);
        setImgSrc(item.imgSrc || '');
        setDescription(item.description || '');
        setHref(item.href || '');
        setTechStack(item.techStack || []);
        setSortValue(item.sortValue?.toString() || '');
        break;
      }
    }
  };

  const handleDelete = (id: number) => {
    deleteMutateAsync([id]);
  }

  const columns = useColumns({
    handleEdit,
    handleDelete,
    deleteProps: {
      page,
      setPage
    },
    onClickImg: (url: string) => {
      setIsViewShow(true);
      setImgUrl(url);
    }
  });

  const handleModalOk = () => {
    const data: ProjectInputType = { sortValue: Number(sortValue), title, description, imgSrc, href };
    if (isEdit) {
      data.id = id;
      updateMutateAsync(data);
    } else {
      createMutateAsync(data);
    }
    setIsModalOpen(false);
    clearData();
  };

  return (
    <>
      <PageHeader text='添加项目' onClick={() => setIsModalOpen(true)} />
      <MyTable
        loading={isLoading}
        columns={columns}
        data={data?.items || []}
        total={data?.meta?.totalItems || 0}
        page={page}
        pageSize={showPageSize}
        setPage={setPage}
      />
      <CustomModal
        isEdit={isEdit}
        isModalOpen={isModalOpen}
        DBType={DB.Show}
        modalOk={handleModalOk}
        modalCancel={modalCancel}
        dataFilter={dataFilter}
      />
      <ImgView
        isViewShow={isViewShow}
        viewUrl={imgUrl}
        onClick={() => setIsViewShow(false)}
      />
    </>
  );
};

export default Show;
