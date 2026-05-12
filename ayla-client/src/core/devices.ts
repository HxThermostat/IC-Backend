import buildClient, { TokenContext } from "./client";
import { AYLA_DEVICE_SERVICE_URL } from "./config";

// Device Service APIs are specific to the device entity and its associations, such as properties, schedules, and groups.
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService

const client = buildClient({
  prefixUrl: AYLA_DEVICE_SERVICE_URL + "apiv1/",
});

// Retrieve devices for Login User
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/Devices.json/getDevicesOfLoginUser

type RetrieveDevicesForLoginUserResponse = {
  device: {
    key: number;
    connection_status: string;
    dsn: string;
    oem_model: string;
    product_name: string;
    template_id: number;
  };
}[];

export const retrieveDevicesForLoginUser = async (
  context: TokenContext
): Promise<RetrieveDevicesForLoginUserResponse> => {
  const response = await client
    .get("devices", { context })
    .json<RetrieveDevicesForLoginUserResponse>();

  return response;
};

// Register a Device
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/Devices.json/registerDevice

type RegisterDeviceRequest =
  | {
      device: {
        dsn: string;
        setup_token: string;
      };
    }
  | {
      device: {
        regtoken: string;
      };
    };

interface RegisterDeviceResponse {
  device: {
    connected_at: string;
    dsn: string;
    key: number;
    model: string;
    product_name: string;
  };
}

export const registerDevice = async (
  json: RegisterDeviceRequest,
  context: TokenContext
): Promise<RegisterDeviceResponse> => {
  const response = await client
    .post("devices", {
      json,
      context,
    })
    .json<RegisterDeviceResponse>();

  return response;
};

// Unregister Device
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/Devices.json/unregisterDevice

export const unregisterDevice = async (
  devId: number,
  context: TokenContext
): Promise<void> => {
  await client.delete(`devices/${devId}`, { context });
};

// Update Device Display Name
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/DSNS.json/updateDeviceByDSN

interface UpdateDeviceDisplayNameRequest {
  device: {
    product_name: string;
  };
}

export const updateDeviceDisplayName = async (
  dsn: string,
  json: UpdateDeviceDisplayNameRequest,
  context: TokenContext
): Promise<void> => {
  await client.put(`dsns/${dsn}`, { json, context });
};

// Device Detail
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/DSNS.json/getDeviceByDSN

interface DeviceDetailResponse {
  device: {
    id: number;
    activated_at: string;
    connected_at: string;
    connection_status: string;
    created_at: string;
    device_type: string;
    dsn: string;
    key: number;
    ip: string;
    lat: number;
    lng: number;
    oem_model: string;
    product_name: string;
    registration_type: string;
    regtoken: string;
    ssid: string;
    template_id: number;
    user_id: string;
    user_uuid: string;
  };
}

export const deviceDetail = async (
  dsn: string,
  context: TokenContext
): Promise<DeviceDetailResponse> => {
  const response = await client
    .get(`dsns/${dsn}`, {
      context,
    })
    .json<DeviceDetailResponse>();

  return response;
};

// Device Data
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/DeviceMetaData.json/getDeviceData

type DeviceDataResponse = {
  datum: {
    created_at: string;
    key: string;
    updated_at: string;
    value: string;
    dsn: string;
  };
}[];

export const deviceData = async (
  dsn: string,
  context: TokenContext
): Promise<DeviceDataResponse> => {
  const response = await client
    .get(`dsns/${dsn}/data`, {
      context,
    })
    .json<DeviceDataResponse>();

  return response;
};

// Create New Datum
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/DeviceMetaData.json/newDevData

interface CreateNewDatumRequest {
  datum: {
    key: string;
    value: string;
  };
}

interface CreateNewDatumResponse {
  datum: {
    created_at: string;
    key: string;
    updated_at: string;
    value: string;
    dsn: string;
  };
}

