class ChangeDatatypeFavoriteBakingOfUsers < ActiveRecord::Migration[6.0]
  def change
    change_column :users, :favorite_baking, :numeric
  end
end
