/**
 * Splits an array into chunks. The last chunk can be partially full.
 * @param  arr - the array to be split
 * @returns two dimensional array of n chunks.
 */
export function chunkArray<E>(arr: Array<E>, size: number): E[][] {
  // calculate number of chunks
  const numOfChunks = Math.ceil(arr.length / size);
  // slice the chunks and append to new array
  const result = [];
  for (let i = 0; i < numOfChunks; i++) {
    const start = i * size;
    const end = start + size;

    result.push(arr.slice(start, end));
  }

  return result;
}
