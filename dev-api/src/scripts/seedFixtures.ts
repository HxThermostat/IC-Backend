import { initializeData } from "../data/db";

import { KLIMATE_FORCE_FIXTURES_SYNC } from "../config";

async function seedFixtures(): Promise<void> {
  console.log("🌲  Seeding fixture data");

  await initializeData({
    connectionOptions: {
      dialect: "sqlite",
      storage: ".data/fixtures.sqlite",
    },
    forceSync: KLIMATE_FORCE_FIXTURES_SYNC,
    seedData: true,
  });

  console.log("🎄  Seeding done!");
}

void seedFixtures();
