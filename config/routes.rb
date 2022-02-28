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
  resource :user_sessions, only: %i[new create destroy]

  #退会ページ遷移で使用
  get 'remove' => 'users#remove', :as => :remove

  # 再パスワード設定
  resources :password_resets, only: %i[new edit create update]

  # ===================================
  # マイページ関連
  # ===================================

  resources :my_page_menus, only: %i[index]

  # マイページにある４つのリンクのルーティング
  resources :simple_recipes, only: %i[index]
  resources :webcams, only: %i[index]
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

  # ===================================
  # 開発環境のみ
  # ===================================

  # 開発環境の時はメールは飛ばさず確認できるようにする
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

end
