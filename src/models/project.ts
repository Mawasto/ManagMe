export interface Project {
    id: string;
    name: string;
    description: string;
}

// Project interface without id for Firestore add
export type NewProject = Omit<Project, 'id'>;