export default () => ({
    app: {
        host: process.env.APP_HOST || 'http://localhost',
        port: parseInt(process.env.APP_PORT, 10) || 3000,
        secret: process.env.APP_SECRET,
    },
    database: {
        host: process.env.DB_HOST || 'http://localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME || 'username',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'db_name',
        synchronize: process.env.DB_SYNC || true,
    },
    cache: {
        host: process.env.CACHE_HOST || 'http://localhost',
        port: parseInt(process.env.CACHE_PORT, 10) || 6379,
    }
});