class ContactsController < ApplicationController
  skip_before_action :require_login
  def new
    @contact = Contact.new
  end

  def back
    @contact = Contact.new(contact_params)
    render :new
  end

  def create
    @contact = Contact.new(contact_params)
    if @contact.save
      ContactMailer.send_mail(@contact).deliver_now
      redirect_to root_path, flash: { success: t('.success') }
    else
      render :new
    end
  end

  private

  def contact_params
    params.require(:contact)
          .permit(:email,
                  :name,
                  :phone_number,
                  :subject,
                  :message)
  end
end
