import { Sequelize, DataTypes, Model, Optional } from "sequelize";

import {
  FanMode,
  TemperaturePresetSetpointAttributes,
} from "./TemperaturePreset";

import { Setpoint } from "./Controller";

export type Day = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

type VirtualPreset = Omit<
  TemperaturePresetSetpointAttributes,
  "setpointType"
> & {
  setpointType: Setpoint | null;
};

type VirtualPresetKeys = keyof VirtualPreset;
export interface ScheduleEventAttributes
  extends Omit<TemperaturePresetSetpointAttributes, "setpointType"> {
  id: string;
  controllerId: string;
  userId: string;
  startDay: Day;
  startHour: number;
  startMinute: number;
  endDay: Day;
  endHour: number;
  endMinute: number;
  temperaturePresetId: string | null;
  setpointType: Setpoint | null;
}

type ScheduleEventOptionalAttributes =
  | "temperaturePresetId"
  | VirtualPresetKeys;

type ScheduleEventDefaultAttributes =
  | "id"
  | "controllerId"
  | "userId"
  | "startDay"
  | "startHour"
  | "startMinute"
  | "endDay"
  | "endHour"
  | "endMinute";

export interface ScheduleEventCreationAttributes
  extends Optional<
    ScheduleEventAttributes,
    ScheduleEventDefaultAttributes | ScheduleEventOptionalAttributes
  > {}

// Model declaration
export class ScheduleEvent extends Model<
  ScheduleEventAttributes,
  ScheduleEventCreationAttributes
> {
  public id!: string;
  public controllerId!: string;
  public userId!: string;
  public startDay!: Day;
  public startHour!: number;
  public startMinute!: number;
  public endDay!: Day;
  public endHour!: number;
  public endMinute!: number;

  public temperaturePresetId!: string | null;
  public setpointType!: Setpoint | null;
  public setpointTarget!: number | null;
  public setpointLower!: number | null;
  public setpointUpper!: number | null;
  public fanMode!: FanMode | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function init(sequelize: Sequelize): void {
  // Model initialization
  ScheduleEvent.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
      },
      controllerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      startDay: {
        type: DataTypes.ENUM("SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"),
        allowNull: false,
      },
      startMinute: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      startHour: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      endDay: {
        type: DataTypes.ENUM("SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"),
        allowNull: false,
      },
      endMinute: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      endHour: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      temperaturePresetId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      setpointType: {
        type: DataTypes.ENUM("SingleSetpoint", "DualSetpoint"),
        allowNull: true,
        defaultValue: null,
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
    { sequelize, modelName: "ScheduleEvent" }
  );
}

export function initAssociations(): void {
  // No assocations
}
