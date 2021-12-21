Rails.application.routes.draw do
  get 'company_info/privacy_policy'
  get 'company_info/terms'
  get 'company_info/mail_form'
  root to: 'static_pages#top'

  resources :users, only: [:create, :new, :edit, :show, :destroy, :update]
  get 'login' => 'user_sessions#new', :as => :login
  post 'login' => "user_sessions#create"
  delete 'logout' => 'user_sessions#destroy', :as => :logout

  #再パスワードの為のコントローラー
  resources :password_resets, only: [:new, :edit, :create, :update]

  #mailer用のルーティング
  Rails.application.routes.draw do
  get 'company_info/privacy_policy'
  get 'company_info/terms'
  get 'company_info/mail_form'
    if Rails.env.development?
      mount LetterOpenerWeb::Engine, at: "/letter_opener"
    end
  end

  get 'my_page_menus/index'

  #マイページにある４つのリンクのルーティング
  get 'my_page_menus/simple_recipe'
  get 'webcams/index'
  get 'favorite_bakings/edit'
  get 'favorite_bakings/update'

  resources :recipes
  #レシピリストはレシピでネストした形にする
  resources :recipes do
    resources :recipe_lists, only: %i[create update destroy], shallow: true
  end
end

