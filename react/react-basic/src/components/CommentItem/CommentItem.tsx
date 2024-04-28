import React from 'react';
import { CommentItemEntity } from '@/types/CommentItem';
import * as styles from './CommentItem.module.less';

function Component(props: { item: CommentItemEntity; onDelete: Function }) {
  const item = props.item;

  return (
    <div className={styles.commentItemOverall}>
      {/* 头像 */}
      <div className={styles.commentItemPortrait}>
        <img src='/images/portrait.jpg' alt='头像' />
      </div>
      {/* 主体 */}
      <div className={styles.commentItemBody}>
        {/* 昵称、等级 */}
        <div className={styles.commentItemUser}>
          <div>{item.name}</div>
          <div>LV{item.level}</div>
        </div>
        {/* 内容 */}
        <div className={styles.commentItemContext}>{item.context}</div>
        {/* 时间、点赞数、其他功能 */}
        <div className={styles.commentItemAction}>
          <div>{item.time}</div>
          <div>点赞数：{item.praiseNum}</div>
          <div onClick={() => props.onDelete()}>删除</div>
        </div>
      </div>
    </div>
  );
}

export default Component;
