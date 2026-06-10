import { isIP } from "net";
import { PromiseType, ValuesType } from "utility-types";

import { isHTTPError, TokenContext } from "./core/client";
import * as deviceClient from "./core/devices";
import type {
  AylaBatchDatapoint,
  AylaDatapoint,
  AylaDeviceDetail,
  AylaDeviceMetadata,
  AylaDeviceProperties,
  AylaDeviceWithMetadataAndProperties,
  AylaDeviceWithProperties,
} from "./types";
import { parseConnectionStatus, parseDate, parseNumber } from "./utils";

type DeviceFilter = ValuesType<
  PromiseType<ReturnType<typeof deviceClient.retrieveDevicesForLoginUser>>
>["device"];

export async function awaitDatapoint({
  dsn,
  epsilon = 2000,
  propertyName,
  timeout = 5000,
  ...context
}: {
  dsn: string;
  epsilon?: number;
  propertyName: string;
  timeout?: number;
} & TokenContext): Promise<AylaDatapoint | undefined> {
  const start = Date.now();

  // TODO(nleach): This would be better implemented as a Promise.race
  // with a timeout or similar
  while (Date.now() - start < timeout) {
    const [datapoint] = await datapoints({
      dsn,
      propertyName,
      limit: 1,
      ...context,
    });

    if (datapoint && Date.now() - datapoint.createdAt.getTime() <= epsilon) {
      return datapoint;
    }
  }
}

