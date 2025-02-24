export interface Ticket {
  id: number;
  userId: number; //user to whom this task belongs to
  status: string; //open, missing documents(attention required), closed, etc.
  title: string;
  description: string;
  dateAndTimeOfCreation: string;
}
