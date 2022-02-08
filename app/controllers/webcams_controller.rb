class WebcamsController < ApplicationController
  skip_before_action :require_login, only: [:index]
  def index
    @favorite_baking = if current_user
                         User.find(current_user.id).favorite_baking
                       else
                         1
                       end
  end
end
