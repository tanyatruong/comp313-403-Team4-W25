import { Injectable } from '@angular/core';

import { StatusEnum } from '../data/enums/StatusEnum';
import { type Ticket } from '../data/models/ticket.model';
import { PriorityEnum } from '../data/enums/PriorityEnum';
import { SentimentEnum } from '../data/enums/SentimentEnum';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private dateObj = new Date();

  private tickets: Ticket[] = [
    {
      id: 1,
      userId: 1,
      title: '0',
      description: '0',
      employeeNumber: '0',
      assignedTo: '0',
      status: StatusEnum.Open,
      priority: PriorityEnum.Medium,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      userId: 1,
      title: 't0',
      description: 'd0',
      employeeNumber: '1',
      assignedTo: '2',
      status: StatusEnum.Open,
      priority: PriorityEnum.Medium,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      userId: 1,
      title: 't1',
      description: 'd1',
      employeeNumber: '1',
      assignedTo: '2',
      status: StatusEnum.Open,
      priority: PriorityEnum.High,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      userId: 1,
      title: 't2',
      description: 'd2',
      employeeNumber: '1',
      assignedTo: '2',
      status: StatusEnum.Open,
      priority: PriorityEnum.Low,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      userId: 1,
      title: 't3',
      description: 'd3',
      employeeNumber: '1',
      assignedTo: '2',
      status: StatusEnum.InProgress,
      priority: PriorityEnum.Medium,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 6,
      userId: 1,
      title: 't4',
      description: 'd4',
      employeeNumber: '1',
      assignedTo: '2',
      status: StatusEnum.Resolved,
      priority: PriorityEnum.Medium,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 7,
      userId: 1,
      title: 't5',
      description: 'd5',
      employeeNumber: '1',
      assignedTo: '2',
      status: StatusEnum.Closed,
      priority: PriorityEnum.Medium,
      category: '?',
      sentiment: SentimentEnum.Neutral,
      comments: [],
      attachments: ['attachment0', 'attachment1', 'attachment2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
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

    const newTicket: Ticket = {
      id: this.tickets.length + 1,
      userId: ticketData.userId || 0,
      status: ticketData.status || StatusEnum.Open,
      title: ticketData.title || '',
      description: ticketData.description || '',
      employeeNumber: ticketData.employeeNumber || '',
      assignedTo: ticketData.assignedTo || '',
      priority: ticketData.priority || PriorityEnum.Medium,
      category: ticketData.category || '?',
      sentiment: ticketData.sentiment || SentimentEnum.Neutral,
      comments: ticketData.comments || [],
      attachments: ticketData.attachments || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tickets.unshift(newTicket);
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
      this.tickets[ticketIndex] = {
        ...this.tickets[ticketIndex],
        assignedTo: hrUserId,
        updatedAt: new Date(),
      };
      return true;
    }
    return false;
  }

  // Update ticket status
  updateTicketStatus(ticketId: number, newStatus: StatusEnum): boolean {
    const ticketIndex = this.tickets.findIndex(
      (ticket) => ticket.id === ticketId
    );

    if (ticketIndex !== -1) {
      this.tickets[ticketIndex] = {
        ...this.tickets[ticketIndex],
        status: newStatus,
        updatedAt: new Date(),
      };
      return true;
    }
    return false;
  }

  // Update ticket priority
  updateTicketPriority(ticketId: number, priority: PriorityEnum) {
    const ticketIndex = this.tickets.findIndex(
      (ticket) => ticket.id === ticketId
    );

    if (ticketIndex !== -1) {
      this.tickets[ticketIndex] = {
        ...this.tickets[ticketIndex],
        priority: priority,
        updatedAt: new Date(),
      };
      return true;
    }
    return false;
  }
}
