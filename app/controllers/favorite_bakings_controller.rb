class FavoriteBakingsController < ApplicationController
  def edit
    @user = current_user
  end

  def update
    current_user.update(favorite_baking: params[:w1])
    redirect_to edit_favorite_bakings_path, flash: { success: t('.success') }
  end
end
