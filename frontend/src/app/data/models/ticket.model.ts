import { StatusEnum } from "../enums/StatusEnum";

export interface Ticket {
  id: number;
  userId: number; // user who created the ticket
  assignedToId?: string; // HR representative assigned to ticket
  status: StatusEnum;
  title: string;
  description: string;
  dateAndTimeOfCreation: string;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
}
