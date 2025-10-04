# Database Migrations

## Game Attempts Table Migration

To enable the Game Attempts functionality, you need to run the following SQL migration:

### File: `add_game_attempts_table.sql`

This migration creates the `game_attempts` table with all necessary constraints and indexes.

### How to Run:

1. **Using your database management tool** (pgAdmin, DBeaver, etc.):

   - Open the SQL file: `backend/database_migrations/add_game_attempts_table.sql`
   - Execute the contents against your database

2. **Using command line** (if you have psql installed):

   ```bash
   psql -d your_database_name -f backend/database_migrations/add_game_attempts_table.sql
   ```

3. **Using Spring Boot** (if you have JPA auto-DDL enabled):
   - The table should be created automatically when the application starts
   - Check your `application.properties` for `spring.jpa.hibernate.ddl-auto`

### Verification:

After running the migration, you can verify the table was created by running:

```sql
SELECT * FROM information_schema.tables WHERE table_name = 'game_attempts';
```

Or check the table structure:

```sql
\d game_attempts
```

### Troubleshooting:

- **Table already exists**: The migration uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times
- **Permission errors**: Make sure your database user has CREATE TABLE permissions
- **Connection issues**: Verify your database connection settings in `application.properties`

### Next Steps:

Once the migration is complete, restart your Spring Boot application and test the Game Attempts functionality.
