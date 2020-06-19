import * as React from 'react';
import { DirectUploadProvider } from 'react-activestorage-provider'

import Button from '../shared/Button';

import I18n from 'i18n-js';

interface Props {
  title: string;
  description: string;
  handleTitleChange(title: string): void;
  handleDescriptionChange(description: string): void;
  handleSubmit(e: object): void;
  handleAttachment(siginedId: string): void;
}

const NewPostForm = ({
  title,
  description,
  handleTitleChange,
  handleDescriptionChange,
  handleSubmit,
  handleAttachment,
  }: Props) => (
  <div className="newPostForm">
    <form>
      <div className="form-group">
        <label htmlFor="postTitle">{I18n.t('javascript.components.board.new_post_form.title')}</label>
        <input
          type="text"
          value={title}
          onChange={e => handleTitleChange(e.target.value)}

          id="postTitle"
          className="form-control"
          
          autoFocus
        />
      </div>
      <div className="form-group">
        <label htmlFor="postDescription">{I18n.t('javascript.components.board.new_post_form.description_optional')}</label>
        <textarea
          value={description}
          onChange={e => handleDescriptionChange(e.target.value)}
          rows={3}

          className="form-control"
          id="postDescription"
        ></textarea>
      </div>
      <div className="form-group">
      <DirectUploadProvider 
        directUploadsPath={window.relative_url+'/rails/active_storage/direct_uploads'}
        onSuccess={ handleAttachment } 
        render={({ handleUpload, uploads, ready }) => (
          <div>
            <div className="custom-file">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  disabled={!ready}
                  className="custom-file-input" 
                  id="customFile"
                  onChange={e => {
                      console.log(e.currentTarget.files)
                      handleUpload(e.currentTarget.files)
                      if(e.currentTarget.files.length>0) {
                        $("#imageupload").addClass("selected").html(e.currentTarget.files[0].name);
                      }
                  }}
                />
                <label id="imageupload" className="custom-file-label" htmlFor="customFile">Choose file</label>
            </div>
            {uploads.map(upload => {
              switch (upload.state) {
                case 'waiting':
                  return <p key={upload.id}>Waiting to upload {upload.file.name}</p>
                case 'uploading':
                  return (
                    <p key={upload.id}>
                      Uploading {upload.file.name}: {upload.progress}%
                    </p>
                  )
                case 'error':
                  return (
                    <p key={upload.id}>
                      Error uploading {upload.file.name}: {upload.error}
                    </p>
                  )
              }
            })}
          </div>
        )}
      />
      </div>
      <Button onClick={e => handleSubmit(e)} className="submitBtn d-block mx-auto">
        {I18n.t('javascript.components.board.new_post_form.submit_feedback')}
      </Button>
    </form>
  </div>
);

export default NewPostForm;