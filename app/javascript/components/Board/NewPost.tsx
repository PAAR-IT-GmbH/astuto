import * as React from 'react';

import NewPostForm from './NewPostForm';

import Spinner from '../shared/Spinner';
import {
  MutedText,
  DangerText,
  SuccessText,
} from '../shared/CustomTexts';
import Button from '../shared/Button';

import IBoard from '../../interfaces/IBoard';

import I18n from 'i18n-js';

interface Props {
  board: IBoard;
  isLoggedIn: boolean;
  authenticityToken: string;
}

interface State {
  showForm: boolean;
  error: string;
  success: string;
  isLoading: boolean;

  title: string;
  description: string;
  images: string[];
}

class NewPost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showForm: false,
      error: '',
      success: '',
      isLoading: false,

      title: '',
      description: '',
      images: undefined,
    };

    this.toggleForm = this.toggleForm.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.handleAttachment = this.handleAttachment.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  toggleForm() {
    this.setState({
      showForm: !this.state.showForm,
      error: '',
      success: '',
      isLoading: false,
    });
  }

  onTitleChange(title: string) {
    this.setState({
      title,
      error: '',
    });
  }

  onDescriptionChange(description: string) {
    this.setState({
      description,
    });
  }

  handleAttachment(signedIds) {
    this.setState({ images: [signedIds[0]]})
  };

  async submitForm(e: React.FormEvent) {
    e.preventDefault();

    this.setState({
      error: '',
      success: '',
      isLoading: true,
    });

    const boardId = this.props.board.id;
    const { authenticityToken } = this.props;
    const { title, description, images } = this.state;

    if (title === '') {
      this.setState({
        error: 'You forgot to enter a title!',
        isLoading: false,
      });
      return;
    }

    try {
      const res = await fetch(window.relative_url+'/posts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': authenticityToken,
        },
        body: JSON.stringify({
          post: {
            title,
            description,
            images,
            board_id: boardId,
          },
        }),
      });
      const json = await res.json();
      this.setState({isLoading: false});

      if (res.status === 201) {
        this.setState({
          success: 'Post published! You will be redirected soon...',

          title: '',
          description: '',
        });

        setTimeout(() => (
          window.location.href = window.relative_url+`/posts/${json.id}`
        ), 1000);
      } else {
        this.setState({error: json.error});
      }

    } catch (e) {
      this.setState({
        error: 'An unknown error occurred, try again.'
      });
    }
  }
  
  render() {
    const { board, isLoggedIn } = this.props;
    const {
      showForm,
      error,
      success,
      isLoading,
      
      title,
      description
    } = this.state;

    return (
      <div className="newPostContainer sidebarCard">
        <span className="boardTitle">{board.name}</span>
        <p><MutedText>{board.description}</MutedText></p>
        {
          isLoggedIn ?
            <Button
              onClick={this.toggleForm}
              className="submitBtn"
              outline={showForm}>
              { showForm ? I18n.t('javascript.components.board.new_post.cancel') : I18n.t('javascript.components.board.new_post.submit_feedback') }
            </Button>
          :
            <a href={window.relative_url + "/users/sign_in"} className="btn">
              Log in / Sign up
            </a>
        }

        {
          showForm ?
            <NewPostForm
              title={title}
              description={description}
              handleTitleChange={this.onTitleChange}
              handleDescriptionChange={this.onDescriptionChange}
              handleSubmit={this.submitForm}
              handleAttachment={this.handleAttachment}
            />
          :
            null
        }

        { isLoading ? <Spinner /> : null }
        { error ? <DangerText>{error}</DangerText> : null }
        { success ? <SuccessText>{success}</SuccessText> : null }
      </div>
    );
  }
}

export default NewPost;