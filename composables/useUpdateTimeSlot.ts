export function useUpdateTimeSlot(block: Partial<Block>, isTimeFrom: boolean, time: string, updateFunction: () => void) {
  if (isTimeFrom) block.timeStart = time;
  else block.timeEnd = time;

  const [hour, minute] = time.split(":").map(Number);
  const timeValue = hour * 60 + minute; // Convert time to minutes for comparison

  // Convert block.timeEnd and block.timeStart to numbers
  const blockTimeStart = block.timeStart ? block.timeStart.split(":").map(Number) : [0, 0];
  const blockTimeEnd = block.timeEnd ? block.timeEnd.split(":").map(Number) : [0, 0];

  const blockTimeStartValue = blockTimeStart[0] * 60 + blockTimeStart[1];
  const blockTimeEndValue = blockTimeEnd[0] * 60 + blockTimeEnd[1];

  // Exit function if nulls
  if (!block || !block.timeEnd || !block.timeStart) return;

  // Compare time values numerically
  if ((isTimeFrom && timeValue > blockTimeEndValue) || (!isTimeFrom && timeValue < blockTimeStartValue)) {
    block.timeEnd = block.timeStart = time;
  }

  // Call the update function if needed
  if (updateFunction) updateFunction();
}
