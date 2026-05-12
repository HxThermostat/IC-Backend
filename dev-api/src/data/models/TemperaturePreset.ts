import { Sequelize, DataTypes, Model, Optional } from "sequelize";

import { Setpoint } from "./Controller";

export type FanMode = "AUTO" | "FIFTEEN" | "THIRTY" | "FORTYFIVE" | "ALWAYS";
type Slot = "HOME" | "AWAY" | "SLEEP" | "CUSTOM";

export interface TemperaturePresetSetpointAttributes {
  setpointType: Setpoint;
  setpointTarget: number | null;
  setpointLower: number | null;
  setpointUpper: number | null;
  fanMode: FanMode | null;
}

export interface TemperaturePresetAttributes
  extends TemperaturePresetSetpointAttributes {
  id: string;
  locationId: string;
  userId: string;
  name: string | null;
  slot: Slot | null;
}

type TemperaturePresetOptionalAttributes =
  | "name"
  | "slot"
  | "setpointTarget"
  | "setpointLower"
  | "setpointUpper"
  | "fanMode";

type TemperaturePresetDefaultAttributes =
  | "id"
  | "locationId"
  | "userId"
  | "setpointType";

export interface TemperaturePresetCreationAttributes
  extends Optional<
    TemperaturePresetAttributes,
    TemperaturePresetDefaultAttributes | TemperaturePresetOptionalAttributes
  > {}

// Model declaration
export class TemperaturePreset extends Model<
  TemperaturePresetAttributes,
  TemperaturePresetCreationAttributes
> {
  public id!: string;
  public locationId!: string;
  public userId!: string;
  public setpointType!: Setpoint;
  public setpointTarget!: number | null;
  public setpointLower!: number | null;
  public setpointUpper!: number | null;
  public fanMode!: FanMode | null;
  public name!: string | null;
  public slot!: Slot | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function init(sequelize: Sequelize): void {
  // Model initialization
  TemperaturePreset.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
      },
      locationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      slot: {
        type: DataTypes.ENUM("HOME", "AWAY", "SLEEP", "CUSTOM"),
        allowNull: true,
        defaultValue: null,
      },
      setpointType: {
        type: DataTypes.ENUM("SingleSetpoint", "DualSetpoint"),
        allowNull: false,
        defaultValue: "SingleSetpoint",
      },
      fanMode: {
        type: DataTypes.ENUM(
          "AUTO",
          "FIFTEEN",
          "THIRTY",
          "FORTYFIVE",
          "ALWAYS"
        ),
        allowNull: true,
        defaultValue: null,
      },
      setpointTarget: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      setpointLower: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      setpointUpper: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
    },
    { sequelize, modelName: "TemperaturePreset" }
  );
}

export function initAssociations(): void {
  // No assocations
}
