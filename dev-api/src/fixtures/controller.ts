import { FaultLog } from "../data/models";
import {
  Controller,
  ControllerAttributes,
  ControllerCreationAttributes,
} from "../data/models/Controller";
import { FaultLogAttributes } from "../data/models/FaultLog";

import { toPOJO as toModelPOJO, WithoutModel } from "./util";

export type ControllerRecord = WithoutModel<ControllerAttributes> & {
  faultLogs: WithoutModel<FaultLogAttributes>[];
};

function toPOJO(model: Controller): ControllerRecord {
  return {
    ...toModelPOJO(model),
    faultLogs: model.faultLogs?.map(toModelPOJO) ?? [],
  };
}

const include = [
  {
    model: FaultLog,
    as: "faultLogs",
  },
];

export const addController = async (
  controller: ControllerCreationAttributes
): Promise<ControllerRecord> =>
  toPOJO(await Controller.create(controller, { include }));

export const loadControllers = async (
  controllerIds: string[]
): Promise<ControllerRecord[]> =>
  (
    await Controller.findAll({
      where: {
        id: controllerIds,
      },
      include,
    })
  ).map(toPOJO);

export const loadControllersByUserId = async (
  userId: string
): Promise<ControllerRecord[]> =>
  (
    await Controller.findAll({
      where: {
        userId,
      },
      include,
    })
  ).map(toPOJO);

export const updateController = async (
  id: string,
  change: Partial<ControllerRecord>
): Promise<ControllerRecord> => {
  const found = await Controller.findByPk(id, { include });

  if (!found) {
    throw new Error(`Unable to find Controller with id: ${id}`);
  }

  return toPOJO(await found.update(change));
};

export const removeController = async (
  id: string
): Promise<ControllerRecord | undefined> => {
  const found = await Controller.findByPk(id, { include });

  if (!found) {
    throw new Error(`Unable to find Controller with id: ${id}`);
  }

  await found.destroy();

  return toPOJO(found);
};
