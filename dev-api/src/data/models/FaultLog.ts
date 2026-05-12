import { Sequelize, DataTypes, Model, Optional } from "sequelize";

// Types
export interface FaultLogAttributes {
  id: string;
  controllerId: string | null;
  locationId: string | null;
  label: string;
  date: string;
  description: string;
}

export interface FaultLogCreationAttributes
  extends Optional<
    FaultLogAttributes,
    "id" | "locationId" | "controllerId" | "description"
  > {}

// Model declaration
export class FaultLog extends Model<
  FaultLogAttributes,
  FaultLogCreationAttributes
> {
  public id!: string;
  public label!: string;
  public date!: string;
  public description!: string;
  public locationId!: string | null;
  public controllerId!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function init(sequelize: Sequelize): void {
  // Model initialization
  FaultLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
      },
      controllerId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      locationId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        get(): string {
          const rawValue = this.getDataValue("date");
          return new Date(rawValue).toISOString();
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
    },
    { sequelize, modelName: "FaultLog" }
  );
}

export function initAssociations(): void {
  // No assocations
}
