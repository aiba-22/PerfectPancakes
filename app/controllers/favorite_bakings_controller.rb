class FavoriteBakingsController < ApplicationController
  def edit
    current_user.update(favorite_baking: params[:w1])
  end
end
