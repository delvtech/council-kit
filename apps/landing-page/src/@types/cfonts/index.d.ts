//https://github.com/dominikwilkowski/cfonts/blob/released/nodejs/src/Options.js
// https://github.com/dominikwilkowski/cfonts/blob/released/nodejs/src/constants.js
/* eslint-disable */
declare module "cfonts" {
  type GradientColor =
    | "transparent"
    | "black"
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "magenta"
    | "cyan"
    | "white"
    | "gray"
    | "grey";

  export function say(
    msg: string,
    options?: {
      /**
       * define the font face
       */
      font?:
        | "console"
        | "block"
        | "simpleBlock"
        | "simple"
        | "3d"
        | "simple3d"
        | "chrome"
        | "huge"
        | "shade"
        | "slick"
        | "grid"
        | "pallet"
        | "tiny";

      /**
       * define text alignment
       */
      align?: "left" | "center" | "right" | "top" | "bottom";

      /**
       * define all colors
       */
      colors?: (
        | "system"
        | "black"
        | "red"
        | "green"
        | "yellow"
        | "blue"
        | "magenta"
        | "cyan"
        | "white"
        | "gray"
        | "redBright"
        | "greenBright"
        | "yellowBright"
        | "blueBright"
        | "magentaBright"
        | "cyanBright"
        | "whiteBright"
      )[];

      /**
       * define the background color, you can also use `backgroundColor` here as
       * key
       */
      background?: (
        | "transparent"
        | "black"
        | "red"
        | "green"
        | "yellow"
        | "blue"
        | "magenta"
        | "cyan"
        | "white"
        | "blackBright"
        | "redBright"
        | "greenBright"
        | "yellowBright"
        | "blueBright"
        | "magentaBright"
        | "cyanBright"
        | "whiteBright"
      )[];

      /**
       * define letter spacing
       * @default 1
       */
      letterSpacing?: number;

      /**
       * define the line height
       * @default 1
       */
      lineHeight?: number;

      /**
       * define if the output text should have empty lines on top and on the
       * bottom
       * @default true
       */
      space?: boolean;

      /**
       * define how many character can be on one line
       * @default 0
       */
      maxLength?: number;

      /**
       * define your two gradient colors
       * @default false
       */
      gradient?: false | [GradientColor, GradientColor] | [string, string];

      /**
       * define if you want to recalculate the gradient for each new line
       * @default false
       */
      independentGradient?: boolean;

      /**
       * define if this is a transition between colors directly
       * @default false
       */
      transitionGradient?: boolean;

      /**
       * define the environment cfonts is being executed in
       * @default "node"
       */
      env?: "node" | "browser";
    },
  ): void;
}
