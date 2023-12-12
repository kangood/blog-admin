import { countListArticleTag } from '@/services/article';

interface TagCountType {
  tag: string;
  count: number;
}

export const useChartData = () => {
  const { data: tagCountList, isLoading: tagCountLoading } = countListArticleTag();

  const formatData = (tagCountList: TagCountType[]) => {
    if (tagCountList === undefined) return [];

    const res = tagCountList
      .filter(obj => obj.count !== 0)
      .map(obj => {
        return { name: obj.tag, value: obj.count };
      });
    return res;
  };

  return {
    loading: tagCountLoading,
    option: {
      tooltip: {
        trigger: 'item',
        textStyle: {
          fontSize: 16,
          fontFamily: 'dengxian'
        }
      },
      series: [
        {
          type: 'pie',
          radius: '80%',
          height: '100%',
          data: formatData(tagCountList),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            fontSize: 18,
            fontFamily: 'dengxian'
          }
        }
      ]
    }
  };
};
