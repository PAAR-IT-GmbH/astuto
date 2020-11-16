# frozen_string_literal: true

require 'omniauth-oauth2'

module OmniAuth
  module Strategies
    class SCS < OmniAuth::Strategies::OAuth2
      option :name, 'scs'

      option :client_options,
             site: Rails.application.config.scs_server,
             authorize_url: '/oauth/authorize',
             token_url: '/oauth/token'

      uid { raw_info['id'] }

      info do
        {
          id: raw_info['id'],
          name: raw_info['name'],
          email: raw_info['email']
        }
      end

      extra do
        {
          'raw_info' => raw_info
        }
      end

      def raw_info
        @raw_info ||= access_token.get(Rails.application.config.scs_data).parsed
      end

      def callback_url
        full_host + script_name + callback_path
      end
    end
  end
end

OmniAuth.config.add_camelization('scs', 'SCS')