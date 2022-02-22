class FavoriteBakingsController < ApplicationController
  def edit
    @user = current_user
  end

  def update
    current_user.update(favorite_baking: params[:w1])
    redirect_to favorite_bakings_edit_path, flash: { success: t('.success') }
  end
end
