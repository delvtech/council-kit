import { z } from "zod";

export const Hex = z
  .string()
  .refine((s): s is `0x${string}` => s.startsWith("0x"), {
    message: "must start with 0x",
  });
export type Hex = z.infer<typeof Hex>;

export const Decimal = z.string().refine((s): s is `${number}` => !isNaN(+s), {
  message: "must be a decimal number string",
});
export type Decimal = z.infer<typeof Decimal>;
