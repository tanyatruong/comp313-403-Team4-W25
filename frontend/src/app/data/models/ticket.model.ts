import { StatusEnum } from '../enums/StatusEnum';
import { PriorityEnum } from '../enums/PriorityEnum';
import { SentimentEnum } from '../enums/SentimentEnum';
import { CategoryEnum } from '../enums/CategoryEnum';

export interface Ticket {
  id?: number; // For frontend use - MongoDB's _id will be mapped to this
  userId?: number; // Add this back for compatibility with existing code
  title: string;
  description: string;
  employeeNumber: string; // Reference to employee
  assignedTo: string; // MongoDB ObjectId as string
  status: StatusEnum;
  priority: PriorityEnum;
  category: CategoryEnum;
  sentiment: SentimentEnum;
  comments: {
    user: string; // User ID
    message: string;
    timestamp: Date;
  }[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  dateAndTimeOfCreation?: string;
}

// No duplicate enums - use the ones from separate files
