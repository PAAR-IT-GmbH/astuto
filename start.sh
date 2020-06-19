#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

set -o allexport
[[ -f .env ]] && source .env
set +o allexport

# Check environment variables
/bin/bash ./check-env.sh

# Remove a potentially pre-existing server.pid for Rails.
rm -f $APP_ROOT/tmp/pids/server.pid

echo "Environment is: $ENVIRONMENT"
export RAILS_ENV="$ENVIRONMENT"
export NODE_ENV="$ENVIRONMENT"
if [ $ENVIRONMENT == "development" ]; then
  # Launch Rails server and webpack-dev-server using Foreman
  bundle exec foreman start
else # production
  # Compile assets and launch server
  ./bin/rails assets:precompile
  ./bin/rails server -e production
fi