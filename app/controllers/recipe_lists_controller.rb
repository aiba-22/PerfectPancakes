class RecipeListsController < ApplicationController
  def new
    @recipe = Recipe.find(params[:id])
  end

  def create
    @recipe_list = RecipeList.new(recipe_lists_params)
    redirect_to request.referer, flash: { success: t('.success') } if @recipe_list.save
  end

  def destroy
    @recipe_list = RecipeList.find(params[:id])
    @recipe_list.destroy
    redirect_to request.referer, flash: { success: t('.success') }
  end

  def update
    @recipe_list = RecipeList.find(params[:id])
    redirect_to request.referer, flash: { success: t('.success') } if @recipe_list.update(recipe_list_params)
  end

  private

  def recipe_list_params
    params.require(:recipe_list).permit(:text, :step)
  end

  def recipe_lists_params
    params.require(:recipe_list).permit(:text, :step).merge(recipe_id: params[:recipe_id])
  end
end
