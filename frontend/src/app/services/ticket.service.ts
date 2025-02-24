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
      status: StatusEnum.AttentionRequired,
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
      status: StatusEnum.AttentionRequired,
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
}
