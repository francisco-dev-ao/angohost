
# AngoHost - Web Hosting Service Application

## Database Connection

This application connects to a PostgreSQL database with the following configuration:

- **Host:** emhtcellotyoasg.clouds2africa.com
- **Port:** 1874
- **Database:** appdb

## Development Setup

### Frontend

1. Copy `.env.example` to `.env.local` and adjust values as needed:
```
cp .env.example .env.local
```

2. Install dependencies:
```
npm install
```

3. Run the development server:
```
npm run dev
```

### Backend API (Required for Database Access)

The application uses a separate Node.js backend for database operations:

1. Navigate to the server directory:
```
cd server
```

2. Copy `.env.example` to `.env` and add your database credentials:
```
cp .env.example .env
```

3. Install server dependencies:
```
npm install express cors pg dotenv
```

4. Start the API server:
```
node db-api.js
```

The frontend will proxy API calls to the backend server during development.

## Building for Production

### Frontend

```
npm run build
```

This will generate a `dist` folder with static assets that can be served by any web server.

### Backend API

For production deployment of the backend API, we recommend:

1. Using a process manager like PM2:
```
npm install -g pm2
pm2 start server/db-api.js --name angohost-api
```

2. Setting up a reverse proxy with Nginx or Apache

3. Enabling HTTPS for secure communication

## Security Considerations

- **Never** commit your `.env` files to version control
- Create a dedicated database user with limited permissions for the application
- Enable SSL/TLS for database connections in production
- Set up proper authentication for API endpoints
- Implement rate limiting to prevent abuse

## Monitoring and Maintenance

- Set up logging for both frontend and backend
- Configure database backups
- Implement health checks for the API
- Set up monitoring alerts for critical failures

## Important Notes

- Database connections are made via the backend API, not directly from the browser
- In development mode, mock database responses can be used if the API is not running
