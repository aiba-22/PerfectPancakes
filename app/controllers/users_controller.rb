class UsersController < ApplicationController
  before_action :set_user, only: %i[ show edit update ]
  skip_before_action :require_login, only: [:new, :create]

  # GET /users/1 or /users/1.json
  def show
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users or /users.json
  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to login_path, flash: { success: t('.success') }
    else
      flash.now[:danger] = t('.fail')
      render :new
    end
  end

  # PATCH/PUT /users/1 or /users/1.json
  def update
    if @user.update(user_params)
      redirect_to @user, flash: { success: t('.success') }
    else
      flash.now[:danger] = t('.fail')
      render :edit, status: :unprocessable_entity
    end
  end

  def remove
    @user = current_user
  end
  # DELETE /users/1 or /users/1.json
  def destroy
    @user = current_user
    #削除承認のチェックボックスにチェックを入れた時、データ削除を進行する
    if params[:user][:withdrawal_approval] == "1"
      @user.destroy
      respond_to do |format|
        format.html { redirect_to root_url, flash: { success: t('.success') } }
        format.json { head :no_content }
      end
    else
      render :remove
    end

  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
      if @user.id != current_user.id
        redirect_to("/")
      end
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation, :name, :accepted)
    end
end
