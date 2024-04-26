interface CommentItemEntity {
  /**
   * 主键
   */
  id: string;
  /**
   * 昵称
   */
  name: string;
  /**
   * 用户等级
   */
  level: number;
  /**
   * 评论内容
   */
  context: string;
  /**
   *评论时间
   */
  time: string;
  /**
   * 点赞数
   */
  praiseNum: number;
}

export { CommentItemEntity };
