import React from 'react';
import { CommentItemEntity } from '@/types/CommentItem';
import * as styles from './CommentItem.module.less';

function Component(props: { item: CommentItemEntity }) {
  const item = props.item;

  return (
    <div className={styles.commentOverall}>
      {/* 头像 */}
      <div>
        <img src='/images/portrait.jpg' alt='头像' />
      </div>
      {/* 主体 */}
      <div>
        {/* 昵称、等级 */}
        <div>
          <div>{item.name}</div>
          <div>{item.level}</div>
        </div>
        {/* 内容 */}
        <div>{item.context}</div>
        {/* 时间、点赞数、其他功能 */}
        <div>
          <div>{item.time}</div>
          <div>点赞数：{item.praiseNum}</div>
          <div>删除</div>
        </div>
      </div>
    </div>
  );
}

export default Component;
