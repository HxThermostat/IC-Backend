import crypto from "crypto";
import fs from "fs";

import { initializeData } from "../../data/db";
import { Sequelize } from "sequelize";

const uniqId = (prefix = ""): string => {
  return [prefix, crypto.randomBytes(12).toString("hex")].join("");
};

const deleteFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};

/**
 * Sets up the sqlite data connection and fixtures
 * @param testId Optional prefix that is added to the sqlite db name
 * @param removeDbFile Whether to remove the .sqlite database file after test
 */
export function useTestData(testId?: string, removeDbFile = true): void {
  let sequelize: Sequelize | undefined;

  global.beforeEach(async () => {
    testId ||= uniqId("tests-");

    // Initialize and seed the test database
    sequelize = await initializeData({
      connectionOptions: {
        dialect: "sqlite",
        storage: `.data/${testId}.sqlite`,
        logging: false,
      },
      forceSync: true,
      seedData: true,
    });
  });

  global.afterEach(async () => {
    if (!sequelize) {
      return;
    }

    // Truncate all tables to prevent autoincrement id collisions
    await Promise.all(
      Object.values(sequelize.models).map((model) =>
        model.destroy({ truncate: true })
      )
    );

    // Close the db connection
    await sequelize.close();

    // Cleanup the .sqlite file
    if (removeDbFile && testId) {
      await deleteFile(`.data/${testId}.sqlite`);
    }
  });
}
