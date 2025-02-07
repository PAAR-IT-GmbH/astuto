import * as React from 'react';

import { TitleText, UppercaseText } from '../shared/CustomTexts';

interface Props {
  id: number;
  title: string;
  boardName: string;
}

const PostListItem = ({id, title, boardName}: Props) => (
  <a href={window.relative_url+`/posts/${id}`} className="postLink">
    <div className="postListItem">
      <TitleText>{title}</TitleText>
      <UppercaseText>{boardName}</UppercaseText>
    </div>
  </a>
);

export default PostListItem;