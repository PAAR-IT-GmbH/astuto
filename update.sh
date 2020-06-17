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

# Create database, load schema, run migrations and seed data in an idempotent way.
echo "Preparing database..."
db_version=$(bundle exec rake db:version)
echo "$db_version"
if [ "$db_version" = "Current version: 0" ]; then
  bundle exec rake db:create
  bundle exec rake db:schema:load
  bundle exec rake db:migrate
  bundle exec rake db:seed
else
  bundle exec rake db:migrate
fi
echo "Database prepared."

exit 0
