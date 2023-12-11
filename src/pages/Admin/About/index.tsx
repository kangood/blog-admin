import { useTitle } from 'ahooks';
import React from 'react';

import AboutBase from '@/components/AboutBase';
import { getMdFileData } from '@/services/article';
import { siteTitle } from '@/utils/constant';

import { Title } from '../titleConfig';
import s from './index.module.scss';

const About: React.FC = () => {
  useTitle(`${Title.About} | ${siteTitle}`);

  let aboutMe = '';
  let aboutThisSite = '';

  // 请求 API 获取md文件数据
  let { data: mdxContent } = getMdFileData(true, undefined, 'kangod');

  // 在 mdxContent 中使用正则表达式
  if (mdxContent) {
    const aboutMeMatch = mdxContent.match(/##\s*关于我\s*👨‍💻([\s\S]*?)(?=##|$)/);
    const aboutThisSiteMatch = mdxContent.match(/##\s*关于本站\s*🌊([\s\S]*?)(?=$)/);
    // 提取匹配的部分
    aboutMe = aboutMeMatch ? aboutMeMatch[1].trim() : '';
    aboutThisSite = aboutThisSiteMatch ? aboutThisSiteMatch[1].trim() : '';
  }

  return (
    <div className={s.aboutBox}>
      <div className={s.left}>
        <AboutBase aboutContent={aboutMe} mdxContent={mdxContent!} site='关于我' params={1} />
      </div>
      <div className={s.right}>
        <AboutBase aboutContent={aboutThisSite} mdxContent={mdxContent!} site='关于本站' params={0} />
      </div>
    </div>
  );
};

export default About;
