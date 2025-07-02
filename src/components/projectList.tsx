import { useEffect, useState } from "react";
import { ProjectStorage } from "../api/ProjectStorage";
import type { Project } from "../models/project";

interface ProjectListProps {
    onProjectSelected: (projectId: string) => void;
    refresh: boolean; // Add refresh prop type
    theme: 'light' | 'dark';
}

export function ProjectList({ onProjectSelected, refresh, theme }: ProjectListProps) {
    const [projects, setProjects] = useState<Project[]>(ProjectStorage.getAll());

    useEffect(() => {
        setProjects(ProjectStorage.getAll());
    }, [refresh]);

    const handleDelete = (id: string) => {
        ProjectStorage.delete(id);
        setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
        // Jeśli usunięto wybrany projekt, wyczyść wybór w rodzicu
        if (ProjectStorage.getCurrentProject() === id && onProjectSelected) {
            onProjectSelected(''); // Przekaż pusty string, aby wyczyścić wybór
        }
    };

    const handleSelectProject = (projectId: string) => {
        ProjectStorage.setCurrentProject(projectId);
        if (onProjectSelected) {
            onProjectSelected(projectId); // Pass the projectId to the parent handler
        }
    };

    return (
        <div>
            <h2>Lista projektów</h2>
            {projects.length === 0 && <p>Brak projektów</p>}
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>
                        <strong>{project.name}</strong> - {project.description}
                        <button onClick={() => handleSelectProject(project.id)} className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Wybierz projekt</button>
                        <button onClick={() => handleDelete(project.id)} className={`btn ${theme === 'dark' ? 'btn-outline-danger' : 'btn-outline-secondary'}`}>Usuń</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
