import { useTitle } from 'ahooks';
import React from 'react';

import ChartCard from '@/components/ChartCard';
import ClassCard from '@/components/ClassCard';
import CountCard from '@/components/CountCard';
import NoticeCard from '@/components/NoticeCard';
import TagCard from '@/components/TagCard';
import {
  selectArticle
} from '@/redux/selectors';
import { setArticleCount } from '@/redux/slices/articles';
import { _ } from '@/utils/cloudBase';
import { siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';

import s from './index.module.scss';

const Home: React.FC = () => {
  useTitle(siteTitle);
  const countCards = [
    {
      DBName: DB.Article,
      where: { post: _.eq(true) },
      selector: selectArticle,
      reducer: setArticleCount
    }
  ];

  return (
    <>
      {/* 统计卡片区 */}
      <div className={s.countCardContainer}>
        {countCards.map(({ DBName, where = {}, selector, reducer }, index) => (
          <CountCard
            key={index}
            DBName={DBName}
            where={where}
            selector={selector}
            reducer={reducer}
          />
        ))}
      </div>
      {/* 扇形图、分类、标签、公告 */}
      <div className={s.homeBigContainer}>
        <div className={s.chartContainer}>
          <ChartCard />
        </div>
        <div className={s.classesContainer}>
          <ClassCard />
        </div>
        <div className={s.tagsNoticeContainer}>
          <div className={s.noticeContainer} >
            <NoticeCard />
          </div>
          <div className={s.tagsContainer}>
            <TagCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
