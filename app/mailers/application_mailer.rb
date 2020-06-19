class ApplicationMailer < ActionMailer::Base
  default from: Rails.application.email_from
  layout 'mailer'
end

