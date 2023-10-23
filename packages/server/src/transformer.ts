import { TsonAsyncOptions } from 'tupleson';

/**
 * @public
 */
export interface DataTransformer {
  serialize(object: any): any;
  deserialize(object: any): any;
}

interface InputDataTransformer extends DataTransformer {
  /**
   * This function runs **on the client** before sending the data to the server.
   */
  serialize(object: any): any;
  /**
   * This function runs **on the server** to transform the data before it is passed to the resolver
   */
  deserialize(object: any): any;
}

interface OutputDataTransformer extends DataTransformer {
  /**
   * This function runs **on the server** before sending the data to the client.
   */
  serialize(object: any): any;
  /**
   * This function runs **only on the client** to transform the data sent from the server.
   */
  deserialize(object: any): any;
}

/**
 * @public
 */
export interface CombinedDataTransformer {
  /**
   * Specify how the data sent from the client to the server should be transformed.
   */
  input: InputDataTransformer;
  /**
   * Specify how the data sent from the server to the client should be transformed.
   */
  output: OutputDataTransformer;
}

/**
 * @public
 */
export type CombinedDataTransformerClient = {
  input: Pick<CombinedDataTransformer['input'], 'serialize'>;
  output: Pick<CombinedDataTransformer['output'], 'deserialize'>;
};

/**
 * @public
 */
export type DataTransformerOptions = CombinedDataTransformer | DataTransformer;

/**
 * @public
 * @deprecated
 * Deprecated in favor of `CombinedDataTransformerOptions` as this causes issues when doing SSR
 * - https://github.com/trpc/trpc/issues/4130
 */
export type ClientDataTransformerOptions =
  | CombinedDataTransformerClient
  | DataTransformer;

export { getDataTransformer } from './getDataTransformer';

/**
 * @internal
 */
export type DefaultDataTransformer = CombinedDataTransformer & {
  _default: true;
};

/**
 * @internal
 * todo: This is not used if TSON is enabled - does the default TSON transformer need a `_default` flag?
 */
export const defaultTransformer: DefaultDataTransformer = {
  _default: true,
  input: { serialize: (obj) => obj, deserialize: (obj) => obj },
  output: { serialize: (obj) => obj, deserialize: (obj) => obj },
};

export type TrpcTuplesonConfig =
  | TsonAsyncOptions
  | {
      input: TsonAsyncOptions;
      output: TsonAsyncOptions;
    };
