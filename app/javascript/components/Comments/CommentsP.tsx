import * as React from 'react';

import NewComment from './NewComment';
import CommentList from './CommentList';
import Spinner from '../shared/Spinner';
import { DangerText } from '../shared/CustomTexts';

import IComment from '../../interfaces/IComment';
import { ReplyFormState } from '../../reducers/replyFormReducer';

import I18n from 'i18n-js';

interface Props {
  postId: number;
  isLoggedIn: boolean;
  isPowerUser: boolean;
  userEmail: string;
  authenticityToken: string;

  comments: Array<IComment>;
  replyForms: Array<ReplyFormState>;
  areLoading: boolean;
  error: string;

  requestComments(postId: number, page?: number): void;
  toggleCommentReply(commentId: number): void;
  setCommentReplyBody(commentId: number, body: string): void;
  toggleCommentIsPostUpdate(
    postId: number,
    commentId: number,
    currentIsPostUpdate: boolean,
    authenticityToken: string,
  ): void;
  submitComment(
    postId: number,
    body: string,
    parentId: number,
    authenticityToken: string,
  ): void;
}

class CommentsP extends React.Component<Props> {
  componentDidMount() {
    this.props.requestComments(this.props.postId);
  }

  _handleToggleIsCommentUpdate = (commentId: number, currentIsPostUpdate: boolean) => {
    this.props.toggleCommentIsPostUpdate(
      this.props.postId,
      commentId,
      currentIsPostUpdate,
      this.props.authenticityToken,
    );
  }

  _handleSubmitComment = (body: string, parentId: number) => {
    this.props.submitComment(
      this.props.postId,
      body,
      parentId,
      this.props.authenticityToken,
    );
  }

  render() {
    const {
      isLoggedIn,
      isPowerUser,
      userEmail,

      comments,
      replyForms,
      areLoading,
      error,

      toggleCommentReply,
      setCommentReplyBody,
    } = this.props;

    const postReply = replyForms.find(replyForm => replyForm.commentId === null);

    return (
      <div className="commentsContainer">
        <NewComment
          body={postReply && postReply.body}
          parentId={null}
          isSubmitting={postReply && postReply.isSubmitting}
          error={postReply && postReply.error}
          handleChange={
            (e: React.FormEvent) => (
              setCommentReplyBody(null, (e.target as HTMLTextAreaElement).value)
            )
          }
          handleSubmit={this._handleSubmitComment}

          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
        />

        { areLoading ? <Spinner /> : null }
        { error ? <DangerText>{error}</DangerText> : null }

        <div className="commentsTitle">
        {I18n.t('javascript.components.comments.comments_p.activity')} &bull; {comments.length} {I18n.t('javascript.components.comments.comments_p.comments')}
        </div>
        

        <CommentList
          comments={comments}
          replyForms={replyForms}
          toggleCommentReply={toggleCommentReply}
          setCommentReplyBody={setCommentReplyBody}
          handleToggleIsCommentUpdate={this._handleToggleIsCommentUpdate}
          handleSubmitComment={this._handleSubmitComment}
          parentId={null}
          level={1}
          isLoggedIn={isLoggedIn}
          isPowerUser={isPowerUser}
          userEmail={userEmail}
        />
      </div>
    );
  }
}

export default CommentsP;