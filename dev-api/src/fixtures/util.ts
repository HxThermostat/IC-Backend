import { Model } from "sequelize/types";

export type WithoutModel<T> = Partial<{ [K in keyof Model]: never }> & T;

type ExtractAttributes<TModel> = TModel extends Model<
  infer TModelAttributes,
  any // eslint-disable-line @typescript-eslint/no-explicit-any
>
  ? TModelAttributes
  : never;

export function toPOJO<
  TModel extends Model,
  TModelAttributes extends ExtractAttributes<TModel>
>(model: TModel): TModelAttributes {
  // TModelAttributes _can_ be any because the default type signature
  // for Model is Model<any, any>. In our usage, this isn't a risk
  // because we're giving every model a well-defined type for
  // TModelAttributes
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return model.toJSON() as TModelAttributes;
}
