export type TaskState = 'todo' | 'doing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export class Task {
  id: string;
  name: string;
  description: string;
  priority: TaskPriority;
  storyId: string;
  estimatedHours: number;
  state: TaskState;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
  assignedUserId?: string;
  actualHours?: number;

  constructor(
    id: string,
    name: string,
    description: string,
    priority: TaskPriority,
    storyId: string,
    estimatedHours: number,
    state: TaskState = 'todo',
    createdAt: Date = new Date(),
    startedAt?: Date,
    finishedAt?: Date,
    assignedUserId?: string,
    actualHours?: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.storyId = storyId;
    this.estimatedHours = estimatedHours;
    this.state = state;
    this.createdAt = createdAt;
    this.startedAt = startedAt;
    this.finishedAt = finishedAt;
    this.assignedUserId = assignedUserId;
    this.actualHours = actualHours;
  }
}
