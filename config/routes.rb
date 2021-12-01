Rails.application.routes.draw do

  resources :recipes

  get 'favorite_bakings/edit'
  get 'making_pancakes/simple_recipe'
  get 'making_pancakes/favorite_baking'
  get 'making_pancakes/index'
  get 'making_pancakes/webcam'
  get 'my_page_menus/index'
  get 'static_pages/top'

root to: 'static_pages#top'
resources :users, only: [:create, :new, :edit, :show, :destroy, :update]
get 'login' => 'user_sessions#new', :as => :login
post 'login' => "user_sessions#create"
delete 'logout' => 'user_sessions#destroy', :as => :logout


end

