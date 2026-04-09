FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git unzip libsqlite3-dev npm \
    && docker-php-ext-install pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN composer run-script post-autoload-dump || true
RUN npm run build

RUN cp .env.example .env \
    && php artisan key:generate \
    && touch database/database.sqlite \
    && php artisan migrate --force \
    && php artisan db:seed --force

RUN chmod -R 775 storage bootstrap/cache
RUN chmod -R 755 public

ENV APP_ENV=production
ENV APP_DEBUG=false

EXPOSE 10000

CMD sed -i "s|APP_URL=.*|APP_URL=https://egegen-demo.onrender.com|" .env && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
