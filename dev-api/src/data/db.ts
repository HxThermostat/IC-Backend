import { Sequelize, Options as SequelizeConnectionOptions } from "sequelize";
import { seedModels } from "./seeds";

import { initializeModels } from "./models";

export type InitializationOptions = {
  connectionOptions: SequelizeConnectionOptions;
  seedData: boolean;
  forceSync: boolean;
};

const DEFAULT_OPTIONS: InitializationOptions = {
  connectionOptions: {
    dialect: "sqlite",
    storage: ".data/fixtures.sqlite",
    logging: false,
  },
  forceSync: false,
  seedData: false,
};

export async function initializeData(
  initOptions: InitializationOptions
): Promise<Sequelize> {
  // Get a defaulted options object
  const options = {
    ...DEFAULT_OPTIONS,
    ...initOptions,
    connectionOptions: {
      ...DEFAULT_OPTIONS.connectionOptions,
      ...initOptions.connectionOptions,
    },
  };

  const sequelize = new Sequelize(options.connectionOptions);

  try {
    await sequelize.authenticate();
  } catch (error) {
    throw new Error(`Unable to connect to the database: ${String(error)}`);
  }

  await initializeModels(sequelize);

  await sequelize.sync({ force: options.forceSync });

  if (options.seedData) {
    await seedModels();
  }

  return sequelize;
}
