import { Input, Message } from '@arco-design/web-react';
import { IconLoading } from '@arco-design/web-react/icon';
import { useResetState } from 'ahooks';
import classNames from 'classnames';
import React, { useState } from 'react';

import { useCreateNotice, useGetFirstNotice } from '@/services/notice';
import { DB } from '@/utils/dbConfig';

import CustomModal from '../CustomModal';
import Emoji from '../Emoji';
import s from './index.module.scss';

const { TextArea } = Input;

const NoticeCard: React.FC = () => {
  // 控制模态框显示和本地公告内容的状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localNotice, setLocalNotice, resetLocalNotice] = useResetState('');

  // 获取和更新公告数据
  const { noticeContent, isLoading } = useGetFirstNotice();
  const { mutateAsync } = useCreateNotice();

  // 打开模态框并设置本地公告状态
  const openModal = () => {
    setIsModalOpen(true);
    setLocalNotice(noticeContent!);
  };

  // 关闭模态框并重置本地公告状态
  const modalCancel = () => {
    setIsModalOpen(false);
    resetLocalNotice();
  };

  // 处理模态框确认
  const modalOk = () => {
    if (!localNotice) {
      Message.warning('请输入公告内容~');
      return;
    }
    mutateAsync({content: localNotice});
    modalCancel();
  }

  // 用于模态框内容的渲染函数
  const render = () => (
    <>
      <TextArea
        placeholder='请输入公告内容'
        maxLength={21 * 4}
        allowClear
        showWordLimit
        value={localNotice}
        onChange={value => setLocalNotice(value)}
        autoSize={false}
        style={{
          height: 100,
          resize: 'none'
        }}
      />
      <Emoji style={{ marginTop: 10 }} />
    </>
  );

  // 主组件渲染
  return (
    <>
      <div className={s.cardBox}>
        <div className={s.title}>公告</div>
        <div
          className={classNames(s.noticeText, { [s.loading]: isLoading })}
          onClick={openModal}
        >
          {isLoading ? <IconLoading /> : noticeContent}
        </div>
      </div>
      <CustomModal
        isEdit={true}
        isModalOpen={isModalOpen}
        DBType={DB.Notice}
        modalOk={modalOk}
        modalCancel={modalCancel}
        render={render}
      />
    </>
  );
};

export default NoticeCard;
