import * as React from 'react';

import InfiniteScroll from 'react-infinite-scroller';

import PostListItem from './PostListItem';
import Spinner from '../shared/Spinner';
import {
  DangerText,
  CenteredMutedText,
} from '../shared/CustomTexts';

import IPost from '../../interfaces/IPost';
import IPostStatus from '../../interfaces/IPostStatus';

import I18n from 'i18n-js';

interface Props {
  posts: Array<IPost>;
  postStatuses: Array<IPostStatus>;
  areLoading: boolean;
  error: string;

  hasMore: boolean;
  handleLoadMore(): void;

  isLoggedIn: boolean;
  authenticityToken: string;
}

const PostList = ({
  posts,
  postStatuses,
  areLoading,
  error,
  hasMore,
  handleLoadMore,
  isLoggedIn,
  authenticityToken,
}: Props) => (
  <div className="postList">
    { error ? <DangerText>{error}</DangerText> : null }
    <InfiniteScroll
      initialLoad={false}
      loadMore={handleLoadMore}
      threshold={50}
      hasMore={hasMore}
      loader={<Spinner key={0} />}
      useWindow={true}
    >
      {
        posts.length > 0 ?
          posts.filter((x, i, self) => {
            return self.findIndex(obj => obj.id == x.id) === i;
          }).map((post, i) => (
            <PostListItem
              id={post.id}
              title={post.title}
              description={post.description}
              userFullName={post.userFullName}
              urls={post.urls}
              postStatus={postStatuses.find(postStatus => postStatus.id === post.postStatusId)}
              likesCount={post.likesCount}
              liked={post.liked}
              commentsCount={post.commentsCount}

              isLoggedIn={isLoggedIn}
              authenticityToken={authenticityToken}

              key={i}
            />
          ))
        :
          areLoading ? <p></p> : <CenteredMutedText>{I18n.t('javascript.components.board.post_list.no_post')}</CenteredMutedText>
      }
    </InfiniteScroll>
  </div>
);

export default PostList;