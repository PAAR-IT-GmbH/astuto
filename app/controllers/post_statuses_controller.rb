class PostStatusesController < ApplicationController
  if Rails.application.restricted_access?
    before_action :authenticate_user!
  end

  def index
    post_statuses = PostStatus.order(order: :asc)

    render json: post_statuses
  end
end