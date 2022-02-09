Rails.application.routes.draw do
  root to: 'static_pages#top'

  get 'company_info/privacy_policy'
  get 'company_info/terms'
  get 'company_info/mail_form'

  resources :contacts, only: %i[new create]
  post 'contacts/back', to: 'contacts#back', as: 'back'

  resources :users, only: %i[create new edit show destroy update]
  get 'remove' => 'users#remove', :as => :remove

  get 'login' => 'user_sessions#new', :as => :login
  post 'login' => 'user_sessions#create'
  delete 'logout' => 'user_sessions#destroy', :as => :logout

  # 再パスワードの為のコントローラー
  resources :password_resets, only: %i[new edit create update]

  # mailer用のルーティング

  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  get 'my_page_menus/index'

  # マイページにある４つのリンクのルーティング
  get 'my_page_menus/simple_recipe'
  get 'webcams/index'
  get 'favorite_bakings/edit'
  get 'favorite_bakings/update'

  # レシピリストはレシピでネストした形にする
  resources :recipes do
    resources :recipe_lists, only: %i[create update destroy], shallow: true
  end
end
