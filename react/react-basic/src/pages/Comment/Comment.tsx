import React, { useState, useRef } from 'react';
import CommentItem from '@/components/CommentItem/CommentItem';
import { CommentItemEntity } from '@/types/CommentItem';
import * as styles from './Comment.module.less';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

/**
 * 排序方式：true-按照点赞数排序、false-按照发布时间排序
 * 必须声明在组件方法外
 */
let sortType = true;

function Comment() {
  const [comments, setComments] = useState(new Array<CommentItemEntity>());
  // 创建ref对象，以绑定至DOM，初始值为null
  // 指定类型为HTMLInputElement，避免ts报错
  const commentRef = useRef<HTMLInputElement>(null);

  function publicComment() {
    let input = commentRef.current;
    if (input && input.value && input.value.trim()) {
      let context = input.value.trim();
      let time = dayjs().format('YYYY-MM-DD HH:mm:ss');
      let comment = {
        id: uuidv4(),
        name: '拜森',
        level: Math.floor(Math.random() * 6) + 1,
        context,
        time,
        praiseNum: Math.floor(Math.random() * 1001),
      };
      if (sortType) {
        sortByPraiseNum([...comments, comment]);
      } else {
        sortByTime([...comments, comment]);
      }
      input.value = '';
    } else {
      alert('请输入评论！');
    }
  }

  /**
   * 根据点赞数降序
   */
  function sortByPraiseNum(array?: Array<CommentItemEntity>) {
    if (array) {
      setComments(array.sort((a, b) => b.praiseNum - a.praiseNum));
    } else {
      setComments([...comments].sort((a, b) => b.praiseNum - a.praiseNum));
    }
    sortType = true;
  }

  /**
   * 根据发布时间降序
   */
  function sortByTime(array?: Array<CommentItemEntity>) {
    if (array) {
      setComments(
        array.sort((a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf()),
      );
    } else {
      setComments(
        [...comments].sort(
          (a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf(),
        ),
      );
    }
    sortType = false;
  }

  /**
   * 删除评论
   */
  function deleteById(id: string) {
    setComments([...comments].filter((item) => item.id !== id));
  }

  return (
    <div className={styles.commentOverall}>
      <div className={styles.commentTitle}>
        <div>评论</div>
        <div>{comments.length}</div>
        <a
          className={classNames({ [styles.commentLinkActive]: sortType })}
          onClick={() => sortByPraiseNum()}
        >
          最热
        </a>
        <div>|</div>
        <a
          className={classNames({ [styles.commentLinkActive]: !sortType })}
          onClick={() => sortByTime()}
        >
          最新
        </a>
      </div>
      <div className={styles.commentInput}>
        <img src='/images/portrait.jpg' alt='头像' />
        <input
          ref={commentRef}
          autoComplete='off'
          placeholder='这里需要一条查重率0%的评论'
        />
        <button onClick={publicComment}>发布</button>
      </div>
      <ul>
        {comments.map(function (item: CommentItemEntity) {
          return (
            <li key={item.id}>
              <CommentItem item={item} onDelete={() => deleteById(item.id)} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Comment;
