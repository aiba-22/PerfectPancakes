source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

#====================================
# 利用するRubyバージョン
#====================================
ruby '2.6.6'

#====================================
# Railsのデフォルトgem
#====================================
gem 'rails', '~> 6.0.4'
gem 'webpacker', '~> 5.0'
gem 'pg', '>= 0.18', '< 2.0' # PostgreSQLを使用
gem 'puma', '~> 4.1'
gem 'jbuilder', '~> 2.7'
gem 'bootsnap', '>= 1.4.2', require: false
gem 'sass-rails', '>= 6'
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby] # 参照するタイムゾーン情報を提供するgem

#====================================
# ファイルアップロード関連
#====================================
gem 'carrierwave' # 画像アップロード機能
gem 'mini_magick' # リサイズ処理機能

#====================================
# model関連
#====================================
gem 'sorcery'

#====================================
# view関連
#====================================
gem 'slim-rails' # railsでslimを利用するためのgem
gem 'html2slim' # html.erbをhtmle.slimに変換するためのgem、slimの書き方が分からない時などに使用
gem 'meta-tags' # metaタグを効率よく設定できる
gem 'bootstrap', '~> 4.3.1'
gem 'kaminari' # ページネーション
gem 'rails-i18n', '~> 6.0' # 日本語化対応

#====================================
# js、css関連
#====================================
gem 'jquery-rails'
gem 'turbolinks', '~> 5' # ページ遷移をAjaxに置き換え、JavaScriptやCSSのパースを省略する
#====================================
# 環境によって変わるもの
#====================================
gem 'dotenv-rails' # 環境変数を指定できる

#====================================
# 開発環境だけで使うgem
#====================================
group :development, :test do
  gem 'byebug', platforms: %i[mri mingw x64_mingw] # byebugでデバッグ可能
  gem 'pry-rails' # binding.pryでデバッグ可能
  gem 'rubocop' # 構文規則チェックgem

  # デフォルトのエラー画面をわかりやすく整理するgem
  gem 'better_errors'
  gem 'binding_of_caller'

  gem 'listen', '~> 3.2' # ファイルの変更を検知してそれをフックに何か処理ができるgem
  gem 'web-console', '>= 3.3.0' # ウェブビューからrails consoleにアクセスできるgem
  gem 'spring' # Railsのアプリケーションプリローダで、テストやrakeタスクの起動を高速化
  gem 'spring-watcher-listen', '~> 2.0.0' # springのファイルシステムの変更検知方法をpollingからlistenに変更してくれるgem

  gem 'letter_opener_web', '~> 1.0' # mailerのブラウザ確認

end


