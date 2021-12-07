class FavoriteBakingsController < ApplicationController
  def edit
    current_user.update(favorite_baking: params[:w1])
    redirect_to  making_pancakes_favorite_baking_path, flash: { success: t('.success')}
  end
end
