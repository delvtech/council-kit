import { Argv, CommandModule, InferredOptionTypes, Options } from "yargs";

// TODO: Make a PR on the yargs repo to add handler argument types for aliases
// and positional arguments.

/**
 * A factory function for creating a `yargs.CommandModule` which includes
 * typed arguments in the `handler` function for option keys *and* aliases.
 *
 * @see https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module
 *
 * @example
 *
 *```ts
 *export const { command, builder, handler } = createCommandModule({
 *  command: "greet [OPTIONS]",
 *  builder: (argv) =>
 *    argv.options({
 *      n: {
 *        alias: ["full-name"],
 *        type: "string",
 *      },
 *    }),
 *  handler: ({ fullName }) => {
 *    // Woohoo! arg types inferred from aliases!
 *    console.log(`Hello, ${fullName}`)
 *  },
 *});
 *```
 */
export function createCommandModule<
  T extends object = object,
  U extends object = object,
  A extends string = string,
>(options: AliasedCommandModule<T, U, A>): AliasedCommandModule<T, U, A> {
  return options;
}

// TypeScript magic

/**
 * `yargs.CommandModule` with a type param for option aliases
 */
interface AliasedCommandModule<
  T extends object = object,
  U extends object = object,
  A extends string = string,
> extends Omit<CommandModule<T, U>, "builder"> {
  builder?: AliasedCommandBuilder<T, U, A> | undefined;
}

/**
 * `yargs.Options.alias` with a type param
 */
type AliasValue<A extends string = string> = A[] | readonly A[] | A;

/**
 * `yargs.Options` with a type param for the alias value
 */
interface AliasedOptions<
  A extends string = string,
  T extends Options["type"] = Options["type"],
> extends Options {
  alias?: AliasValue<A>;
  type?: T;
}

/**
 * Get a union type of the values in `O.alias`
 */
type AliasNames<
  O extends AliasedOptions<A>,
  A extends string = string,
> = O["alias"] extends AliasValue<A> ? O["alias"][number] : never;

/**
 * Get a new `Record` of `AliasedOption`s that includes `T` and a duplicate
 * entry for each value in `A` / alias in the `AliasedOption`
 *
 * @example
 *
 * ```ts
 * type WithAliases = InferredOptionAliases<'n', {
 *   alias: ["name"];
 *   type: "number";
 * }, 'name'>;
 *
 * // results in:
 * // {
 * //   n: {
 * //     alias: ["name"];
 * //     type: "number";
 * //   };
 * //   name: {
 * //     alias: ["name"];
 * //     type: "number";
 * //   };
 * // }
 * ```
 */
type InferredOptionAliases<
  K extends string | number | symbol,
  O extends AliasedOptions<A>,
  A extends string = string,
> = Record<K | AliasNames<O, A>, O>;

/**
 * Get a new `Record` of `AliasedOption`s that extends `T` with a duplicate
 * entry for each value in `A`/alias in the `AliasedOption`
 *
 * @example
 *
 * ```ts
 * type WithAliases = InferredOptionsAliases<
 *   {
 *     n: {
 *       alias: ["name"];
 *       type: "number";
 *     };
 *   },
 *   "name"
 * >;
 *
 * // results in:
 * // {
 * //   n: {
 * //     alias: ["name"];
 * //     type: "number";
 * //   };
 * //   name: {
 * //     alias: ["name"];
 * //     type: "number";
 * //   };
 * // }
 * ```
 */
type WithAliases<
  O extends { [key: string]: AliasedOptions<A> },
  A extends string = string,
> = {
  [K in keyof O]: O[K];
} & {
  [K in keyof O as AliasNames<O[K], A>]: O[K];
};

/**
 * `yargs.CommandBuilder` with a type param for option aliases
 */
type AliasedCommandBuilder<
  T extends object = object,
  U extends object = object,
  A extends string = string,
> =
  | { [key: string]: AliasedOptions<A> }
  | ((args: AliasedArgv<T>) => AliasedArgv<U>)
  | ((args: AliasedArgv<T>) => PromiseLike<AliasedArgv<U>>);

/**
 * `yargs.Argv` with type params for option aliases
 */
type AliasedArgv<T extends object> = Omit<Argv, "option" | "options"> & {
  option<
    K extends keyof T,
    O extends AliasedOptions<A>,
    A extends string = string,
  >(
    key: K,
    options: O,
  ): AliasedArgv<
    Omit<T, keyof O> & InferredOptionTypes<InferredOptionAliases<K, O, A>>
  >;
  option<
    K extends string,
    O extends AliasedOptions<A>,
    A extends string = string,
  >(
    key: K,
    options: O,
  ): AliasedArgv<
    Omit<T, keyof O> & InferredOptionTypes<InferredOptionAliases<K, O, A>>
  >;
  option<
    O extends { [key: string]: AliasedOptions<A> },
    A extends string = string,
  >(
    options: O,
  ): AliasedArgv<Omit<T, keyof O> & InferredOptionTypes<WithAliases<O, A>>>;

  options<
    K extends keyof T,
    O extends AliasedOptions<A>,
    A extends string = string,
  >(
    key: K,
    options: O,
  ): AliasedArgv<
    Omit<T, keyof O> & InferredOptionTypes<InferredOptionAliases<K, O, A>>
  >;
  options<
    K extends string,
    O extends AliasedOptions<A>,
    A extends string = string,
  >(
    key: K,
    options: O,
  ): AliasedArgv<
    Omit<T, keyof O> & InferredOptionTypes<InferredOptionAliases<K, O, A>>
  >;
  options<
    O extends { [key: string]: AliasedOptions<A> },
    A extends string = string,
  >(
    options: O,
  ): AliasedArgv<Omit<T, keyof O> & InferredOptionTypes<WithAliases<O, A>>>;
};
