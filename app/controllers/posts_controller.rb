class PostsController < ApplicationController
  if Rails.application.restricted_access?
    before_action :authenticate_user!
  else
    before_action :authenticate_user!, only: [:create, :update]
  end

  def index
    posts = Post
      .select(
        :id,
        :title,
        :description,
        :post_status_id,
        'COUNT(DISTINCT likes.id) AS likes_count',
        'COUNT(DISTINCT comments.id) AS comments_count',
        'users.full_name as user_full_name',
        '((LOG(COUNT(DISTINCT likes.id) + 1) + LOG(COUNT(DISTINCT comments.id) + 1)) + (EXTRACT(EPOCH FROM posts.created_at) / 45000)) AS hotness',
        "(SELECT COUNT(*) AS liked FROM likes WHERE likes.user_id=#{current_user ? current_user.id : -1} AND likes.post_id=posts.id)"
      )
      .left_outer_joins(:user)
      .left_outer_joins(:likes)
      .left_outer_joins(:comments)
      .group('posts.id, users.id')
      .where(filter_params)
      .search_by_name_or_description(params[:search])
      .order('hotness DESC')
      # .page(params[:page].to_i)
    
    render json: posts.with_attached_images
  end

  def create
    post = Post.new(post_params)

    if post.save
      if !Rails.application.email_operator.empty?
        NewPostMailer.operator(post).deliver_now 
      end
      render json: post, status: :created
    else
      render json: {
        error: I18n.t('errors.post.create', message: post.errors.full_messages)
      }, status: :unprocessable_entity
    end
  end

  def show
    # binding.pry
    @post = Post.select(
      :id,
      :title,
      :description,
      :post_status_id,
      :board_id,
      :user_id,
      :created_at,
      :updated_at,
      'users.full_name as user_full_name'
    )
    .left_outer_joins(:user)
    .where(id: params[:id])
    .first!()

    @post_statuses = PostStatus.select(:id, :name, :color).order(order: :asc)

    @board = @post.board

    respond_to do |format|
      format.html

      format.json { render json: @post }
    end
  end

  def update
    post = Post.find(params[:id])
    
    if !current_user.power_user? && current_user.id != post.user_id
      render json: I18n.t('errors.unauthorized'), status: :unauthorized
      return
    end

    post.board_id = params[:post][:board_id] if params[:post].has_key?(:board_id)

    if params[:post].has_key?(:post_status_id) && params[:post][:post_status_id] !=post.post_status_id
      if !Rails.application.email_operator.empty?
        UpdatePostMailer.operator(post).deliver_now 
      end
    end

    post.post_status_id = params[:post][:post_status_id] if params[:post].has_key?(:post_status_id)

    if post.save
      render json: post, status: :no_content
    else
      render json: {
        error: I18n.t('errors.post.update', message: post.errors.full_messages)
      }, status: :unprocessable_entity
    end
  end

  private
  
    def filter_params
      defaults = { board_id: Board.first.id }

      params
        .permit(:board_id, :post_status_id, :page, :search)
        .with_defaults(defaults)
        .except(:page, :search)
    end
    
    def post_params
      params
        .require(:post)
        .permit(:title, :description, :board_id, images: [])
        .merge(user_id: current_user.id)
    end
end