export const createNewDatum = async (
  dsn: string,
  json: CreateNewDatumRequest,
  context: TokenContext
): Promise<CreateNewDatumResponse> => {
  const response = await client
    .post(`dsns/${dsn}/data`, { json, context })
    .json<CreateNewDatumResponse>();

  return response;
};

// Update Specific Device Datum
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/DeviceMetaData.json/updateDeviceData

interface UpdateSpecificDeviceDatumRequest {
  datum: {
    key: string;
    value: string;
  };
}

interface UpdateSpecificDeviceDatumResponse {
  datum: {
    created_at: string;
    key: string;
    updated_at: string;
    value: string;
    dsn: string;
  };
}

export const updateSpecificDeviceDatum = async (
  dsn: string,
  key: string,
  json: UpdateSpecificDeviceDatumRequest,
  context: TokenContext
): Promise<UpdateSpecificDeviceDatumResponse> => {
  const response = await client
    .put(`dsns/${dsn}/data/${key}`, { json, context })
    .json<UpdateSpecificDeviceDatumResponse>();

  return response;
};

// Remove Specific Datum
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/DeviceMetaData.json/deleteDeviceData

export const removeSpecificDatum = async (
  dsn: string,
  key: string,
  context: TokenContext
): Promise<void> => {
  await client.delete(`dsns/${dsn}/data/${key}`, { context });
};

// Retrieve Device Properties
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/Properties.json/getDevicePropertiesByDSN

type RetrieveDevicePropertiesResponse = {
  property: {
    name: string;
    value: string | number;
    data_updated_at: string;
  };
}[];

export const retrieveDeviceProperties = async (
  dsn: string,
  context: TokenContext
): Promise<RetrieveDevicePropertiesResponse> => {
  const response = await client
    .get(`dsns/${dsn}/properties`, { context })
    .json<RetrieveDevicePropertiesResponse>();

  return response;
};

// Retrieve Datapoints of a Property
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/Properties.json/getDataPoints

// Only the paginated-style API is supported currently

interface RetrieveDatapointsOfAPropertyRequest {
  [key: string]: boolean | number | string | undefined;
  per_page?: number;
  next?: string;
  previous?: string;
  is_forward_page?: boolean;
  limit?: number;
  created_at_since_date?: string;
  created_at_end_date?: string;
}

interface RetrieveDatapointsOfAPropertyResponse {
  meta: {
    previous_page: string;
    next_page: string;
    current_page_number: number;
  };
  datapoints: {
    datapoint: {
      updated_at: string;
      created_at: string;
      value: boolean | number | string;
      id: string;
    };
  }[];
}

export const retrieveDatapointsOfAProperty = async (
  dsn: string,
  propertyName: string,
  searchParams: RetrieveDatapointsOfAPropertyRequest,
  context: TokenContext
): Promise<RetrieveDatapointsOfAPropertyResponse> => {
  const response = await client
    .get(`dsns/${dsn}/properties/${propertyName}/datapoints`, {
      searchParams: { ...searchParams, paginated: true },
      context,
    })
    .json<RetrieveDatapointsOfAPropertyResponse>();

  return response;
};

// Create Datapoint
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/Properties.json/addDataPointByDsnAndPropName

interface CreateDatapointRequest {
  datapoint: {
    value: number | string;
  };
}

export const createDatapoint = async (
  dsn: string,
  propertyName: string,
  json: CreateDatapointRequest,
  context: TokenContext
): Promise<void> => {
  await client.post(`dsns/${dsn}/properties/${propertyName}/datapoints`, {
    json,
    context,
  });
};

// Batch Create Datapoints
// https://developer.aylanetworks.com/apibrowser/swaggers/DeviceService#!/Properties.json/batchDataPoint

type BatchCreateDatapointsRequest = {
  batch_datapoints: {
    dsn: string;
    name: string;
    datapoint: {
      value: number | string;
    };
  }[];
};

export const batchCreateDatapoints = async (
  json: BatchCreateDatapointsRequest,
  context: TokenContext
): Promise<void> => {
  await client.post("batch_datapoints", { json, context });
};
