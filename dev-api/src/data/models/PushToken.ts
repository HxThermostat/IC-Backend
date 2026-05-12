import { Sequelize, DataTypes, Model, Optional } from "sequelize";

// Types
type Platform = "IOS" | "ANDROID";
type Status = "ENABLED" | "DISABLED";

export interface PushTokenAttributes {
  id: string;
  userId: string;
  token: string;
  platform: Platform;
  status: Status;
}

export interface PushTokenCreationAttributes
  extends Optional<PushTokenAttributes, "id"> {}

// Model declaration
export class PushToken extends Model<
  PushTokenAttributes,
  PushTokenCreationAttributes
> {
  public id!: string;
  public userId!: string;
  public token!: string;
  public platform!: Platform;
  public status!: Status;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static findByToken(token: string): Promise<PushToken | null> {
    return PushToken.findOne({ where: { token } });
  }
}

export function init(sequelize: Sequelize): void {
  // Model initialization
  PushToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      platform: {
        type: DataTypes.ENUM("IOS", "ANDROID"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("ENABLED", "DISABLED"),
        allowNull: false,
      },
    },
    { sequelize, modelName: "PushToken" }
  );
}

export function initAssociations(): void {
  // No associations
}
