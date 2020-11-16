import * as React from 'react';

import NewComment from './NewComment';
import Separator from '../shared/Separator';
import { MutedText } from '../shared/CustomTexts';

import { ReplyFormState } from '../../reducers/replyFormReducer';

import friendlyDate from '../../helpers/friendlyDate';

import I18n from 'i18n-js';

interface Props {
  id: number;
  body: string;
  isPostUpdate: boolean;
  userFullName: string;
  userEmail: string;
  updatedAt: string;

  replyForm: ReplyFormState;
  handleToggleCommentReply(): void;
  handleCommentReplyBodyChange(e: React.FormEvent): void;
  handleToggleIsCommentUpdate(commentId: number, currentIsPostUpdate: boolean): void;
  handleSubmitComment(body: string, parentId: number): void;

  isLoggedIn: boolean;
  isPowerUser: boolean;
  currentUserEmail: string;
}

const Comment = ({
  id,
  body,
  isPostUpdate,
  userFullName,
  userEmail,
  updatedAt,

  replyForm,
  handleToggleCommentReply,
  handleCommentReplyBodyChange,
  handleToggleIsCommentUpdate,
  handleSubmitComment,

  isLoggedIn,
  isPowerUser,
  currentUserEmail,
}: Props) => (
  <div className="comment">
    <div className="commentHeader">
      <span className="commentAuthor">{userFullName}</span>
      { isPostUpdate ? <span className="postUpdateBadge">{I18n.t('javascript.components.comments.comment.post_update')}</span> : null }
    </div>
    <p className="commentBody">{body}</p>
    <div className="commentFooter">
      <a className="commentReplyButton commentLink" onClick={handleToggleCommentReply}>
        { replyForm.isOpen ? I18n.t('javascript.components.comments.comment.cancel') : I18n.t('javascript.components.comments.comment.reply') }
      </a>
      {
        isPowerUser ?
          <React.Fragment>
            <Separator />
            <a
              onClick={() => handleToggleIsCommentUpdate(id, isPostUpdate)}
              className="commentLink"
            >
              { I18n.t('javascript.components.comments.comment.post_update') + ': ' + (isPostUpdate ? I18n.t('javascript.components.comments.comment.yes') : I18n.t('javascript.components.comments.comment.no')) }
            </a>
            <Separator />
            <a href={window.relative_url+`/admin/comments/${id}/edit`} className="commentLink" data-turbolinks="false">{ I18n.t('javascript.components.comments.comment.edit') }</a>
            <Separator />
            <a
              href={window.relative_url+`/admin/comments/${id}`}
              className="commentLink"
              data-method="delete"
              data-confirm= "{I18n.t('javascript.components.comments.comment.are_you_sure')}"
              data-turbolinks="false"> {I18n.t('javascript.components.comments.comment.delete')} </a>

          </React.Fragment>
        :
          null
      }
      <Separator />
      <MutedText>{friendlyDate(updatedAt)}</MutedText>
    </div>
    {
      replyForm.isOpen ?
        <NewComment
          body={replyForm.body}
          parentId={id}
          isSubmitting={replyForm.isSubmitting}
          error={replyForm.error}
          handleChange={handleCommentReplyBodyChange}
          handleSubmit={handleSubmitComment}

          isLoggedIn={isLoggedIn}
          userEmail={currentUserEmail}
        />
        :
        null
    }
  </div>
);

export default Comment;