# Database setup

From the `backend` directory, create the tables with the local MySQL admin account:

```bash
sudo mysql < database/schema.sql
```

If your `users` table was created before profile photos were added, add the image column once:

```bash
sudo mysql wing_bank_demo < database/migrations/001_add_user_avatar.sql
```

Give the application user access to the database:

```bash
sudo mysql -e "GRANT SELECT, INSERT, UPDATE, DELETE ON wing_bank_demo.* TO 'wing_user'@'localhost'; FLUSH PRIVILEGES;"
```

Create or update the demo login and its sample Savings account:

```bash
npm run db:seed
```

To delete **all users and accounts** and recreate only the demo user and sample account, run:

```bash
npm run db:fresh
```

This reset is destructive and intended only for local demo data.

The seeder prints the demo login credentials when it succeeds. It is safe to run again; it updates that demo user's password and adds a sample account only if the user does not already have one.

Start the API with `npm run dev` after the seeder completes.
