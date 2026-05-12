## Klimate-API - Data

The `/data` folder contains;

1. `db.ts` for connecting to the backend database.
2. `/models` for CRUD access to data models like `User`, `Location`, `Controller` etc.
3. `seeds.ts` for seeding initial fixture data.

Currently we're using [Sequelize v6](https://sequelize.org/master/) as our ORM with SQLite as the underlying database.

#### DB Connection

Here's an example of creating and authenticating to the database;

```typescript
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ".data/fixtures.sqlite",
});

try {
  await sequelize.authenticate();
} catch (error) {
  throw new Error(`Unable to connect to the database: ${String(error)}`);
}
```

#### Model CRUD Operations

Here are some examples of typical CRUD operations on a Model;

```typescript
import { Op } from "sequelize";
import { User } from "data/models";

// Create
const created = await User.create({
  ...fields,
});
// Read
const singleUser = await User.findByPk(userId);
const manyUsers = await User.findAll({
  where: {
    [Op.in]: userIds,
  },
});
// Update
await created.update({
  ...fields,
});
// Destroy
await created.destroy();
```

#### Typical GraphQL Data Flow

Anatomy of a GraphQL querys data flow;

```typescript
// 1) Hit /graphql endpoint with query
const res = await client.query({
  query: gql`
    query($id: ID!) {
      location(id: $id) {
        id
        name
        temperatureUnit
        zoning
        lat
        lng
        awayActive
        temperatureOutdoor
        connectionStatus
      }
    }
  `,
  variables: {
    id: "9c98e454-531c-4042-b494-3a8f8bba1273",
  },
});

// 2) Resolver; locationResolver.ts
// Simple resolver example directly calling the location loader.
function locationResolver(_root, { id }, { loaders }) {
  return loaders.location.load(id);
}

// NOTE: More common short form that is used in our app
const resolvers = {
  location: async (_root, { id }, { loaders }) => loaders.location.load(id),
};

// 3) Loader; loaders/location.ts
const locationLoader = (userId?: string): Loaders["location"] =>
  new DataLoader(async (ids: readonly string[]) => {
    const userLocations = userId ? await loadLocationsByUserId(userId) : [];
    const userLocationsById = new Map<string, LocationRecord>();
    userLocations.forEach((userLocation) =>
      userLocationsById.set(userLocation.id, userLocation)
    );

    return ids.map((id) => userLocationsById.get(id) ?? null);
  });

// 4) Fixture; fixtures/location.ts
const loadLocationsByUserId = async (
  userId: string
): Promise<LocationRecord[]> => {
  const foundLocations = await Location.findAll({
    where: {
      userId,
    },
    include: [
      {
        association: "faultLogs",
      },
      {
        association: "controllers",
        attributes: ["id"],
      },
    ],
  });

  return foundLocations.map(serializeLocationRecord);
};

// 5) Model; data/models/Location.ts
// More docs for Sequelize Models at https://sequelize.org/master/manual/model-querying-basics.html
export class Location extends Model {}
```
