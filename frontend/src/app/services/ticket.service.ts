import { Injectable } from '@angular/core';

import { StatusEnum } from '../data/enums/StatusEnum';
import { type Ticket } from '../data/models/ticket.model';
import { PriorityEnum } from '../data/enums/PriorityEnum';
import { SentimentEnum } from '../data/enums/SentimentEnum';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private dateObj = new Date();

  private tickets = [
    {
      title: '0',
      description: '0',
      employeeNumber: '0', //mongoose.Schema.Types.ObjectId of (User) employee
      assignedTo: '0', //mongoose.Schema.Types.ObjectId of (User) HR Employee
      status: StatusEnum.Open, //enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open'
      pritority: PriorityEnum.Medium, //enum: ['Low', 'Medium', 'High'], default: 'Medium'
      category: '?',
      sentiment: SentimentEnum.Neutral, // enum: ['positive', 'neutral', 'negative'], default: 'neutral'
      comments: [
        // {
        //   user: 'string', //user who wrote message in chat
        //   message: 'string', //text of message
        //   timestamp: Date, //when message was sent
        // },
      ],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 't0',
      description: 'd0',
      employeeNumber: '1',
      assignedTo: '2',
      status: StatusEnum.Open,
      pritority: PriorityEnum.Medium,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [
        // {
        //   user: 'string',
        //   message: 'string',
        //   timestamp: new Date(),
        // },
      ],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 't1',
      description: 'd1',
      employeeNumber: '1',
      assignedTo: '2',
      status: StatusEnum.Open,
      pritority: PriorityEnum.High,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [
        // {
        //   user: 'string',
        //   message: 'string',
        //   timestamp: new Date(),
        // },
      ],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 't2',
      description: 'd2',
      employeeNumber: '1',
      assignedTo: '2',
      status: StatusEnum.Open,
      pritority: PriorityEnum.Low,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [
        // {
        //   user: 'string',
        //   message: 'string',
        //   timestamp: new Date(),
        // },
      ],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 't3',
      description: 'd3',
      employeeNumber: '1',
      assignedTo: '2',
      status: StatusEnum.InProgress,
      pritority: PriorityEnum.Medium,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [
        // {
        //   user: 'string',
        //   message: 'string',
        //   timestamp: new Date(),
        // },
      ],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 't4',
      description: 'd4',
      employeeNumber: '1',
      assignedTo: '2',
      status: StatusEnum.Resolved,
      pritority: PriorityEnum.Medium,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [
        // {
        //   user: 'string',
        //   message: 'string',
        //   timestamp: new Date(),
        // },
      ],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 't5',
      description: 'd5',
      employeeNumber: '1',
      assignedTo: '2',
      status: StatusEnum.Closed,
      pritority: PriorityEnum.Medium,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [
        // {
        //   user: 'string',
        //   message: 'string',
        //   timestamp: new Date(),
        // },
      ],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // {
    //   id: 8,
    //   userId: 3,
    //   status: StatusEnum.Closed,
    //   title: 'title8',
    //   description: 'description8',
    //   dateAndTimeOfCreation:
    //     this.dateObj.getFullYear() +
    //     '/' +
    //     this.dateObj.getMonth() +
    //     '/' +
    //     this.dateObj.getDate() +
    //     ' @ ' +
    //     this.dateObj.getHours() +
    //     ':' +
    //     this.dateObj.getMinutes() +
    //     ':' +
    //     this.dateObj.getSeconds(),
    // },
  ];

  public currentTicket: Ticket | undefined;

  //   constructor() {
  //     const tasks = localStorage.getItem('tasks');

  //     if (tasks) {
  //       this.tasks = JSON.parse(tasks);
  //     }
  //   }

  getOpenTicketsByUserId(userId: number) {
    return this.tickets.filter(
      (ticket) => ticket.userId === userId && ticket.status === StatusEnum.Open
    );
  }

  //   addTask(taskData: NewTaskData, userId: string) {
  //     this.tasks.unshift({
  //       id: new Date().getTime().toString(),
  //       userId: userId,
  //       title: taskData.title,
  //       summary: taskData.summary,
  //       dueDate: taskData.date,
  //     });
  //     this.saveTasks();
  //   }

  //   removeTask(id: string) {
  //     this.tasks = this.tasks.filter((task) => task.id !== id);
  //     this.saveTasks();
  //   }

  //   private saveTasks() {
  //     localStorage.setItem('tasks', JSON.stringify(this.tasks));
  //   }

  createTicket(ticketData: Partial<Ticket>) {
    const dateObj = new Date();
    const formattedDate =
      dateObj.getFullYear() +
      '/' +
      dateObj.getMonth() +
      '/' +
      dateObj.getDate() +
      ' @ ' +
      dateObj.getHours() +
      ':' +
      dateObj.getMinutes() +
      ':' +
      dateObj.getSeconds();

    const newTicket = {
      id: this.tickets.length + 1, // Simple ID generation for demo
      userId: ticketData.userId || 0,
      // Fix: Ensure status is a StatusEnum value
      status: ticketData.status || StatusEnum.Open,
      title: ticketData.title || '',
      description: ticketData.description || '',
      dateAndTimeOfCreation: formattedDate,
    };

    this.tickets.unshift(newTicket); // Add to beginning of array
    return newTicket;
  }

  // Method to get all tickets for HR dashboard
  getAllTickets() {
    return this.tickets;
  }

  // Get tickets filtered by status
  getTicketsByStatus(status: StatusEnum) {
    return this.tickets.filter((ticket) => ticket.status === status);
  }

  // Assign ticket to HR representative
  assignTicket(ticketId: number, hrUserId: string) {
    const ticketIndex = this.tickets.findIndex(
      (ticket) => ticket.id === ticketId
    );

    if (ticketIndex !== -1) {
      // Use type assertion to tell TypeScript this is a Ticket
      this.tickets[ticketIndex] = {
        ...(this.tickets[ticketIndex] as Ticket),
        assignedToId: hrUserId,
      } as Ticket;
      return true;
    }
    return false;
  }

  // Update ticket status
  updateTicketStatus(ticketId: number, newStatus: StatusEnum) {
    const ticketIndex = this.tickets.findIndex(
      (ticket) => ticket.id === ticketId
    );

    if (ticketIndex !== -1) {
      this.tickets[ticketIndex].status = newStatus;
      return true;
    }
    return false;
  }

  // Update ticket priority
  updateTicketPriority(ticketId: number, priority: 'Low' | 'Medium' | 'High') {
    const ticketIndex = this.tickets.findIndex(
      (ticket) => ticket.id === ticketId
    );

    if (ticketIndex !== -1) {
      this.tickets[ticketIndex] = {
        ...(this.tickets[ticketIndex] as Ticket),
        priority: priority,
      } as Ticket;
      return true;
    }
    return false;
  }
}
