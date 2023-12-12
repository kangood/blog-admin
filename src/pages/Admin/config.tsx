import React, { lazy } from 'react';
import {
  BiDetail,
  BiHomeAlt2,
  BiNews,
  BiTaskX,
  BiTrophy
} from 'react-icons/bi';

const Home = lazy(
  () => import('@/pages/Admin/Home')
);
const Article = lazy(
  () =>
    import('@/pages/Admin/Article')
);
const Show = lazy(
  () => import('@/pages/Admin/Show')
);
const About = lazy(
  () => import('@/pages/Admin/About')
);
const Draft = lazy(
  () => import('@/pages/Admin/Draft')
);
const AddArticle = lazy(
  () =>
    import('@/pages/Admin/AddArticle')
);
const AboutEdit = lazy(
  () =>
    import('@/pages/Admin/AboutEdit')
);

export interface RouteType {
  path: string;
  disPlayName: string;
  element: React.ReactNode;
  icon?: React.ReactNode;
}

export const useRoutes = (): RouteType[] => [
  {
    path: 'home',
    disPlayName: '首页',
    element: <Home />,
    icon: <BiHomeAlt2 />
  },
  {
    path: 'article',
    disPlayName: '文章',
    element: <Article />,
    icon: <BiDetail />
  },
  {
    path: 'show',
    disPlayName: '项目',
    element: <Show />,
    icon: <BiTrophy />
  },
  {
    path: 'about',
    disPlayName: '关于',
    element: <About />,
    icon: <BiNews />
  },
  {
    path: 'draft',
    disPlayName: '草稿箱',
    element: <Draft />,
    icon: <BiTaskX />
  },
  {
    path: 'addArticle',
    disPlayName: '',
    element: <AddArticle />
  },
  {
    path: 'aboutEdit',
    disPlayName: '',
    element: <AboutEdit />
  }
];
