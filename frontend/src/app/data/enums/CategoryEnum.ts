export enum CategoryEnum {
  General = 'General',
  Technical = 'Technical',
  Payroll = 'Payroll',
  Benefits = 'Benefits',
  Facilities = 'Facilities',
}

// Add reusable dropdown options with more descriptive labels
export const CATEGORY_OPTIONS = [
  { label: 'General Inquiry', value: CategoryEnum.General },
  { label: 'Technical Support', value: CategoryEnum.Technical },
  { label: 'Payroll Issue', value: CategoryEnum.Payroll },
  { label: 'Benefits Question', value: CategoryEnum.Benefits },
  { label: 'Office Facilities', value: CategoryEnum.Facilities },
];

// Helper function to get label
export function getCategoryLabel(category: CategoryEnum): string {
  switch (category) {
    case CategoryEnum.General:
      return 'General Inquiry';
    case CategoryEnum.Technical:
      return 'Technical Support';
    case CategoryEnum.Payroll:
      return 'Payroll Issue';
    case CategoryEnum.Benefits:
      return 'Benefits Question';
    case CategoryEnum.Facilities:
      return 'Office Facilities';
    default:
      return category;
  }
}
