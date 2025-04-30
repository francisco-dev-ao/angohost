
# AngoHost - Web Hosting Service Application

## Database Connection

This application connects to a PostgreSQL database with the following configuration:

- **Host:** emhtcellotyoasg.clouds2africa.com
- **Port:** 1874
- **User:** postgres
- **Database:** appdb

## Development Setup

### Frontend

1. Install dependencies:
```
npm install
```

2. Run the development server:
```
npm run dev
```

### Backend API (Required for Database Access)

The application uses a separate Node.js backend for database operations:

1. Navigate to the server directory:
```
cd server
```

2. Install server dependencies:
```
npm install express cors pg
```

3. Start the API server:
```
node db-api.js
```

The frontend will proxy API calls to the backend server during development.

## Building for Production

```
npm run build
```

## Important Notes

- Database connections are made via the backend API, not directly from the browser
- In development mode, mock database responses are used if the API is not running
