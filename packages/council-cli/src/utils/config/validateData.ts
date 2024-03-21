import ajv from "ajv";
import type { JSONSchema } from "json-schema-typed";

const Ajv = ajv.default;

/**
 * A JSONSchema based on `T`
 */
export type Schema<T> =
  T extends Array<infer U>
    ? {
        type: "array";
        items: Schema<U>;
      }
    : T extends object
      ? JSONSchema<T> & {
          type: "object";
          properties: {
            [K in keyof T]-?: Schema<T[K]>;
          };
        }
      : JSONSchema<T>;

/**
 * Validate `data` against `schema` and throw a `TypeError` if it doesn't match
 * @param data The data to validate
 * @param schema A `JSONSchema` from
 *  [json-schema-typed](https://www.npmjs.com/package/json-schema-typed) that
 *  matches the type of `data`.
 *
 * @example
 *
 * const schema = {
 *   type: "object",
 *   properties: {
 *     foo: { type: "string" },
 *   },
 *   required: ["foo"],
 *   additionalProperties: false,
 * };
 *
 * // Passes
 * validateValue({ foo: "bar" }, schema);
 *
 * // Throws
 * validateValue({ foo: 123 }, schema);
 * validateValue({}, schema);
 * validateValue({ foo: "bar", bar: "baz" }, schema);
 */
export function validateData<T extends object | any[]>(
  data: T,
  schema: Schema<T>,
): void {
  const ajv = new Ajv({ allErrors: true, useDefaults: true });
  const validator = ajv.compile(schema);

  const valid = validator(data);

  if (valid || !validator.errors) {
    return;
  }

  const errors = validator.errors.map(
    ({ instancePath, message = "", params }) => {
      if (params.additionalProperty) {
        return `property \`${params.additionalProperty}\` not allowed`;
      }
      return `\`${instancePath.slice(1)}\` ${message}`;
    },
  );
  throw new TypeError(`Schema violation: ${errors.join("; ")}`);
}
