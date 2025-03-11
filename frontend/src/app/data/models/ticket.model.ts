import { CategoryEnum } from '../enums/CategoryEnum';
import { PriorityEnum } from '../enums/PriorityEnum';
import { SentimentEnum } from '../enums/SentimentEnum';
import { StatusEnum } from '../enums/StatusEnum';

export interface Comment {
  id?: string;
  text: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Attachment {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface Ticket {
  id?: string; // Maps to MongoDB _id
  title: string;
  description: string;
  employeeNumber: string;
  userId?: number; // Optional field for frontend use
  assignedTo?: string; // HR/Admin user ID who is assigned to the ticket
  status: StatusEnum;
  priority: PriorityEnum;
  category: CategoryEnum;
  sentiment?: SentimentEnum;
  comments?: Comment[];
  attachments?: Attachment[];
  createdAt?: Date;
  updatedAt?: Date;

  // Optional fields for UI display purposes
  dateAndTimeOfCreation?: string; // Formatted string for display
}
