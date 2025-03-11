// ['Open', 'In Progress', 'Resolved', 'Closed']
// TODO update logic to accomodate new StatusEnum
export enum StatusEnum {
  Open = 'Open',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
  AttentionRequired = 'Attention Required',
}

// Add a static object for dropdown options to reuse across components
export const STATUS_OPTIONS = [
  { label: 'Open', value: StatusEnum.Open },
  { label: 'In Progress', value: StatusEnum.InProgress },
  { label: 'Resolved', value: StatusEnum.Resolved },
  { label: 'Closed', value: StatusEnum.Closed },
  { label: 'Attention Required', value: StatusEnum.AttentionRequired },
];

// You could also add a mapping function
export function getStatusLabel(status: StatusEnum): string {
  return status; // Since your enum values are already human-readable
}
