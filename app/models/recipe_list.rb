class RecipeList < ApplicationRecord
  belongs_to :recipe
  validates :text, presence: true, length: { maximum: 500 }
end
