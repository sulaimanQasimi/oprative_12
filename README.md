# Oprative Project

This project uses database seeders to populate the database with initial data for testing and development purposes.

## Installation Steps

1. Clone the repository
2. Install dependencies:
   ```bash
   composer install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
4. Generate application key:
   ```bash
   php artisan key:generate
   ```
5. Configure your database in `.env` file
6. Run migrations:
   ```bash
   php artisan migrate --seed
   ```
7. Run the required seeders:
   ```bash
   php artisan db:seed --class=DemoSeeder
   php artisan db:seed --class=SuperAdmin
   ```

## Important Notes

- Always backup your database before running seeders in production
- Seeders are designed for development and testing purposes
- Modify seeder data according to your specific needs
- Keep sensitive data out of seeders (use environment variables instead)
- Make sure to run DemoSeeder and SuperAdmin seeders during initial installation
