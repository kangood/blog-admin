import { Button, Message } from '@arco-design/web-react';
import { useTitle } from 'ahooks';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import MarkDown from '@/components/MarkDown';
import PageHeader from '@/components/PageHeader';
import { useUpdateAboutInfo } from '@/services/article';
import { siteTitle } from '@/utils/constant';
import { useScrollSync } from '@/utils/hooks/useScrollSync';

import { Title } from '../titleConfig';
import s from './index.module.scss';

const AboutEdit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync } = useUpdateAboutInfo();
  // 屏幕滚动
  const { leftRef, rightRef, handleScrollRun } = useScrollSync();
  // 标题
  const isMe = searchParams.get('me') === '1';
  useTitle(`${isMe ? Title.AboutMe : Title.AboutSite} | ${siteTitle}`);
  // 接收跳转时传递过来的数据
  const contentData: { aboutContent: string, mdxContent: string, isMe: boolean } = location.state;
  const [content, setContent] = useState(contentData.aboutContent);
  // 更新关于信息
  const updateAbout = async () => {
    if (!content) {
        Message.info('请写点什么再更新！');
        return;
    }
    // put isMe
    contentData.isMe = isMe;
    // update aboutContent
    contentData.aboutContent = content;
    await mutateAsync(contentData);
    navigate(`/admin/about?updated=1`);
  };

  // 页头的渲染
  const render = () => (
    <>
      <div className={s.aboutTitle}>关于{isMe ? '我' : '本站'}</div>
      <Button size='large' type='primary' className={s.aboutUpdate} onClick={updateAbout}>
        更新
      </Button>
    </>
  );

  return (
    <>
      <PageHeader text='返回' onClick={() => navigate('/admin/about')} render={render} />
      <div className={s.markedEditBox}>
        <textarea
          ref={leftRef}
          className={classNames(s.markedEdit, s.input)}
          value={content}
          onChange={e => setContent(e.target.value)}
          onScroll={handleScrollRun}
        />
        <MarkDown
          ref={rightRef}
          className={s.markedEdit}
          content={content}
          onScroll={handleScrollRun}
        />
      </div>
    </>
  );
};

export default AboutEdit;
