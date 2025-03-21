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
   php artisan migrate
   ```
7. Run the required seeders:
   ```bash
   php artisan db:seed --class=DemoSeeder
   php artisan db:seed --class=SuperAdmin
   ```

## Database Seeders

The project includes several seeders to populate different aspects of the database:

### Available Seeders

1. **DemoSeeder**
   - Creates initial demo data including suppliers
   - Required for basic system setup

2. **SuperAdmin**
   - Creates the super admin user account
   - Required for system administration

3. **UserSeeder**
   - Creates default admin and user accounts
   - Default admin credentials:
     - Email: admin@example.com
     - Password: password

4. **CategorySeeder**
   - Populates the categories table with predefined categories
   - Includes categories for different types of operations

5. **ProductSeeder**
   - Creates sample products with various attributes
   - Links products to existing categories

6. **OrderSeeder**
   - Generates sample orders with different statuses
   - Associates orders with existing users and products

### How to Run Seeders

To run the seeders, follow these steps:

1. Make sure your database is configured in `.env` file
2. Run the following command to execute all seeders:
   ```bash
   php artisan db:seed
   ```

To run a specific seeder:
```bash
php artisan db:seed --class=DemoSeeder
php artisan db:seed --class=SuperAdmin
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=ProductSeeder
php artisan db:seed --class=OrderSeeder
```

### Refreshing Database with Seeders

To refresh your database (drop all tables) and run the seeders:
```bash
php artisan migrate:fresh --seed
```

### Adding New Seeders

To create a new seeder:
```bash
php artisan make:seeder NewSeederName
```

Then edit the generated file in `database/seeders/NewSeederName.php` and add your seeding logic.

## Important Notes

- Always backup your database before running seeders in production
- Seeders are designed for development and testing purposes
- Modify seeder data according to your specific needs
- Keep sensitive data out of seeders (use environment variables instead)
- Make sure to run DemoSeeder and SuperAdmin seeders during initial installation
