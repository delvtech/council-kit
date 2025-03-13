import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import type { IfElse, IsNever, OptionalKey, RequiredKey } from "./types.js";

type DefaultsOption<T extends z.ZodTypeAny> = {
  /**
   * The default values the JSON will be created with and will reset to
   */
  defaults?: z.infer<T>;
};

/**
 * Options for the `JSONStore` class
 */
export type JsonStoreOptions<T extends z.ZodTypeAny> = {
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
   * @see [Zod](https://zod.dev)
   */
  schema?: T;
} & IfElse<
  IsNever<RequiredKey<z.infer<T>>>,
  DefaultsOption<T>,
  Required<DefaultsOption<T>>
>;

/**
 * Use a JSON file to persist key-value data.
 */
export class JsonStore<T extends z.AnyZodObject> {
  /**
   * The path to the JSON file for this store
   */
  readonly path: string;

  /**
   * The default values the JSON will be created with and will reset to
   */
  readonly defaults: JsonStoreOptions<T>["defaults"];

  readonly schema: T;

  /**
   * Use a JSON file to persist key-value data
   */
  constructor({
    name,
    path,
    defaults,
    schema = z.object({}).passthrough() as T,
  }: JsonStoreOptions<T>) {
    if (!name.endsWith(".json")) name += ".json";
    this.path = resolve(process.cwd(), path, name);
    this.schema = schema;
    this.defaults = defaults || {};
  }

  /**
   * Get the store as an object
   */
  data(): z.infer<T> {
    type Data = z.infer<T>;
    let json: string;

    try {
      json = readFileSync(this.path, "utf8");
    } catch (err) {
      this.reset();
      return this.defaults as Data;
    }

    try {
      return this.#parse(JSON.parse(json));
    } catch (err) {
      const backupPath = `${this.path}.bak`;
      writeFileSync(backupPath, json);
      this.reset();
      console.error(
        `Failed to parse JSON from ${this.path}. The file has been backed up at ${backupPath} and the store has been reset.`,
      );
      return this.defaults as Data;
    }
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
  set(values: Partial<z.infer<T>>): void;
  set<K extends keyof z.infer<T>>(key: K, value: z.infer<T>[K]): void;
  set<K extends keyof z.infer<T>>(
    keyOrValues: K | Partial<z.infer<T>>,
    value?: z.infer<T>[K],
  ): void {
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

    this.#save(data);
  }

  /**
   * Get a value from the store by key
   * @param key - The key to get the value for
   * @returns The value of `store[key]`
   */
  get<K extends keyof z.infer<T>>(key: K): z.infer<T>[K];
  get<K extends keyof z.infer<T>>(...keys: K[]): Pick<z.infer<T>, K>;
  get<K extends keyof z.infer<T>>(key: K, ...restKeys: K[]) {
    const data = this.data();
    return restKeys.length === 0
      ? data[key]
      : Object.fromEntries([
          [key, data[key]],
          ...Object.entries(data).filter(([k]) => restKeys.includes(k as any)),
        ]);
  }

  /**
   * Check to see if the store contains all given keys
   * @param keys - The keys to look for
   * @returns True if all keys exists, false otherwise
   */
  has<T extends string>(...keys: T[]): boolean {
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
  delete(...keys: OptionalKey<z.infer<T>>[]): boolean {
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
      this.#save(data);
    }

    return didDeleteAll;
  }

  /**
   * Reset config to defaults
   */
  reset() {
    this.#save(this.defaults as z.infer<T>);
    return this.defaults;
  }

  /**
   * Throw an error if the data doesn't match the schema
   * @param data - The data to validate against the schema
   */
  #parse(data: unknown): z.infer<T> {
    try {
      return this.schema.parse(data);
    } catch (err) {
      throw new Error(fromError(err).toString());
    }
  }

  /**
   * Save the store as JSON
   * @param data - The store data
   */
  #save(data: z.infer<T>) {
    data = this.#parse(data);

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
