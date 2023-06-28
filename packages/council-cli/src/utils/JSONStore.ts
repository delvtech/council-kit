import Ajv, { ValidateFunction } from "ajv";
import type { JSONSchema } from "json-schema-typed";
import fs from "node:fs";
import path from "node:path";
import { OptionalKeys, RequiredKeys } from "./types";

/**
 * An object of JSONSchemas based on `T`
 */
export type Schema<T> = {
  [K in keyof T]-?: JSONSchema<T[K]>;
};

/**
 * Options that change depending on whether `T` includes required fields
 */
export type DynamicJSONStoreOptions<T extends object> =
  RequiredKeys<T> extends never
    ? {
        /**
         * The default values the JSON will be created with and will reset to
         */
        defaults?: T;
      }
    : {
        /**
         * The default values the JSON will be created with and will reset to
         */
        defaults: T;
      };

/**
 * Options for the `JSONStore` class
 */
export type JSONStoreOptions<T extends object = Record<string, unknown>> = {
  /**
   * The path where the JSON will be saved *excluding the filename*
   */
  path: string;

  /**
   * The name to use for the `.json` file
   */
  name: string;

  schema?: Schema<T>;
} & DynamicJSONStoreOptions<T>;

/**
 * A custom JSON store since all the good ones require ESM :(
 *
 * Use a JSON file to persist key-value data
 */
export class JSONStore<T extends object = Record<string, unknown>> {
  /**
   * The path to the JSON file for this store
   */
  readonly path: string;

  /**
   * The default values the JSON will be created with and will reset to
   */
  readonly defaults: JSONStoreOptions<T>["defaults"];

  /**
   * Ensures the JSON matches the schema if provided
   */
  private readonly _validator?: ValidateFunction;

  /**
   * Use a JSON file to persist key-value data
   */
  constructor(options: JSONStoreOptions<T>) {
    const filename = `${removeJSONExtension(options.name)}.json`;
    this.path = path.resolve(process.cwd(), options.path, filename);

    if (options.schema) {
      const ajv = new Ajv({ allErrors: true, useDefaults: true });

      const storeSchema: JSONSchema = {
        type: "object",
        properties: options.schema,
        additionalProperties: false,
      };

      this._validator = ajv.compile(storeSchema);
    }

    this.defaults = options.defaults || ({} as T);
  }

  /**
   * Get the store as an object
   */
  get data(): T {
    let data: T;

    try {
      const raw = fs.readFileSync(this.path, "utf8");
      // TODO: handle parse error
      data = JSON.parse(raw);
    } catch (err) {
      data = this.defaults as T;
      this._save(data);
      return data;
    }

    this._validate(data);
    return data;
  }

  /**
   * Set the value for a key or multiple keys in the store
   * @param key - The key to set or an object of key-value pairs to set
   * @param value - The value to set the key to if `key` is not an object
   */
  set(values: Partial<T>): void;
  set<K extends keyof T>(key: K, value: T[K]): void;
  set<K extends keyof T>(keyOrValues: K | Partial<T>, value?: T[K]): void {
    const data = this.data;

    if (typeof keyOrValues !== "object" && value) {
      validateSerializable(keyOrValues.toString(), value);
      data[keyOrValues] = value;
    } else {
      for (const [key, value] of Object.entries(keyOrValues)) {
        validateSerializable(key as string, value);
      }
      Object.assign(data, keyOrValues);
    }

    this._save(data);
  }

  /**
   * Get a value from the store by key
   * @param key - The key to get the value for
   * @returns The value of `store[key]`
   */
  get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  /**
   * Check to see if the store contains all given keys
   * @param keys - The keys to look for
   * @returns True if all keys exists, false otherwise
   */
  // TODO: consider deleting because of the smart types
  has(...keys: (keyof T)[]): boolean {
    const data = this.data;

    let hasAllKeys = true;

    for (const key of keys) {
      if (!(key in data)) {
        hasAllKeys = false;
      }
    }

    return hasAllKeys;
  }

  /**
   * Delete entries in the store by their keys
   * @param keys - The keys of the entries to delete
   * @returns True if all entries were deleted, false otherwise
   */
  delete(...keys: OptionalKeys<T>[]): boolean {
    const data = this.data;

    let didDeleteSome = false;
    let didDeleteAll = true;

    for (const key of keys) {
      if ((key as string) in data) {
        delete data[key];
        didDeleteSome = true;
      } else {
        didDeleteAll = false;
      }
    }

    if (didDeleteSome) {
      this._save(data);
    }

    return didDeleteAll;
  }

  /**
   * Reset config to defaults
   */
  reset(): void {
    this._save(this.defaults as T);
  }

  /**
   * Throw an error if the data doesn't match the schema
   * @param data - The data to validate against the schema
   */
  private _validate(data: T | unknown): void {
    if (!this._validator) {
      return;
    }

    const valid = this._validator(data);

    if (valid || !this._validator.errors) {
      return;
    }

    const errors = this._validator.errors.map(
      ({ instancePath, message = "", params }) => {
        if (params.additionalProperty) {
          return `property \`${params.additionalProperty}\` not allowed`;
        }
        return `\`${instancePath.slice(1)}\` ${message}`;
      },
    );
    throw new TypeError(`Schema violation: ${errors.join("; ")}`);
  }

  /**
   * Save the store as JSON
   * @param data - The store data
   */
  private _save(data: T): true {
    this._validate(data);

    const json = JSON.stringify(data, null, 2);

    fs.mkdirSync(path.dirname(this.path), { recursive: true });

    fs.writeFileSync(this.path, json, {
      encoding: "utf8",
      flag: "w",
    });

    return true;
  }
}

/**
 * Remove `.json` from the end of a filename
 * @param file - The full filename
 * @returns The filename without the `.json` extension
 */
function removeJSONExtension(filename: string): string {
  return filename.replace(/\.json$/, "");
}

/**
 * Throw an error if a value is not JSON serializable
 * @param key - The key being set (used to provide more context in the error)
 * @param value - The value to validate
 */
function validateSerializable(key: string, value: unknown) {
  const type = typeof value;
  if (["undefined", "function", "symbol", "bigint"].includes(typeof value)) {
    throw new TypeError(
      `Failed to set value of type \`${type}\` for key \`${key}\`. Values must be JSON serializable.`,
    );
  }
}
