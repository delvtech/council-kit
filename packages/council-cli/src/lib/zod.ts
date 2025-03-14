import { z } from "zod";

export const HexString = z
  .string()
  .refine(
    (s): s is `0x${string}` => /^0x[a-fA-F0-9]*$/.test(s),
    "Invalid hex string",
  );

export const Address = z
  .string()
  .refine(
    (s): s is `0x${string}` => /^0x[a-fA-F0-9]{40}$/.test(s),
    "Invalid address",
  );
export type Address = z.infer<typeof Address>;

export const DecimalString = z
  .string()
  .refine((s): s is `${number}` => !isNaN(+s), "Invalid decimal string");
export type DecimalString = z.infer<typeof DecimalString>;

/**
 * An empty string coerced to `undefined` or `undefined` itself. Useful for
 * representing empty environment variables.
 */
export const Empty = z
  .literal("")
  .optional()
  .transform(() => undefined);
