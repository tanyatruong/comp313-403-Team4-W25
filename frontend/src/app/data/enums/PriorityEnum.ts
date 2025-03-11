// TODO update logic to accomodate new PriorityEnum
export enum PriorityEnum {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}
// enum: ['Low', 'Medium', 'High'], default: 'Medium'

// Add reusable dropdown options
export const PRIORITY_OPTIONS = [
  { label: 'Low', value: PriorityEnum.Low },
  { label: 'Medium', value: PriorityEnum.Medium },
  { label: 'High', value: PriorityEnum.High },
];

// Helper function to get label
export function getPriorityLabel(priority: PriorityEnum): string {
  return priority;
}
