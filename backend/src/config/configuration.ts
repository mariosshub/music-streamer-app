export default () => ({
    dbName: process.env.DB_NAME,
    connectionUrl: process.env.CONNECTION_URL,
    jwtSecret: process.env.JWT_SECRET as string,
    refreshSecret: process.env.REFRESH_SECRET as string,
    baseUrl: process.env.BASE_URL as string,
    nodeEnv: process.env.NODE_ENV as string
})