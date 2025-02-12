import { DriftError } from "@delvtech/drift";

export class CouncilSdkError extends DriftError {
  constructor(error: any, options?: ErrorOptions) {
    super(error, {
      prefix: "🅲 ",
      name: "Council SDK Error",
      ...options,
    });
  }
}
