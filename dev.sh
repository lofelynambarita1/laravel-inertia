#!/bin/bash

echo "🚀 Starting Laravel Development Environment..."

# Clear all caches
echo "🧹 Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node modules..."
    npm install
fi

if [ ! -d "vendor" ]; then
    echo "📦 Installing Composer dependencies..."
    composer install
fi

# Create storage link if not exists
if [ ! -L "public/storage" ]; then
    echo "🔗 Creating storage link..."
    php artisan storage:link
fi

# Build assets for production
echo "🏗️ Building assets..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "🌐 Starting servers..."
echo "   Laravel: http://localhost:8000"
echo "   Vite HMR: http://localhost:5173"
echo ""

# Start development servers
npm run dev