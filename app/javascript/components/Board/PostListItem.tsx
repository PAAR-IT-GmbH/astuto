import * as React from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

import LikeButton from '../../containers/LikeButton';
import CommentsNumber from '../shared/CommentsNumber';
import PostStatusLabel from '../shared/PostStatusLabel';
import { DescriptionText } from '../shared/CustomTexts';

import IPostStatus from '../../interfaces/IPostStatus';

interface Props {
  id: number;
  title: string;
  description?: string;
  urls?: string;
  postStatus: IPostStatus;
  likesCount: number;
  liked: number;
  commentsCount: number;

  isLoggedIn: boolean;
  authenticityToken: string;
}

interface State {
  isOpen: boolean;
}

class PostListItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }
  render() {
    return (
      <div className="postListItem">
        <LikeButton
          postId={this.props.id}
          likesCount={this.props.likesCount}
          liked={this.props.liked}
          isLoggedIn={this.props.isLoggedIn}
          authenticityToken={this.props.authenticityToken}
        />

        <div onClick={() => window.location.href = `${window.relative_url}/posts/${this.props.id}`} className="postContainer">
          <div>
            <span className="postTitle">{this.props.title}</span>
          </div>
          <DescriptionText limit={120}>{this.props.description}</DescriptionText>

          <div className="postDetails">
            <CommentsNumber number={this.props.commentsCount} />
            { this.props.postStatus ? <PostStatusLabel {...this.props.postStatus} /> : null }
          </div>
        </div>
        <div className="postImage">
        {
          (this.props.urls && this.props.urls.length > 0) && (
            <div>
              <img
                onClick={(e) => this.setState({ isOpen: true })}
                alt={this.props.title}
                src={this.props.urls}
              />
            </div>
          )}
          {
          this.state.isOpen && (
            <Lightbox
              mainSrc={this.props.urls}
              onCloseRequest={() => this.setState({ isOpen: false })}
            />
          )}
        </div>
      </div>
    );
  }
};

export default PostListItem;