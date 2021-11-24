Rails.application.routes.draw do

  get 'my_page_menus/index'
  get 'static_pages/top'

root to: 'static_pages#top'
resources :users, only: [:create, :new, :edit, :show, :destroy, :update]
get 'login' => 'user_sessions#new', :as => :login
post 'login' => "user_sessions#create"
post 'logout' => 'user_sessions#destroy', :as => :logout


end

