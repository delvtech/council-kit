import ajv, { type ValidateFunction } from "ajv";
import type { JSONSchema } from "json-schema-typed";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { IfElse, IsNever, OptionalKey, RequiredKey } from "../types.js";

const Ajv = ajv.default;

/**
 * An object of JSONSchemas based on `T`
 */
export type JsonStoreSchema<T = Record<string, unknown>> = {
  [K in keyof T]-?: JSONSchema<T[K]>;
};

type DefaultsOption<T extends object> = {
  /**
   * The default values the JSON will be created with and will reset to
   */
  defaults?: T;
};

/**
 * Options for the `JSONStore` class
 */
export type JsonStoreOptions<T extends object = Record<string, unknown>> = {
  /**
   * The path where the JSON will be saved; *excluding the filename*
   */
  path: string;

  /**
   * The name to use for the `.json` file
   */
  name: string;

  /**
   * A schema to validate the JSON against
   * @see {@link https://ajv.js.org/json-schema.html}
   */
  schema?: JsonStoreSchema<T>;
} & IfElse<
  IsNever<RequiredKey<T>>,
  DefaultsOption<T>,
  Required<DefaultsOption<T>>
>;

/**
 * Use a JSON file to persist key-value data.
 */
export class JsonStore<T extends object = Record<string, unknown>> {
  /**
   * The path to the JSON file for this store
   */
  readonly path: string;

  /**
   * The default values the JSON will be created with and will reset to
   */
  readonly defaults: JsonStoreOptions<T>["defaults"];

  readonly schema?: JsonStoreSchema<T>;

  /**
   * Ensures the JSON matches the schema if provided
   */
  #validator?: ValidateFunction<T>;

  /**
   * Use a JSON file to persist key-value data
   */
  constructor({ name, path, defaults, schema }: JsonStoreOptions<T>) {
    if (!name.endsWith(".json")) name += ".json";
    this.path = resolve(process.cwd(), path, name);

    if (schema) {
      this.schema = schema;
      const ajv = new Ajv({ allErrors: true, useDefaults: true });

      const storeSchema: JSONSchema = {
        type: "object",
        properties: schema,
        additionalProperties: false,
      };

      this.#validator = ajv.compile(storeSchema);
    }

    this.defaults = defaults || ({} as T);
  }

  /**
   * Get the store as an object
   */
  data(): T {
    let raw: string;
    let data: T;

    try {
      raw = readFileSync(this.path, "utf8");
    } catch (err) {
      this.reset();
      return this.defaults as T;
    }

    try {
      data = JSON.parse(raw);
    } catch (err) {
      const backupPath = `${this.path}.bak`;
      writeFileSync(backupPath, raw);
      this.reset();
      console.error(
        `Failed to parse JSON from ${this.path}. The file has been backed up at ${backupPath} and the store has been reset.`,
      );
      return this.defaults as T;
    }

    this.validate(data);
    return data;
  }

  /**
   * Remove the store file
   */
  rm(): void {
    try {
      rmSync(this.path);
    } catch (_) {}
  }

  /**
   * Set the value for a key or multiple keys in the store
   * @param key - The key to set or an object of key-value pairs to set
   * @param value - The value to set the key to if `key` is not an object
   */
  set(values: Partial<T>): void;
  set<K extends keyof T>(key: K, value: T[K]): void;
  set<K extends keyof T>(keyOrValues: K | Partial<T>, value?: T[K]): void {
    const data = this.data();

    if (typeof keyOrValues !== "object" && value) {
      validateSerializable(keyOrValues.toString(), value);
      data[keyOrValues] = value;
    } else {
      for (const [key, value] of Object.entries(keyOrValues)) {
        validateSerializable(key as string, value);
      }
      Object.assign(data, keyOrValues);
    }

    this.save(data);
  }

  /**
   * Get a value from the store by key
   * @param key - The key to get the value for
   * @returns The value of `store[key]`
   */
  get<K extends keyof T>(key: K): T[K] {
    return this.data()[key];
  }

  /**
   * Check to see if the store contains all given keys
   * @param keys - The keys to look for
   * @returns True if all keys exists, false otherwise
   */
  has(...keys: (keyof T)[]): boolean {
    const data = this.data();

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
  delete(...keys: OptionalKey<T>[]): boolean {
    const data = this.data();

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
      this.save(data);
    }

    return didDeleteAll;
  }

  /**
   * Reset config to defaults
   */
  reset() {
    this.save(this.defaults as T);
    return this.defaults;
  }

  /**
   * Throw an error if the data doesn't match the schema
   * @param data - The data to validate against the schema
   */
  private validate(data: T | unknown) {
    if (!this.#validator) return;

    const valid = this.#validator(data);

    if (valid || !this.#validator.errors) return;

    const errors = this.#validator.errors.map(
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
  private save(data: T) {
    this.validate(data);

    const json = JSON.stringify(data, null, 2);

    mkdirSync(dirname(this.path), { recursive: true });

    writeFileSync(this.path, json, {
      encoding: "utf8",
      flag: "w",
    });
  }
}

const invalidTypes = ["undefined", "function", "symbol", "bigint"];

/**
 * Throw an error if a value is not JSON serializable
 * @param key - The key being set (used to provide more context in the error)
 * @param value - The value to validate
 */
function validateSerializable(key: string, value: unknown) {
  if (value === null || invalidTypes.includes(typeof value)) {
    throw new TypeError(
      `Failed to set value of type \`${typeof value}\` for key \`${key}\`. Values must be JSON serializable.`,
    );
  }
}
