# Load the Rails application.
require_relative 'application'


App::Application.configure do
    ActionMailer::Base.default :from => ENV["EMAIL_FROM"]

    config.action_mailer.default_url_options = { host: ENV["DEFAULT_URL"] }
    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = {
        address: ENV["SMTP_ADDRESS"],
        port: ENV["SMTP_PORT"].to_i,
        domain: ENV["SMTP_DOMAIN"],
        authentication: ENV["SMTP_AUTHENTICATION"] ,
        user_name: ENV["SMTP_USERNAME"],
        password: ENV["SMTP_PASSWORD"],
        enable_starttls_auto: ENV["SMTP_STARTTLS_AUTO"] == "yes"
    }
end

# Initialize the Rails application.
App::Application.initialize!
