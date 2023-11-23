import { useThrottleFn } from 'ahooks';
import { useRef } from 'react';

/**
 * 自定义 Hook 用于实现两个区域的滚动同步
 */
export const useScrollSync = () => {
  // 创建左侧和右侧区域的引用
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  // 强制断言，确保引用非空
  const left = leftRef.current! as any;
  const right = rightRef.current! as any;

  // 处理滚动事件的回调函数
  const handleScroll = (event: any) => {
    // 计算滚动位置比例
    const scrollTopRatio = event.target.scrollTop / (event.target.scrollHeight - event.target.clientHeight);

    // 判断事件来源，执行相应的滚动同步
    if (event.target === left) {
      right.scrollTop = scrollTopRatio * (right.scrollHeight - right.clientHeight);
    } else if (event.target === right) {
      left.scrollTop = scrollTopRatio * (left.scrollHeight - left.clientHeight);
    }
  };

  // 使用 ahooks 提供的 useThrottleFn 进行函数节流
  const { run: handleScrollRun } = useThrottleFn(handleScroll, { wait: 60 });

  // 返回对外暴露的引用和函数
  return {
    leftRef,
    rightRef,
    handleScrollRun
  };
};
