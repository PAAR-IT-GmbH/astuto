import * as React from 'react';

import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import { DangerText } from '../shared/CustomTexts';

import I18n from 'i18n-js';

interface Props {
  body: string;
  parentId: number;
  isSubmitting: boolean;
  error: string;
  handleChange(e: React.FormEvent): void;
  handleSubmit(body: string, parentId: number): void;

  isLoggedIn: boolean;
  userEmail: string;
}

const NewComment = ({
  body,
  parentId,
  isSubmitting,
  error,
  handleChange,
  handleSubmit,

  isLoggedIn,
  userEmail,
}: Props) => (
  <React.Fragment>
    <div className="newCommentForm">
      {
        isLoggedIn ?
          <React.Fragment>
            <textarea
              value={body}
              onChange={handleChange}
              placeholder={I18n.t('javascript.components.comments.new_comment.leave_comment')}
              className="newCommentBody"
            />
            <br/>
            <Button
              onClick={() => handleSubmit(body, parentId)}
              className="submitCommentButton">
              { isSubmitting ? <Spinner /> : I18n.t('javascript.components.comments.new_comment.submit') }
            </Button>
          </React.Fragment>
        :
          <a href={window.relative_url + "/users/sign_in"} className="loginInfo">{I18n.t('javascript.components.comments.new_comment.you_need_to_login')}</a>
      }
    </div>
    { error ? <DangerText>{error}</DangerText> : null }
  </React.Fragment>
);

export default NewComment;