import { Tag } from '@arco-design/web-react';
import React from 'react';

import s from './index.module.scss';

interface Props {
  techStacks: string[];
}

const COLORS = [
  'red',
  'orangered',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'arcoblue',
  'purple',
  'pinkpurple',
  'magenta',
  'gray'
];

const TableTechStack: React.FC<Props> = ({ techStacks }) => {
  return (
    <div className={s.tableTechStack}>
      {techStacks?.map((techStack, index) => {
        return (
          <Tag
            key={index}
            color={COLORS[techStack.length % COLORS.length]}
            bordered
            className={s.techStackItem}
          >
            {techStack}
          </Tag>
        );
      })}
    </div>
  );
};

export default TableTechStack;
