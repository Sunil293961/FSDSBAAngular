import { User } from '../add-user/user';

export class Project {
    // tslint:disable-next-line: variable-name
    projectId: number;
    projectName: string;
    startDate: Date;
    endDate: Date;
    priority: number;
    user: User = new User();
    tasksCount: number;
    completedTasks: number;
}