export async function datapoints({
  dsn,
  limit = 20,
  propertyName,
  ...context
}: {
  dsn: string;
  limit?: number;
  propertyName: string;
} & TokenContext): Promise<AylaDatapoint[]> {
  const { datapoints } = await deviceClient.retrieveDatapointsOfAProperty(
    dsn,
    propertyName,
    {
      is_forward_page: true,
      limit: Math.max(Math.min(limit, 100), 0),
      paginated: false,
    },
    context
  );

  return datapoints
    .map(({ datapoint }) => ({
      createdAt: new Date(datapoint.created_at),
      value: datapoint.value,
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function device({
  dsn,
  ...context
}: {
  dsn: string;
} & TokenContext): Promise<AylaDeviceDetail> {
  const { device } = await deviceClient.deviceDetail(dsn, context);

  return {
    connectedAt: parseDate(device.connected_at),
    connectionStatus: parseConnectionStatus(device.connection_status),
    dsn: device.dsn,
    key: device.key,
    ip: isIP(device.ip) ? device.ip : undefined,
    lat: parseNumber(device.lat),
    lng: parseNumber(device.lng),
    model: device.oem_model,
    name: device.product_name,
    userUuid: device.user_uuid,
  };
}

export async function deviceWithMetadataAndProperties<
  Metadata extends AylaDeviceMetadata,
  Properties extends AylaDeviceProperties
>({
  dsn,
  ...context
}: {
  dsn: string;
} & TokenContext): Promise<
  AylaDeviceWithMetadataAndProperties<Metadata, Properties>
> {
  const [deviceData, metadataData, propertyData] = await Promise.all([
    device({ dsn, ...context }),
    metadata<Metadata>({ dsn, ...context }),
    properties<Properties>({ dsn, ...context }),
  ]);

  return {
    ...deviceData,
    metadata: metadataData,
    properties: propertyData,
  };
}

export async function deviceWithProperties<
  Properties extends AylaDeviceProperties
>({
  dsn,
  ...context
}: {
  dsn: string;
} & TokenContext): Promise<AylaDeviceWithProperties<Properties>> {
  const [deviceData, propertyData] = await Promise.all([
    device({ dsn, ...context }),
    properties<Properties>({ dsn, ...context }),
  ]);

  return {
    ...deviceData,
    properties: propertyData,
  };
}

export async function deviceDSNs({
  isSupportedDevice = () => true,
  ...context
}: {
  isSupportedDevice?: (device: DeviceFilter) => boolean;
} & TokenContext): Promise<string[]> {
  const devices = await deviceClient.retrieveDevicesForLoginUser(context);

  return devices
    .map(({ device }) => device)
    .filter(isSupportedDevice)
    .map((device) => device.dsn);
}

export async function metadata<Metadata extends AylaDeviceMetadata>({
  dsn,
  ...context
}: {
  dsn: string;
} & TokenContext): Promise<Metadata> {
  const metadataList = await deviceClient.deviceData(dsn, context);

  return metadataList.reduce((metadata, { datum }) => {
    metadata[datum.key] = datum.value;
    return metadata;
  }, {} as Record<string, string>) as Metadata;
}

export async function properties<Properties extends AylaDeviceProperties>({
  dsn,
  ...context
}: {
  dsn: string;
} & TokenContext): Promise<Properties> {
  const propertyList = await deviceClient.retrieveDeviceProperties(
    dsn,
    context
  );

  return propertyList.reduce((properties, { property }) => {
    properties[property.name] = property.value;
    return properties;
  }, {} as Record<string, string | number>) as Properties;
}

export async function registerDeviceWithRegToken({
  regToken,
  ...context
}: {
  regToken: string;
} & TokenContext): Promise<string> {
  const { device } = await deviceClient.registerDevice(
    {
      device: {
        regtoken: regToken,
      },
    },
    context
  );

  return device.dsn;
}

export async function registerDeviceWithSetupToken({
  dsn,
  setupToken,
  ...context
}: {
  dsn: string;
  setupToken: string;
} & TokenContext): Promise<string> {
  const { device } = await deviceClient.registerDevice(
    {
      device: {
        setup_token: setupToken,
        dsn,
      },
    },
    context
  );

  return device.dsn;
}

export async function renameDevice({
  dsn,
  name,
  ...context
}: { dsn: string; name: string } & TokenContext): Promise<void> {
  await deviceClient.updateDeviceDisplayName(
    dsn,
    { device: { product_name: name } },
    context
  );
}

export async function unregisterDevice({
  dsn,
  ...context
}: {
  dsn: string;
} & TokenContext): Promise<void> {
  const { key } = await device({ dsn, ...context });
  await deviceClient.unregisterDevice(key, context);
}

export async function writeDatapoints({
  datapoints,
  ...context
}: {
  datapoints: AylaBatchDatapoint | AylaBatchDatapoint[];
} & TokenContext): Promise<void> {
  // Unwrap a single datapoint wrapped in an array so we can use the
  // single datapoint semantics below
  if (Array.isArray(datapoints) && datapoints.length === 1) {
    datapoints = datapoints[0];
  }

  // Avoid using the batch API if we only have a single datapoint
  if (!Array.isArray(datapoints)) {
    const { dsn, propertyName, value } = datapoints;
    await deviceClient.createDatapoint(
      dsn,
      propertyName,
      { datapoint: { value } },
      context
    );
    return;
  }

  await deviceClient.batchCreateDatapoints(
    {
      batch_datapoints: datapoints.map(({ dsn, propertyName, value }) => ({
        dsn,
        name: propertyName,
        datapoint: {
          value,
        },
      })),
    },
    context
  );
}

export async function writeMetadata({
  dsn,
  key,
  value,
  ...context
}: {
  dsn: string;
  key: string;
  value?: string;
} & TokenContext): Promise<void> {
  if (value == null) {
    try {
      await deviceClient.removeSpecificDatum(dsn, key, context);
    } catch (e) {
      if (isHTTPError(e) && e.response.statusCode !== 404) {
        throw e;
      }
    }
    return;
  }

  try {
    await deviceClient.updateSpecificDeviceDatum(
      dsn,
      key,
      { datum: { key, value } },
      context
    );
  } catch (e) {
    if (isHTTPError(e) && e.response.statusCode === 404) {
      await deviceClient.createNewDatum(
        dsn,
        { datum: { key, value } },
        context
      );
    }
  }
}
