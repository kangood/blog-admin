import { Button, Input, Message, Popconfirm } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconLoading } from '@arco-design/web-react/icon';
import { useResetState } from 'ahooks';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCountNotClassesArticle } from '@/services/article';
import { ArticleClassesCountType, useCountListArticleClasses, useCreateClasses, useDeleteClasses, useUpdateClasses } from '@/services/classes';
import { DB } from '@/utils/dbConfig';

import CustomModal from '../CustomModal';
import s from './index.scss';

const { Search } = Input;
const noClassId = 0;

const ClassCard: React.FC = () => {
  // React Router 导航钩子
  const navigate = useNavigate();

  // 本地状态管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState<number>();
  const [oldClassText, setOldClassText] = useState('');
  const [classText, setClassText] = useState('');
  const [newClassText, setNewClassText, resetNewClassText] = useResetState('');

  // 后端 API hooks
  const { data: articleClassesCountList, isLoading: isLoadingA } = useCountListArticleClasses();
  const { data: countNotClassesArticle, isLoading: isLoadingB } = useCountNotClassesArticle();
  const { mutateAsync: deleteMutateAsync } = useDeleteClasses();
  const { mutateAsync: createMutateAsync } = useCreateClasses();
  const { mutateAsync: updateMutateAsync } = useUpdateClasses();

  // 判断分类是否存在
  const isExist = (
    classes: string,
    articleClassesCountList: ArticleClassesCountType[]
  ) => {
    return articleClassesCountList.some(item => item.classesName === classes);
  };

  // 打开编辑分类的弹窗
  const openModal = (id: number) => {
    setIsModalOpen(true);
    setId(id);
    for (const articleClassesCount of articleClassesCountList!) {
      if (id === articleClassesCount.classesId) {
        setClassText(articleClassesCount.classesName);
        setOldClassText(articleClassesCount.classesName);
        break;
      }
    }
  };

  // 关闭编辑分类的弹窗
  const modalCancel = () => {
    setIsModalOpen(false);
  };

  // 修改分类的确认操作
  const modalOk = () => {
    if (!classText) {
      Message.warning('请输入分类名称~');
      return;
    }
    if (isExist(classText, articleClassesCountList!)) {
      Message.warning('分类名称已存在~');
      return;
    }
    // 执行更新并关闭窗口
    updateMutateAsync({ id, content: classText });
    modalCancel();
  };

  // 添加新分类的操作
  const addNewClass = () => {
    if (!newClassText) {
      Message.warning('请输入分类名称~');
      return;
    }
    if (isExist(newClassText, articleClassesCountList!)) {
      Message.warning('分类名称已存在~');
      return;
    }
    // 执行新建并重置输入框
    createMutateAsync({ content: newClassText });
    resetNewClassText();
  };

  // 删除分类的操作
  const deleteClasses = (id: number) => {
    deleteMutateAsync([id]);
  }

  // 点击分类跳转到相关文章页面
  const toArticle = (classText: string) => {
    navigate(`/admin/article?searchClass=${encodeURIComponent(classText)}`);
  };

  return (
    <>
      <div className={s.cardBox}>
        <div className={s.title}>分类</div>
        {/* 新建分类的搜索框 */}
        <Search
          size='default'
          allowClear
          placeholder='新建分类'
          searchButton='创建'
          value={newClassText}
          onChange={(value: string) => setNewClassText(value)}
          onSearch={addNewClass}
        />
        <div className={classNames(s.classesBox, { [s.classLoading]: isLoadingA })}>
          {/* 分类列表 */}
          {isLoadingA && isLoadingB  ? (
            <IconLoading />
          ) : (
            [...articleClassesCountList!, {
              classesId: noClassId,
              classesName: '未分类',
              count: countNotClassesArticle
            }].map((item) => (
                <div key={item.classesId} className={s.classItem}>
                  <div className={s.count}>{item.count}</div>
                  <div className={s.classTextBox}>
                    <div className={s.classText} onClick={() => toArticle(item.classesName)}>
                      {item.classesName}
                    </div>
                  </div>
                  <Button
                    type='primary'
                    className={s.classBtn}
                    icon={<IconEdit />}
                    onClick={() => openModal(item.classesId)}
                    disabled={item.classesId === noClassId}
                  />
                  <Popconfirm
                    position='br'
                    title={`确定要删除《${item.classesName}》吗？`}
                    onOk={() => deleteClasses(item.classesId)}
                    okText='Yes'
                    cancelText='No'
                    disabled={item.classesId === noClassId}
                  >
                    <Button
                      style={{ width: 30, height: 30 }}
                      type='primary'
                      status='danger'
                      className={s.classBtn}
                      icon={<IconDelete />}
                      disabled={item.classesId === noClassId}
                    />
                  </Popconfirm>
                </div>
              )
            )
          )}
        </div>
      </div>
      <CustomModal
        isEdit={true}
        isModalOpen={isModalOpen}
        DBType={DB.Class}
        modalOk={modalOk}
        modalCancel={modalCancel}
        render={() => (
          <Input
            size='default'
            value={classText}
            onChange={value => setClassText(value)}
          />
        )}
      />
    </>
  );
};

export default ClassCard;
