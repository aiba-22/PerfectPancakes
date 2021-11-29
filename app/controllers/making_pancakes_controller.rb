class MakingPancakesController < ApplicationController
  def index
  end

  def simple_recipe
  end

  def webcam
    @user = User.find(current_user.id)
  end

  def favorite_baking
    @user = User.find(current_user.id)
  end
end
