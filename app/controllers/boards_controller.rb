class BoardsController < ApplicationController
  if Rails.application.restricted_access?
    before_action :authenticate_user!
  end

  def show
    @board = Board.find(params[:id])
  end
end
