class ContactMailer < ApplicationMailer
    def send_mail(contact)
        @contact = contact
        mail to: 'jazzarubamu@gmail.com', subject: '【お問い合わせ】'

    end
end
