class AddMaterialToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :material, :string
  end
end
