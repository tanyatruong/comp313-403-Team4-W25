import { Injectable } from '@angular/core';

import { StatusEnum } from '../data/enums/StatusEnum';
import { type Ticket } from '../data/models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private dateObj = new Date();

  private tickets = [
    {
      id: 1,
      userId: 1,
      status: StatusEnum.Open,
      title: 'title1', //Complete Onboarding
      description: 'description1', //Have meeting with team lead and HR personnel to complete onboarding process. \nWelcome To the company! :D
      dateAndTimeOfCreation:
        this.dateObj.getFullYear() +
        '/' +
        this.dateObj.getMonth() +
        '/' +
        this.dateObj.getDate() +
        ' @ ' +
        this.dateObj.getHours() +
        ':' +
        this.dateObj.getMinutes() +
        ':' +
        this.dateObj.getSeconds(),
    },
    {
      id: 2,
      userId: 2,
      status: StatusEnum.InProgress,
      title: 'title2', //Filing for Disability
      description: 'description2', //Filing for Disability
      dateAndTimeOfCreation:
        this.dateObj.getFullYear() +
        '/' +
        this.dateObj.getMonth() +
        '/' +
        this.dateObj.getDate() +
        ' @ ' +
        this.dateObj.getHours() +
        ':' +
        this.dateObj.getMinutes() +
        ':' +
        this.dateObj.getSeconds(),
    },
    {
      id: 3,
      userId: 2,
      status: StatusEnum.Closed,
      title: 'title3',
      description: 'description3',
      dateAndTimeOfCreation:
        this.dateObj.getFullYear() +
        '/' +
        this.dateObj.getMonth() +
        '/' +
        this.dateObj.getDate() +
        ' @ ' +
        this.dateObj.getHours() +
        ':' +
        this.dateObj.getMinutes() +
        ':' +
        this.dateObj.getSeconds(),
    },
    {
      id: 4,
      userId: 3,
      status: StatusEnum.InProgress,
      title: 'title4', //PTO request for mid February
      description: 'description4', // I am requesting PTO for mid February
      dateAndTimeOfCreation:
        this.dateObj.getFullYear() +
        '/' +
        this.dateObj.getMonth() +
        '/' +
        this.dateObj.getDate() +
        ' @ ' +
        this.dateObj.getHours() +
        ':' +
        this.dateObj.getMinutes() +
        ':' +
        this.dateObj.getSeconds(),
    },
    {
      id: 5,
      userId: 3,
      status: StatusEnum.Open,
      title: 'title5',
      description: 'description5',
      dateAndTimeOfCreation:
        this.dateObj.getFullYear() +
        '/' +
        this.dateObj.getMonth() +
        '/' +
        this.dateObj.getDate() +
        ' @ ' +
        this.dateObj.getHours() +
        ':' +
        this.dateObj.getMinutes() +
        ':' +
        this.dateObj.getSeconds(),
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
  
    const newTicket = {
      id: this.tickets.length + 1, // Simple ID generation for demo
      userId: ticketData.userId || 0,
      // Fix: Ensure status is a StatusEnum value
      status: ticketData.status || StatusEnum.Open,
      title: ticketData.title || '',
      description: ticketData.description || '',
      dateAndTimeOfCreation: formattedDate
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
    return this.tickets.filter(ticket => ticket.status === status);
  }
  
  // Assign ticket to HR representative
  assignTicket(ticketId: number, hrUserId: string) {
    const ticketIndex = this.tickets.findIndex(ticket => ticket.id === ticketId);
    
    if (ticketIndex !== -1) {
      // Use type assertion to tell TypeScript this is a Ticket
      this.tickets[ticketIndex] = {
        ...(this.tickets[ticketIndex] as Ticket),
        assignedToId: hrUserId
      } as Ticket;
      return true;
    }
    return false;
  }
  
  // Update ticket status
  updateTicketStatus(ticketId: number, newStatus: StatusEnum) {
    const ticketIndex = this.tickets.findIndex(ticket => ticket.id === ticketId);
    
    if (ticketIndex !== -1) {
      this.tickets[ticketIndex].status = newStatus;
      return true;
    }
    return false;
  }
  
  // Update ticket priority
  updateTicketPriority(ticketId: number, priority: 'Low' | 'Medium' | 'High') {
    const ticketIndex = this.tickets.findIndex(ticket => ticket.id === ticketId);
    
    if (ticketIndex !== -1) {
      this.tickets[ticketIndex] = {
        ...(this.tickets[ticketIndex] as Ticket),
        priority: priority
      } as Ticket;
      return true;
    }
    return false;
  }
}
