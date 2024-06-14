export const databaseConfig = {
  HOST: '209.133.209.251',
  PORT: 5432,
  USER: 'dypmbjde_rmstest',
  PASSWORD: 'xvRFk60dg5W4',
  DB: 'dypmbjde_rms_test',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
