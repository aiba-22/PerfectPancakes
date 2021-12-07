class RecipesController < ApplicationController
  before_action :set_recipe, only: %i[show destroy edit update]
  def index
    @recipe = Recipe.new
    @recipes = Recipe.where(user_id: current_user.id).includes(:user).order(created_at: :asc)
  end

  def create
    @recipe =current_user.recipes.build(recipe_params)
    if @recipe.save
      redirect_to(edit_recipe_path(@recipe.id))
    else
      render :new
    end
  end

  def destroy
    @recipe = Recipe.find(params[:id])
    @recipe.destroy
    redirect_to action: :index
  end

  def edit
    @recipe = Recipe.find(params[:id])
    @recipe_list = RecipeList.new
    @recipe_lists = RecipeList.includes(:recipe).where(recipe_id: @recipe.id).order(step: :asc)
    @step = @recipe_lists.last
  end

  def update
    @recipe = Recipe.find(params[:id])
    @recipe.update(recipe_params)
    redirect_to(edit_recipe_path(@recipe.id))
  end

  def show
    @recipe_lists = @recipe.recipe_lists
  end
  private

  def set_recipe
    @recipe = Recipe.find(params[:id])
  end

  def recipe_params
    params.require(:recipe).permit(:title, :image, :material)
  end
end
