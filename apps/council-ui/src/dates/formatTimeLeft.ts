import { formatDuration, intervalToDuration, isPast } from "date-fns";

export interface FormatTimeLeftOptions {
  /**
   * The label to show if the end date has past
   */
  endedLabel?: string;
}

/**
 * Returns a human-readable label for how much time is left between now and the
 * given end date.
 * @param end - The `Date` or timestamp of the end date
 */
export function formatTimeLeft(
  end: number | Date,
  options?: FormatTimeLeftOptions,
): string {
  const { endedLabel = "ended" } = options || {};

  if (isPast(end)) {
    return endedLabel;
  }

  const duration = intervalToDuration({
    start: Date.now(),
    end,
  });
  const { months, weeks, days, hours, minutes } = duration;

  if (!minutes) {
    return "less than a minute";
  }

  let format = ["minutes"];

  if (months) {
    format = ["months"];
  } else if (weeks) {
    format = ["weeks"];
  } else if (days) {
    format = ["days"];
  } else if (hours) {
    format = ["hours"];
  }

  return formatDuration(duration, {
    delimiter: ", ",
    format,
  });
}
