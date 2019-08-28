import { Project } from '../add-project/project';
import { ParentTask } from './parent-task';
import { User } from '../add-user/user';

export class Task {
    taskId: number;
    parentTask: ParentTask;
    project: Project;
    user: User;
    taskName: string;
    startDate: Date;
    endDate: Date;
    priority: number;
    status: string;
}
