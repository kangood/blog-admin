import { G2, Pie } from '@antv/g2plot';
import { IconLoading } from '@arco-design/web-react/icon';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCountListArticleTag } from '@/services/article';

import s from './index.module.scss';

const G = G2.getEngine('canvas');

const ChartCard: React.FC = () => {

  const { data: countListArticleTag, isLoading } = useCountListArticleTag();
  const navigate = useNavigate();

  const ref = useRef(null);
  // 首次加载
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    // 拼图的配置
    const cfg = {
      appendPadding: [50, 10, 10, 10],
      data: countListArticleTag,
      angleField: 'count',
      colorField: 'tag',
      radius: 0.8,
      legend: false,
      label: {
        type: 'spider',
        labelHeight: 40,
        formatter: (data: any, mappingData: any) => {
          const group = new G.Group({});
          group.addShape({
            type: 'circle',
            attrs: {
              x: 0,
              y: 0,
              width: 40,
              height: 50,
              r: 5,
              fill: mappingData.color
            }
          });
          group.addShape({
            type: 'text',
            attrs: {
              x: 10,
              y: 8,
              text: `${data.tag}`,
              fill: mappingData.color
            }
          });
          return group;
        }
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }]
    }
    const piePlot = new Pie(ref.current, cfg);

    // 点击事件，跳转文章页
    piePlot.on('element:click', (event: { data: { data: { tag: string } }}) => {
        const classText = event.data.data.tag;
        navigate(`/admin/article?searchTag=${encodeURIComponent(classText)}`);
    });

    // 图标渲染
    piePlot.render();

    // 返回清理函数，以确保在下一次运行之前清理上一次的实例
    return () => {
        piePlot.destroy();
    };

  }, [ref.current])
  

  return (
    <div className={classNames(s.chartBox, { [s.loadingCenter]: isLoading })}>
      <div className={s.chartTitle}>文章统计</div>
      {isLoading ? (
        <IconLoading className={s.loading} />
      ) : (
        <div ref={ref}/>
      )}
    </div>
  );
};

export default ChartCard;
