class AddNameTousers < ActiveRecord::Migration[6.0]
  def change
	add_column :users, :name, :string
	add_column :users, :favorite_baking, :integer, default:1
  end

end
