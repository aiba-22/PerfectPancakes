class CompanyInfoController < ApplicationController
  skip_before_action :require_login
  def privacy_policy; end

  def terms; end

  def mail_form; end
end
