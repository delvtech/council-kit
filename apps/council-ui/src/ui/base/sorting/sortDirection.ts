export type SortDirection = "ASC" | "DESC";

// simple state machine for sort state transitions
export function toggleSortDirection(
  currentDirection: SortDirection | undefined,
  primaryDirection: SortDirection = "DESC",
): SortDirection | undefined {
  const secondaryDirection = oppositeDirection[primaryDirection];
  switch (currentDirection) {
    case primaryDirection:
      return secondaryDirection;
    case secondaryDirection:
      return undefined;
    default:
      return primaryDirection;
  }
}

const oppositeDirection: Record<SortDirection, SortDirection> = {
  ASC: "DESC",
  DESC: "ASC",
};
