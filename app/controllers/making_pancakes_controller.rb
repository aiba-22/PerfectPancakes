class MakingPancakesController < ApplicationController
  skip_before_action :require_login, only: [:webcam]
  def index
  end

  def simple_recipe
  end

  def webcam
    if current_user
      @favorite_baking = User.find(current_user.id).favorite_baking
    else
      @favorite_baking=1
    end
  end
  def favorite_baking
    @user = User.find(current_user.id)
  end
end
