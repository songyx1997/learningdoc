import React from 'react';
import CommentItem from '@/components/CommentItem/CommentItem';
import { CommentItemEntity } from '@/types/CommentItem';

function Comment() {
  const comments: Array<CommentItemEntity> = [
    {
      id: '1000',
      name: '拜森',
      level: 6,
      context: '这是一条评论',
      time: '2024-01-01 00:00:00',
      praiseNum: 100,
    },
  ];
  return (
    <ul>
      {comments.map(function (item: CommentItemEntity) {
        return (
          <li key={item.id}>
            <CommentItem item={item} />
          </li>
        );
      })}
    </ul>
  );
}

export default Comment;
