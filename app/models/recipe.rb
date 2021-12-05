class Recipe < ApplicationRecord
  belongs_to :user
  mount_uploader :image, RecipeImageUploader
  has_many :recipe_lists,dependent: :destroy

  validates :title, presence: true, length: { maximum: 100 }
end
