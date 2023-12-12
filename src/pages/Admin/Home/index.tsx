import { Typography } from '@arco-design/web-react';
import Card from '@arco-design/web-react/es/Card';
import Col from '@arco-design/web-react/es/Grid/col';
import Row from '@arco-design/web-react/es/Grid/row';
import { useTitle } from 'ahooks';
import React from 'react';

import data from '@/assets/images/data.png'
import data2 from '@/assets/images/data2.png'
import ChartCard from '@/components/ChartCard';
import ClassCard from '@/components/ClassCard';
import NoticeCard from '@/components/NoticeCard';
import TagCard from '@/components/TagCard';
import { useCountAllArticle } from '@/services/article';
import { useCountAllTag } from '@/services/tag';
import { siteTitle } from '@/utils/constant';

import s from './index.module.scss';

const Home: React.FC = () => {
  useTitle(siteTitle);
  const articleCount = useCountAllArticle();
  const tagCount = useCountAllTag();

  return (
    <>
      {/* 统计卡片区 */}
      <div className={s.countCardContainer}>
        <Row justify="start" className="dashboard-row">
          <Col span={12}>
            <Card
              className={s.article}
              bordered={false}
            >
              <div>
                <Typography.Title heading={6}>文章总量</Typography.Title>
                <Typography.Text>{articleCount}</Typography.Text>
              </div>
              <img src={data} />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              className={s.category}
              bordered={false}
            >
              <div>
                <Typography.Title heading={6}>标签总量</Typography.Title>
                <Typography.Text>{tagCount}</Typography.Text>
              </div>
              <img src={data2} />
            </Card>
          </Col>
        </Row>
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
