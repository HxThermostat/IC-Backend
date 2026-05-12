import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { Controller } from "./Controller";
import { Location } from "./Location";
import { PushToken } from "./PushToken";
import { TemperaturePreset } from "./TemperaturePreset";

// Types
export interface UserAttributes {
  id: string;
  email: string;
  token: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}

// Model declaration
export class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: string;
  public email!: string;
  public token!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }
}

export function init(sequelize: Sequelize): void {
  // Model initialization
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { sequelize, modelName: "User" }
  );
}

export function initAssociations(): void {
  User.hasMany(PushToken, { as: "pushTokens", foreignKey: "userId" });
  User.hasMany(Controller, { as: "controllers", foreignKey: "userId" });
  User.hasMany(Location, { as: "Locations", foreignKey: "userId" });
  User.hasMany(TemperaturePreset, {
    as: "TemperaturePresets",
    foreignKey: "userId",
  });
}
