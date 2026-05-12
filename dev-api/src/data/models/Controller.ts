import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { FaultLog } from "./FaultLog";

// Types
type HoldLength =
  | "NotSupported"
  | "Indefinite"
  | "NextEvent"
  | "Hours"
  | "Date";
type Mode =
  | "HEAT"
  | "COOL"
  | "AUTO"
  | "OFF"
  | "QUICKHEAT"
  | "QUICKCOOL"
  | "EHEAT";
export type Setpoint = "SingleSetpoint" | "DualSetpoint";

export interface ControllerAttributes {
  id: string;
  locationId: string;
  userId: string;
  name: string;
  mode: Mode;
  awayActive: boolean;
  supportsAway: boolean;
  temperatureNotificationEnabled: boolean;
  temperatureNotificationMin: number;
  temperatureNotificationMax: number;
  humidityNotificationEnabled: boolean;
  humidityNotificationMin: number;
  humidityNotificationMax: number;
  humidityAmbient: number | null;
  setpointType: Setpoint;
  setpointTarget: number | null;
  setpointLower: number | null;
  setpointUpper: number | null;
  awaySetpointTarget: number | null;
  awaySetpointLower: number | null;
  awaySetpointUpper: number | null;
  holdActive: boolean;
  holdLengthHours: number;
  holdLengthDate: string | null;
  holdLengthType: HoldLength;
}

type ControllerOptionalAttributes =
  | "awaySetpointLower"
  | "awaySetpointTarget"
  | "awaySetpointUpper"
  | "holdLengthDate"
  | "holdLengthHours"
  | "humidityAmbient"
  | "setpointLower"
  | "setpointTarget"
  | "setpointUpper";

type ControllerDefaultAttributes =
  | "id"
  | "awayActive"
  | "holdActive"
  | "humidityNotificationEnabled"
  | "setpointType"
  | "supportsAway"
  | "temperatureNotificationEnabled";

export interface ControllerCreationAttributes
  extends Optional<
    ControllerAttributes,
    ControllerDefaultAttributes | ControllerOptionalAttributes
  > {}

// Model declaration
export class Controller extends Model<
  ControllerAttributes,
  ControllerCreationAttributes
> {
  public id!: string;
  public locationId!: string;
  public userId!: string;
  public name!: string;
  public mode!: Mode;
  public awayActive!: boolean;
  public supportsAway!: boolean;
  public temperatureNotificationEnabled!: boolean;
  public temperatureNotificationMin!: number;
  public temperatureNotificationMax!: number;
  public humidityNotificationEnabled!: boolean;
  public humidityNotificationMin!: number;
  public humidityNotificationMax!: number;
  public humidityAmbient!: number | null;
  public setpointType!: Setpoint;
  public setpointTarget!: number | null;
  public setpointLower!: number | null;
  public setpointUpper!: number | null;
  public awaySetpointTarget!: number | null;
  public awaySetpointLower!: number | null;
  public awaySetpointUpper!: number | null;
  public holdActive!: boolean;
  public holdLengthHours!: number;
  public holdLengthDate!: string | null;
  public holdLengthType!: HoldLength;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // TODO: We should refactor this to use a Loader instead of
  // pre-loading the association
  public readonly faultLogs?: FaultLog[];
}

export function init(sequelize: Sequelize): void {
  // Model initialization
  Controller.init(
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
        allowNull: false,
      },
      mode: {
        type: DataTypes.ENUM(
          "HEAT",
          "COOL",
          "AUTO",
          "OFF",
          "QUICKHEAT",
          "QUICKCOOL",
          "EHEAT"
        ),
        allowNull: false,
      },
      awayActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      supportsAway: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      temperatureNotificationEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      temperatureNotificationMin: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      temperatureNotificationMax: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      humidityNotificationEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      humidityNotificationMin: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      humidityNotificationMax: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      humidityAmbient: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      setpointType: {
        type: DataTypes.ENUM("SingleSetpoint", "DualSetpoint"),
        allowNull: false,
        defaultValue: "SingleSetpoint",
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
      awaySetpointTarget: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      awaySetpointLower: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      awaySetpointUpper: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      holdActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      holdLengthHours: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      holdLengthDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      holdLengthType: {
        type: DataTypes.ENUM(
          "NotSupported",
          "Indefinite",
          "NextEvent",
          "Hours",
          "Date"
        ),
        allowNull: false,
      },
    },
    { sequelize, modelName: "Controller" }
  );
}

export function initAssociations(): void {
  Controller.hasMany(FaultLog, {
    as: "faultLogs",
    foreignKey: "controllerId",
  });
}
