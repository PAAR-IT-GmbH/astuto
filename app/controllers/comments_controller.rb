class CommentsController < ApplicationController
  if Rails.application.restricted_access?
    before_action :authenticate_user!
  else
    before_action :authenticate_user!, only: [:create, :update]
  end
  
  def index
    comments = Comment
      .select(
        :id,
        :body,
        :parent_id,
        :is_post_update,
        :updated_at,
        'users.full_name as user_full_name',
        'users.email as user_email',
      )
      .where(post_id: params[:post_id])
      .left_outer_joins(:user)
      .order(updated_at: :desc)

    render json: comments
  end

  def create
    comment = Comment.new(comment_params)

    if comment.save
      if !Rails.application.email_operator.empty?
        NewCommentMailer.operator(comment).deliver_now 
      end
      render json: comment.attributes.merge(
        { user_full_name: current_user.full_name, user_email: current_user.email}
      ), status: :created
    else
      render json: {
        error: I18n.t('errors.comment.create', message: comment.errors.full_messages)
      }, status: :unprocessable_entity
    end
  end

  def update
    comment = Comment.find(params[:id])

    comment.assign_attributes(comment_params)

    if !current_user.power_user? && current_user.id != post.user_id
      render json: I18n.t('errors.unauthorized'), status: :unauthorized
      return
    end

    if comment.save
      render json: comment.attributes.merge(
        { user_full_name: current_user.full_name, user_email: current_user.email}
      )
    else
      render json: {
        error: I18n.t('errors.comment.update', message: comment.errors.full_messages)
      }, status: :unprocessable_entity
    end
  end

  private

    def comment_params
      params
        .require(:comment)
        .permit(:body, :parent_id, :is_post_update)
        .merge(
          user_id: current_user.id,
          post_id: params[:post_id]
        )
    end
end
