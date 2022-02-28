class ApplicationController < ActionController::Base
  before_action :require_login

  private

  def not_authenticated
    redirect_to  new_user_sessions_path
  end
end
