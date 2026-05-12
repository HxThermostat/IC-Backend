import { Sequelize } from "sequelize";
import { initializeData } from "../db";

describe("db", () => {
  let sequelize: Sequelize | undefined;

  afterEach(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it("initialization", async () => {
    sequelize = await initializeData({
      connectionOptions: {
        dialect: "sqlite",
        storage: ".data/tests-db.sqlite",
        logging: false,
      },
      forceSync: true,
      seedData: false,
    });

    expect(sequelize).toBeInstanceOf(Sequelize);

    expect(sequelize.models.User).toBeDefined();
  });
});
