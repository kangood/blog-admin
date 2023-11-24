import './index.custom.scss';

import { Button, Input, Select } from '@arco-design/web-react';
import { useTitle } from 'ahooks';
import React, { useState } from 'react';
import { BiBrushAlt, BiSearch } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { ArticleInputType, ArticleOutputType, useDeleteArticle, useListArticle } from '@/services/article';
import { useGetAllClasses } from '@/services/classes';
import { useGetAllTag } from '@/services/tag';
import { siteTitle } from '@/utils/constant';
import { useMyParams } from '@/utils/hooks/useMyParams';
import { usePage } from '@/utils/hooks/usePage';

import { Title } from '../titleConfig';
import { useColumns } from './config';
import s from './index.scss';

const Article: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Articles}`);
  const navigate = useNavigate();

  const { page, setPage } = usePage();

  // 搜索栏参数状态封装
  const {
    searchTitle,
    searchClass,
    searchTag,
    setSearchTitle,
    setSearchClass,
    setSearchTag,
    clearSearch
  } = useMyParams();

  // 后端 api 请求 hooks
  const [articleListParams, setArticleListParams] = useState<ArticleInputType>();
  const { data: articleData, isLoading: articleIsLoading } = useListArticle(articleListParams);
  const { tagList, tagIsLoading } = useGetAllTag();
  const { classesList, classesIsLoading } = useGetAllClasses();
  const { mutateAsync } = useDeleteArticle();

  // 条件查询，修改搜索数据之后重新调用 API
  const onSearch = () => {
    setPage(1);
    setArticleListParams({tags: searchTag.join(','), title: searchTitle, classes: searchClass});
  };

  // 清空搜索栏，并重置查询
  const resetSearch = () => {
    // 为什么这里面的setSearchTag失效了？？
    setPage(1);
    setArticleListParams({});
    clearSearch();
  }

  // 编辑跳转页面，带着参数过去
  const handleEdit = ({id, title, fileName, tags, classes, postedAt}: ArticleOutputType) => {
    navigate(`/admin/addArticle?id=${id}&fileName=${fileName}&title=${title}&tags=${tags}&classes=${classes}&postedAt=${postedAt}&from=article`);
  };

  // 删除处理
  const handleDelete = (id: number) => {
    mutateAsync([id]);
  };

  const columns = useColumns({
    handleEdit,
    deleteProps: {
      page,
      setPage
    },
    handleDelete
  });

  const render = () => (
    <div className={s.searchBox}>
      <div className={s.search}>
        <Input
          size='large'
          allowClear
          style={{ flex: 1, marginRight: 10 }}
          className='articleInputBox'
          placeholder='输入文章标题'
          value={searchTitle}
          onChange={value => setSearchTitle(value)}
          onPressEnter={onSearch}
        />
        <Select
          size='large'
          placeholder='请选择文章分类'
          style={{ flex: 1, marginRight: 10 }}
          allowCreate={false}
          showSearch
          allowClear
          unmountOnExit={false}
          value={searchClass}
          onChange={value => setSearchClass(value)}
          disabled={classesIsLoading}
          options={[
            ...classesList.map((item) => ({
              value: item.content,
              label: item.content
            })),
            { value: '', label: '未分类' }
          ]}
        />

        <Select
          placeholder='请选择文章标签'
          size='large'
          style={{ flex: 2, marginRight: 10 }}
          maxTagCount={4}
          mode='multiple'
          allowCreate={false}
          showSearch
          allowClear
          unmountOnExit={false}
          value={searchTag}
          onChange={value => setSearchTag(value)}
          disabled={tagIsLoading}
          options={tagList.map(item => ({
            value: item.content,
            label: item.content
          }))}
        />
      </div>
      <div>
        <Button
          type='primary'
          size='large'
          onClick={onSearch}
          style={{ fontSize: 16, marginRight: 10 }}
        >
          <BiSearch />
        </Button>
        <Button
          type='primary'
          size='large'
          onClick={resetSearch}
          style={{ fontSize: 16 }}
        >
          <BiBrushAlt />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        text='写文章'
        onClick={() => navigate(`/admin/addArticle`)}
        render={render}
      />
      <MyTable
        loading={articleIsLoading}
        columns={columns}
        data={articleData?.items ?? []}
        total={articleData?.meta.totalItems ?? 0}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

export default Article;
