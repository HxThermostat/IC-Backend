import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { Controller } from "./Controller";
import { FaultLog } from "./FaultLog";
import { TemperaturePreset } from "./TemperaturePreset";

// Types
type ConnectionStatus = "ONLINE" | "OFFLINE";
type TemperatureUnit = "C" | "F";

export interface LocationAttributes {
  id: string;
  userId: string;
  name: string;
  temperatureUnit: TemperatureUnit;
  zoning: boolean;
  lat: number | null;
  lng: number | null;
  temperatureOutdoor: number | null;
  faultNotification: boolean;
  connectionStatus: ConnectionStatus;
}

export interface LocationCreationAttributes
  extends Optional<
    LocationAttributes,
    "id" | "lat" | "lng" | "temperatureOutdoor" | "faultNotification"
  > {}

// Model declaration
export class Location extends Model<
  LocationAttributes,
  LocationCreationAttributes
> {
  public id!: string;
  public userId!: string;
  public name!: string;
  public temperatureUnit!: TemperatureUnit;
  public zoning!: boolean;
  public lat!: number | null;
  public lng!: number | null;
  public temperatureOutdoor!: number | null;
  public faultNotification!: boolean;
  public connectionStatus!: ConnectionStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // TODO: We should refactor the use of location.controllerIds to
  // avoid pre-loading this association, maybe we can futz with our
  // Loader use?
  public readonly controllers?: Controller[];

  // TODO: We should refactor this to use a Loader instead of
  // pre-loading the association
  public readonly faultLogs?: FaultLog[];

  get controllerIds(): string[] {
    return (this.controllers ?? []).map((controller) => controller.id);
  }
}

export function init(sequelize: Sequelize): void {
  // Model initialization
  Location.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      temperatureUnit: {
        type: DataTypes.ENUM("C", "F"),
        allowNull: false,
        defaultValue: "C",
      },
      zoning: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lat: {
        // https://stackoverflow.com/questions/31017393/sql-server-latitude-and-longitude-data-type
        // Latitude has the range [-90;90] so it could be stored in DECIMAL(8,6).
        // Longitude has the range [-180;180] so it should be stored in DECIMAL(9,6).
        // For consistency DECIMAL(9,6) for both should be preferred.
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
      },
      lng: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
      },
      temperatureOutdoor: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      faultNotification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      connectionStatus: {
        type: DataTypes.ENUM("OFFLINE", "ONLINE"),
        allowNull: false,
        defaultValue: "OFFLINE",
      },
    },
    { sequelize, modelName: "Location" }
  );
}

export function initAssociations(): void {
  Location.hasMany(Controller, { as: "controllers", foreignKey: "locationId" });
  Location.hasMany(FaultLog, { as: "faultLogs", foreignKey: "locationId" });
  Location.hasMany(TemperaturePreset, {
    as: "temperaturePresets",
    foreignKey: "locationId",
  });
}
