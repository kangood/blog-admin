// 导入 React 相关库和组件
import { Input, Message, Popconfirm } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconLoading } from '@arco-design/web-react/icon';
import { useResetState } from 'ahooks';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 导入封装的异步请求和数据库相关操作
import { TagOutputType, useCreateTag, useDeleteTag, useGetAllTag, useUpdateTag } from '@/services/tag';
import { DB } from '@/utils/dbConfig';

// 导入自定义组件
import CustomModal from '../CustomModal';
import { useColor } from './config';
import s from './index.scss';

const { Search } = Input;

const TagCard: React.FC = () => {
  // React Router 导航钩子
  const navigate = useNavigate();

  // 颜色常量
  const { tagColor, colorLen } = useColor();

  // 本地状态管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState<number>();
  const [tag, setTag] = useState('');
  const [newTag, setNewTag, resetNewTag] = useResetState('');

  // API hooks
  const { tagList, isLoading } = useGetAllTag();
  const { mutateAsync: deleteMutateAsync } = useDeleteTag();
  const { mutateAsync: createMutateAsync } = useCreateTag();
  const { mutateAsync: updateMutateAsync } = useUpdateTag();

  // 判断标签是否存在
  const isExist = (
    content: string,
    tagList: TagOutputType[]
  ) => {
    return tagList.some(item => item.content === content);
  };

  // 打开编辑标签的弹窗
  const openModal = (id: number) => {
    setIsModalOpen(true);
    setId(id);
    for (const tag of tagList) {
      if (id === tag.id) {
        setTag(tag.content);
        break;
      }
    }
  };

  // 关闭编辑标签的弹窗
  const modalCancel = () => {
    setIsModalOpen(false);
  };

  // 修改标签的确认操作
  const modalOk = () => {
    if (!tag) {
      Message.warning('请输入标签名称~');
      return;
    }
    if (isExist(tag, tagList)) {
      Message.warning('标签名称已存在~');
      return;
    }
    // 执行更新并关闭窗口
    updateMutateAsync({ id, content: tag });
    modalCancel();
  };

  // 添加新标签的操作
  const addNewTag = () => {
    if (!newTag) {
      Message.warning('请输入标签名称~');
      return;
    }
    if (isExist(newTag, tagList)) {
      Message.warning('标签名称已存在~');
      return;
    }
    // 执行新建并重置输入框
    createMutateAsync({ content: newTag });
    resetNewTag();
  };

  // 删除标签的操作
  const deleteTag = (id: number) => {
    deleteMutateAsync([id]);
  };

  // 点击标签跳转到相关文章页面
  const toArticle = (tag: string) => {
    navigate(`/admin/article?searchTag=${encodeURIComponent(tag)}`);
  };

  return (
    <>
      <div className={s.cardBox}>
        <div className={s.title}>标签</div>
        {/* 新建标签的搜索框 */}
        <Search
          size='default'
          allowClear
          placeholder='新建标签'
          searchButton='创建'
          value={newTag}
          onChange={(value: string) => setNewTag(value)}
          onSearch={addNewTag}
        />
        <div className={classNames(s.tagsBox, { [s.tagLoading]: isLoading })}>
          {/* 标签列表 */}
          {isLoading ? (
            <IconLoading />
          ) : (
            tagList.map(
              (tag: TagOutputType, index: number) => (
                <div
                  key={tag.id}
                  className={s.tagItem}
                  style={{ backgroundColor: tagColor[index % colorLen] }}
                  onDoubleClick={() => toArticle(tag.content)}
                >
                  {tag.content}
                  {/* 编辑标签的按钮 */}
                  <IconEdit className={s.iconBtn} onClick={() => openModal(tag.id)} />
                  {/* 删除标签的确认框 */}
                  <Popconfirm
                    position='br'
                    title={`确定要删除「${tag.content}」吗？`}
                    onOk={() => deleteTag(tag.id)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <IconDelete className={s.iconBtn} />
                  </Popconfirm>
                </div>
              )
            )
          )}
        </div>
      </div>
      {/* 编辑标签的弹窗 */}
      <CustomModal
        isEdit={true}
        isModalOpen={isModalOpen}
        DBType={DB.Tag}
        modalOk={modalOk}
        modalCancel={modalCancel}
        render={() => (
          <Input size='default' value={tag} onChange={value => setTag(value)} />
        )}
      />
    </>
  );
};

export default TagCard;
