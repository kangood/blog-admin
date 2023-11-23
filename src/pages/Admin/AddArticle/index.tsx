import { Button, Input, Message, Select } from '@arco-design/web-react';
import { useMount, useRequest, useTitle } from 'ahooks';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import MarkDown from '@/components/MarkDown';
import { selectClass, selectTag } from '@/redux/selectors';
import { resetClasses, setClasses } from '@/redux/slices/classes';
import { setTags } from '@/redux/slices/tags';
import { getMdFileData } from '@/services/article';
import { useGetAllTag } from '@/services/tag';
import { addDataAPI } from '@/utils/apis/addData';
import { getDataAPI } from '@/utils/apis/getData';
import { getDataByIdAPI } from '@/utils/apis/getDataById';
import { getWhereDataAPI } from '@/utils/apis/getWhereData';
import { updateDataAPI } from '@/utils/apis/updateData';
import { failText, siteTitle, visitorText } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import {
  classCountChange,
  containsChineseCharacters,
  isValidDateString
} from '@/utils/functions';
import { useScrollSync } from '@/utils/hooks/useScrollSync';

import { Title } from '../titleConfig';
import s from './index.scss';

const AddArticle: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.AddArticle}`);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 同步左右两边屏幕滚动，让它们一直处于同等位置
  const { leftRef, rightRef, handleScrollRun } = useScrollSync();

  // 接收跳转的前一页面传值（列表数据）为默认值
  const id = searchParams.get('id');
  const from = searchParams.get('from');
  const fileName = searchParams.get('fileName');
  // 使用useState可修改传值
  const [titleEng, setTitleEng] = useState('');
  const [defaultClassText, setDefaultClassText] = useState('');
  const [localTitle, setLocalTitle] = useState(searchParams.get('title') || '');
  const [localClasses, setLocalClasses] = useState(searchParams.get('classes') || '');
  const [localTags, setLocalTags] = useState<string[]>(searchParams.get('tags')?.split(',') || []);
  const createdAt = searchParams.get('createdAt');
  const dateInitialValue = createdAt ? dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss');
  const [localDate, setLocalDate] = useState(dateInitialValue);

  // 请求 API 获取md文件数据
  const { data: content } = getMdFileData(fileName!);
  const [localContent, setLocalContent] = useState<string>('');
  // 监听content变化，直到有值为止，防止异步请求结果返回，晚于初始页面渲染的时间
  useEffect(() => {
    if (content) {
      setLocalContent(typeof content === 'string' ? content : '');
    }
  }, [content]);

  // useRequest(() => getDataByIdAPI(DB.Article, id || ''), {
  //   retryCount: 3,
  //   onSuccess: res => {
  //     if (!res.data.length) return;
  //     const { title, titleEng, classes: classText, tags, date, content } = res.data[0];
  //     setTitle(title);
  //     setTitleEng(titleEng);
  //     setClassText(classText);
  //     setLocalTags(tags);
  //     setDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));
  //     setContent(content);
  //     setDefaultClassText(classText);
  //   }
  // });


  const reduxClasses = useSelector(selectClass);
  const { tagList, tagIsLoading } = useGetAllTag();

  const dispatch = useDispatch();

  const { loading: classLoading, run: classesRun } = useRequest(
    () => getDataAPI(DB.Class),
    {
      retryCount: 3,
      manual: true,
      onSuccess: res => {
        dispatch(setClasses(res.data));
      }
    }
  );

  useMount(() => {
    if (!reduxClasses.isDone) {
      classesRun();
    }
  });

  const addData = (type: 'post' | 'draft', data: object) => {
    addDataAPI(DB.Article, data).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success(type === 'post' ? '发布文章成功！' : '保存草稿成功！');
        navigate(
          `${
            type === 'post' ? '/admin/article' : '/admin/draft'
          }?page=1&updated=1&clearOther=1`
        );
      } else {
        Message.warning(failText);
      }
    });
  };

  const updateData = (type: 'post' | 'draft', id: string, data: object) => {
    updateDataAPI(DB.Article, id, data).then(res => {
      if (!res.success && !res.permission) {
        Message.warning(visitorText);
      } else if (res.success && res.permission) {
        Message.success(type === 'post' ? '更新文章成功！' : '保存草稿成功！');
        navigate(
          `${
            type === 'post' ? '/admin/article' : '/admin/draft'
          }?page=1&updated=1&clearOther=1`
        );
      } else {
        Message.warning(failText);
      }
    });
  };

  const isArticleUnique = async () => {
    const res = await getWhereDataAPI(DB.Article, {
      // titleEng: _.eq(titleEng)
    });
    const sameEngInArticles = res.data.filter(({ _id }: { _id: string }) => _id !== id);
    return !sameEngInArticles.length;
  };

  // 新建页面：
  //   发布：
  //     选择了分类：classCount++
  //     未选择分类：
  //   存草稿：

  // 编辑页面：
  //   文章页进来：
  //     发布：
  //       修改了分类：
  //         新的不为空：old--，new++
  //         新的为空：old--
  //       未修改分类：
  //     存草稿：非空old--
  //   草稿页进来：
  //     发布：
  //       选择了分类：classCount++
  //       未选择分类：
  //     存草稿：

  const postArticle = async (type: 'post' | 'draft') => {
    if (!localTitle || !titleEng || !localDate || !localContent) {
      Message.info('请至少输入中英文标题、时间、正文！');
      return;
    }
    if (containsChineseCharacters(titleEng)) {
      Message.info('英文标题不能含有中文字符！');
      return;
    }
    if (!isValidDateString(localDate, true)) {
      Message.info('日期字符串不合法！');
      return;
    }

    const data = {
      localTitle,
      titleEng,
      localContent,
      localTags,
      localClasses: localClasses,
      date: new Date(localDate).getTime(),
      url: `https://lzxjack.top/post?title=${titleEng}`,
      post: type === 'post'
    };

    if (!(await isArticleUnique())) {
      Message.warning('英文标题已存在！');
      return;
    }

    if (!id) {
      // 新建页面
      addData(type, data);
      if (type === 'post') {
        // 发布
        classCountChange(localClasses, 'add', () => {
          dispatch(resetClasses());
        });
      } else {
        dispatch(resetClasses());
      }
    } else {
      // 编辑页面
      updateData(type, id, data);
      if (from === 'article') {
        // 文章页进来
        if (type === 'post') {
          // 发布
          if (localClasses !== defaultClassText) {
            classCountChange(localClasses, 'add', () => {
              dispatch(resetClasses());
            });
            classCountChange(defaultClassText, 'min', () => {
              dispatch(resetClasses());
            });
          } else {
            dispatch(resetClasses());
          }
        } else {
          // 存草稿
          classCountChange(defaultClassText, 'min', () => {
            dispatch(resetClasses());
          });
        }
      } else {
        // 草稿页进来
        if (type === 'post') {
          // 发布
          classCountChange(localClasses, 'add', () => {
            dispatch(resetClasses());
          });
        } else {
          dispatch(resetClasses());
        }
      }
    }
  };

  return (
    <>
      <div className={s.addArticleHeader}>
        <div className={s.top}>
          <Input
            className={s.chineseTitle}
            style={{ width: 600 }}
            addBefore='中文标题'
            allowClear
            size='large'
            value={localTitle}
            onChange={value => setLocalTitle(value)}
          />
          <Input
            style={{ width: 400, marginRight: 10 }}
            addBefore='英文标题'
            allowClear
            size='large'
            value={titleEng}
            onChange={value => setTitleEng(value)}
          />
          <Button
            size='large'
            type='primary'
            style={{ marginRight: 10 }}
            onClick={() => postArticle('draft')}
          >
            存为草稿
          </Button>
          <Button
            size='large'
            type='primary'
            status='success'
            onClick={() => postArticle('post')}
          >
            {id ? '更新' : '发布'}文章
          </Button>
        </div>
        <div className={s.bottom}>
          <Select
            addBefore='分类'
            size='large'
            className={s.classes}
            allowCreate={false}
            showSearch
            allowClear
            unmountOnExit={false}
            value={localClasses}
            onChange={value => setLocalClasses(value)}
            disabled={classLoading}
            options={reduxClasses.value.map(
              ({ class: localClasses }: { class: string }) => ({
                value: localClasses,
                label: localClasses
              })
            )}
          />
          <Select
            addBefore='标签'
            size='large'
            className={s.tags}
            maxTagCount={6}
            mode='multiple'
            allowCreate={false}
            showSearch
            allowClear
            unmountOnExit={false}
            value={localTags}
            onChange={value => setLocalTags(value)}
            disabled={tagIsLoading}
            options={tagList.map(item => ({
              value: item.content,
              label: item.content
            }))}
          />
          <Input
            addBefore='时间'
            value={localDate}
            placeholder='YYYY-MM-DD HH:mm:ss'
            onChange={value => setLocalDate(value)}
            className={s.time}
            allowClear
            size='large'
          />
        </div>
      </div>
      <div className={s.contentEdit}>
        <textarea
          ref={leftRef}
          className={classNames(s.markedEdit, s.input)}
          value={localContent}
          onChange={e => setLocalContent(e.target.value)}
          onScroll={handleScrollRun}
        />
        <MarkDown
          ref={rightRef}
          className={s.markedEdit}
          content={localContent}
          onScroll={handleScrollRun}
        />
      </div>
    </>
  );
};

export default AddArticle;
