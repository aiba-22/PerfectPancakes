class ChangeColumnDefaultToUsers < ActiveRecord::Migration[6.0]
  def change
    change_column :users, :favorite_baking, :float, default: 1
  end
end
