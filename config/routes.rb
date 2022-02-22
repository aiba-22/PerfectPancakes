Rails.application.routes.draw do

  # ===================================
  # 静的ページ
  # ===================================
  root to: 'static_pages#top'

  # プライバシーポリシーと利用契約
  get 'privacy_policy' => 'company_info#privacy_policy', :as => :privacy_policy
  get 'company_info/terms' => 'company_info#terms', :as => :terms

  # ===================================
  # ユーザー関連
  # ===================================
  resources :users, only: %i[create new edit show destroy update]
  get 'remove' => 'users#remove', :as => :remove

  get 'login' => 'user_sessions#new', :as => :login
  post 'login' => 'user_sessions#create'
  delete 'logout' => 'user_sessions#destroy', :as => :logout

  # 再パスワードの為のコントローラー
  resources :password_resets, only: %i[new edit create update]

  # ===================================
  # マイページ関連
  # ===================================
  get 'my_page_menus/index'

  # マイページにある４つのリンクのルーティング
  get 'my_page_menus/simple_recipe'
  get 'webcams/index'
  get 'favorite_bakings/edit'
  get 'favorite_bakings/update'

  # ===================================
  # マイレシピ関連
  # ===================================

  # recipe_listsのidは不要なのでshallow: trueをつける
  resources :recipes do
    resources :recipe_lists, only: %i[create update destroy], shallow: true
  end

  # ===================================
  # メール関連
  # ===================================
  resources :contacts, only: %i[new create] #問い合わせフォーム

  # mailer用のルーティング
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

end


