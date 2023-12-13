import { Chart, Pie } from '@ant-design/plots';
import { IconLoading } from '@arco-design/web-react/icon';
import classNames from 'classnames';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useCountListArticleTag } from '@/services/article';

import s from './index.module.scss';

const ChartCard: React.FC = () => {

  const { data: countListArticleTag, isLoading } = useCountListArticleTag();
  const navigate = useNavigate();

  const config = {
    data: countListArticleTag,
    angleField: 'count',
    colorField: 'tag',
    paddingRight: 80,
    paddingTop: 80,
    paddingBottom: 40,
    innerRadius: 0.6,
    label: {
      text: (d) => `${d.tag} - ${d.count}`,
      position: 'spider',
      connectorStroke: 'black',
      line: false,
      style: {
        fontSize: 14,
        fontWeight: 'bold'
      },
      transform: [
        {
          type: 'overlapDodgeY'
        }
      ]
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5
      }
    },
    onReady: ({ chart }: Chart)=> {
      // chart.on('interval:pointerover', (event) => alert('pointerover'));
      // chart.on('interval:pointerout', (event) => alert('pointerout'));
      chart.on('interval:click', (event) => {
        console.log(123, event);
        const classText = event.data.data.tag;
        navigate(`/admin/article?searchTag=${encodeURIComponent(classText)}`);
      });
    }
  };

  return (
    <div className={classNames(s.chartBox, { [s.loadingCenter]: isLoading })}>
      <div className={s.chartTitle}>文章概览</div>
      {isLoading ? (
        <IconLoading className={s.loading} />
      ) : (
        <Pie {...config} />
      )}
    </div>
  );
};

export default ChartCard;
