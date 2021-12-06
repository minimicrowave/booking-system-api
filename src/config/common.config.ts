export default () => {
  const { PORT, DB_TYPE, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } =
    process.env;

  return {
    port: parseInt(PORT, 10) || 3000,
    database: {
      type: DB_TYPE,
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    },
  };
};
