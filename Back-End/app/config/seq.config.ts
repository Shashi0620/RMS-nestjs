import { databaseConfig } from './db.config'
import { type Dialect, Sequelize } from 'sequelize'

export const sequelizeConfig = new Sequelize(
  databaseConfig.DB,
  databaseConfig.USER,
  databaseConfig.PASSWORD,
  {
    host: databaseConfig.HOST,
    dialect: databaseConfig.dialect as Dialect,
    port: databaseConfig.PORT,
    pool: {
      max: databaseConfig.pool.max,
      min: databaseConfig.pool.min,
      acquire: databaseConfig.pool.acquire,
      idle: databaseConfig.pool.idle
    }
  }
)
