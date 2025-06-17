export class Story {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  creationDate: Date;
  state: 'todo' | 'doing' | 'done';
  ownerId: string;

  constructor(
    id: string,
    name: string,
    description: string,
    priority: 'low' | 'medium' | 'high',
    projectId: string,
    creationDate: Date,
    state: 'todo' | 'doing' | 'done',
    ownerId: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.projectId = projectId;
    this.creationDate = creationDate;
    this.state = state;
    this.ownerId = ownerId;
  }
}
