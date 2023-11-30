import React, { lazy } from 'react';
import {
  BiDetail,
  BiEdit,
  BiHomeAlt2,
  BiListOl,
  BiMessageRoundedDots,
  BiNews,
  BiShareAlt,
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
const Say = lazy(
  () => import('@/pages/Admin/Say')
);
const Msg = lazy(
  () => import('@/pages/Admin/Msg')
);
const Link = lazy(
  () => import('@/pages/Admin/Link')
);
const Show = lazy(
  () => import('@/pages/Admin/Show')
);
const About = lazy(
  () => import('@/pages/Admin/About')
);
const Log = lazy(
  () => import('@/pages/Admin/Log')
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
    path: 'say',
    disPlayName: '说说',
    element: <Say />,
    icon: <BiMessageRoundedDots />
  },
  {
    path: 'msg',
    disPlayName: '留言板',
    element: <Msg />,
    icon: <BiEdit />
  },
  {
    path: 'link',
    disPlayName: '友链',
    element: <Link />,
    icon: <BiShareAlt />
  },
  {
    path: 'show',
    disPlayName: '作品',
    element: <Show />,
    icon: <BiTrophy />
  },
  {
    path: 'log',
    disPlayName: '建站日志',
    element: <Log />,
    icon: <BiListOl />
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
