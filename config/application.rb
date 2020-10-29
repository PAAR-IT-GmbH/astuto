require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    config.i18n.default_locale = ENV['LOCALE'] || :en
    config.i18n.fallbacks = %i[en ja de]
    config.i18n.available_locales = %i[en ja de]
    config.time_zone = ENV['TIMEZONE'] ||'Tokyo'
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}').to_s]

    def name
      ENV["APP_NAME"] || 'Feedbacks'
    end

    def email_confirmation?
      ENV["EMAIL_CONFIRMATION"] == "yes"
    end

    def email_from
      ENV["EMAIL_FROM"]
    end

    def email_operator
      ENV["EMAIL_OPERATOR"]
    end

    def email_greetings
      ENV["EMAIL_GREETINGS"]
    end

    def email_author
      ENV["EMAIL_AUTHOR"]
    end

    def allow_registration?
      ENV["ALLOW_REGISTRATION"] == "yes"
    end

    def restricted_access?
      ENV["RESTRICTED_ACCESS"] == "yes"
    end

    def show_logo?
      ENV["SHOW_LOGO"] == "yes"
    end

    def posts_per_page
      (ENV["POSTS_PER_PAGE"] || 15).to_i
    end

    
  end
end
