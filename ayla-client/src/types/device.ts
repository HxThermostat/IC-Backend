export interface AylaBatchDatapoint {
  dsn: string;
  propertyName: string;
  value: number | string;
}

export enum AylaConnectionStatus {
  Initializing,
  Offline,
  Online,
}

export interface AylaDatapoint {
  createdAt: Date;
  value: boolean | number | string;
}

export interface AylaDeviceDetail {
  connectedAt?: Date;
  connectionStatus?: AylaConnectionStatus;
  dsn: string;
  key: number;
  ip?: string;
  lat?: number;
  lng?: number;
  model: string;
  name: string;
  userUuid: string;
}

export type AylaDeviceMetadata = Record<string, string | undefined>;

export type AylaDeviceProperties = Record<string, string | number | undefined>;

export type AylaDeviceWithMetadata<
  Metadata extends AylaDeviceMetadata = AylaDeviceMetadata
> = AylaDeviceDetail & { metadata: Metadata };

export type AylaDeviceWithProperties<
  Properties extends AylaDeviceProperties = AylaDeviceProperties
> = AylaDeviceDetail & { properties: Properties };

export type AylaDeviceWithMetadataAndProperties<
  Metadata extends AylaDeviceMetadata = AylaDeviceMetadata,
  Properties extends AylaDeviceProperties = AylaDeviceProperties
> = AylaDeviceWithMetadata<Metadata> & AylaDeviceWithProperties<Properties>;

export function isDeviceDetail(device: unknown): device is AylaDeviceDetail {
  if (typeof device !== "object") return false;
  if (device == null) return false;

  return typeof (device as AylaDeviceDetail).dsn === "string";
}

export function isDeviceWithMetadata<
  Metadata extends AylaDeviceMetadata = AylaDeviceMetadata
>(
  device: unknown,
  metadataCheck = (metadata: Metadata) => typeof metadata === "object"
): device is AylaDeviceWithMetadata<Metadata> {
  if (!isDeviceDetail(device)) return false;

  return metadataCheck((device as AylaDeviceWithMetadata<Metadata>).metadata);
}

export function isDeviceWithProperties<
  Properties extends AylaDeviceProperties = AylaDeviceProperties
>(
  device: unknown,
  propertyCheck = (properties: Properties) => typeof properties === "object"
): device is AylaDeviceWithProperties<Properties> {
  if (!isDeviceDetail(device)) return false;

  return propertyCheck(
    (device as AylaDeviceWithProperties<Properties>).properties
  );
}

export function isDeviceWithMetadataAndProperties<
  Metadata extends AylaDeviceMetadata = AylaDeviceMetadata,
  Properties extends AylaDeviceProperties = AylaDeviceProperties
>(
  device: unknown,
  metadataCheck = (metadata: Metadata) => typeof metadata === "object",
  propertyCheck = (properties: Properties) => typeof properties === "object"
): device is AylaDeviceWithMetadataAndProperties<Metadata, Properties> {
  return (
    isDeviceWithMetadata(device, metadataCheck) &&
    isDeviceWithProperties(device, propertyCheck)
  );
}
