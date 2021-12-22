class WebcamsController < ApplicationController
	skip_before_action :require_login, only: [:index]
    def index
        if current_user
          @favorite_baking = User.find(current_user.id).favorite_baking
        else
          @favorite_baking=1
        end
    end
end
