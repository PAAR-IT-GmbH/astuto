import * as React from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

import IPost from '../../interfaces/IPost';
import IPostStatus from '../../interfaces/IPostStatus';
import IBoard from '../../interfaces/IBoard';

import LikeList from './LikeList';
import LikeButton from '../../containers/LikeButton';
import PostBoardSelect from './PostBoardSelect';
import PostStatusSelect from './PostStatusSelect';
import PostBoardLabel from '../shared/PostBoardLabel';
import PostStatusLabel from '../shared/PostStatusLabel';
import Comments from '../../containers/Comments';
import { MutedText } from '../shared/CustomTexts';

import friendlyDate from '../../helpers/friendlyDate';
import { LikesState } from '../../reducers/likesReducer';
import { CommentsState } from '../../reducers/commentsReducer';
import PostUpdateList from './PostUpdateList';

interface Props {
  postId: number;
  post: IPost;
  likes: LikesState;
  comments: CommentsState;
  boards: Array<IBoard>;
  postStatuses: Array<IPostStatus>;
  isLoggedIn: boolean;
  isPowerUser: boolean;
  userEmail: string;
  authenticityToken: string;

  requestPost(postId: number): void;
  requestLikes(postId: number): void;
  changePostBoard(
    postId: number,
    newBoardId: number,
    authenticityToken: string,
  ): void;
  changePostStatus(
    postId: number,
    newPostStatusId: number,
    authenticityToken: string,
  ): void;
}

interface State {
  isOpen: boolean;
}

class PostP extends React.Component<Props, State> {
  componentDidMount() {
    this.props.requestPost(this.props.postId);
    this.props.requestLikes(this.props.postId);
  }
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }
  render() {
    const {
      post,
      likes,
      comments,
      boards,
      postStatuses,

      isLoggedIn,
      isPowerUser,
      userEmail,
      authenticityToken,

      changePostBoard,
      changePostStatus,
    } = this.props;

    return (
      <div className="pageContainer">
        <div className="sidebar">
          <PostUpdateList
            postUpdates={comments.items.filter(comment => comment.isPostUpdate === true)}
            areLoading={comments.areLoading}
            error={comments.error}
          />

          <LikeList
            likes={likes.items}
            areLoading={likes.areLoading}
            error={likes.error}
          />
        </div>

        <div className="postAndCommentsContainer">
          <div className="postContainer">
            <div className="postHeader">
              <LikeButton
                postId={post.id}
                likesCount={likes.items.length}
                liked={likes.items.find(like => like.email === userEmail) ? 1 : 0}
                isLoggedIn={isLoggedIn}
                authenticityToken={authenticityToken}
              />
              <h2>{post.title} </h2>
              <p>{post.userFullName}</p>
              {
                isPowerUser && post ?
                  <a href={window.relative_url+`/admin/posts/${post.id}`} data-turbolinks="false">Edit</a> : null
              }
            </div>
            <div>
            {
              isPowerUser && post ?
                <div className="postSettings">
                  <PostBoardSelect
                    boards={boards}
                    selectedBoardId={post.boardId}
                    handleChange={
                      newBoardId => changePostBoard(post.id, newBoardId, authenticityToken)
                    }
                  />
                  <PostStatusSelect
                    postStatuses={postStatuses}
                    selectedPostStatusId={post.postStatusId}
                    handleChange={
                      newPostStatusId => changePostStatus(post.id, newPostStatusId, authenticityToken)
                    }
                  />
                </div>
              :
                <div className="postInfo">
                  <PostBoardLabel
                    {...boards.find(board => board.id === post.boardId)}
                  />
                  <PostStatusLabel
                    {...postStatuses.find(postStatus => postStatus.id === post.postStatusId)}
                  />
                </div>
            }
            </div>
            <div className='postImage'>
            {
            (post.urls && post.urls.length > 0) && (
              <div>
                <img
                  onClick={(e) => this.setState({ isOpen: true })}
                  alt={post.title}
                  src={post.urls}
                />
              </div>
            )}
            {
            this.state.isOpen && (
              <Lightbox
                mainSrc={post.urls}
                onCloseRequest={() => this.setState({ isOpen: false })}
              />
            )}
            </div>
            <p className="postDescription">{post.description}</p>
            <MutedText>{friendlyDate(post.createdAt)}</MutedText>
          </div>

          <Comments
            postId={this.props.postId}
            isLoggedIn={isLoggedIn}
            isPowerUser={isPowerUser}
            userEmail={userEmail}
            authenticityToken={authenticityToken}
          />
        </div>
      </div>
    );
  }
}

export default PostP;