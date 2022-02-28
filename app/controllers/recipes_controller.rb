class RecipesController < ApplicationController
  before_action :set_recipe, only: %i[show destroy edit update]
  def index
    @recipe = Recipe.new
    @recipes_pagenate = Recipe.where(user_id: current_user.id).order(created_at: :asc).page(params[:page])
  end

  def create
    @recipe = current_user.recipes.build(recipe_params)
    if @recipe.save
      redirect_to(edit_recipe_path(@recipe.id), flash: { success: t('.success') })
    else
      render :new
    end
  end

  def destroy
    @recipe.destroy
    redirect_to recipes_path, flash: { success: t('.success') }
  end

  def edit
    @recipe_list = RecipeList.new
    @recipe_lists = RecipeList.where(recipe_id: @recipe.id).includes(:recipe).order(step: :asc)
    @step = @recipe_lists.last
  end

  def update
    redirect_to edit_recipe_path(@recipe.id), flash: { success: t('.success') } if @recipe.update(recipe_params)
  end

  def show
    @recipe_lists = @recipe.recipe_lists
  end

  private

  def set_recipe
    @recipe = current_user.recipes.find(params[:id])
  end

  def recipe_params
    params.require(:recipe).permit(:title, :image, :material)
  end
end
