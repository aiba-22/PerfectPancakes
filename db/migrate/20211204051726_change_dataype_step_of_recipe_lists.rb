class ChangeDataypeStepOfRecipeLists < ActiveRecord::Migration[6.0]
  def change
    change_column :recipe_lists, :step, 'integer USING CAST(step AS integer)'
  end
end
