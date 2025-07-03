import { useEffect, useState } from "react";
import { ProjectStorage } from "../api/ProjectStorage";
import type { Project } from "../models/project";

interface ProjectListProps {
    onProjectSelected: (projectId: string) => void;
    refresh: boolean; // Add refresh prop type
    theme: 'light' | 'dark';
}

export function ProjectList({ onProjectSelected, refresh, theme }: ProjectListProps) {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        async function fetchProjects() {
            const data = await ProjectStorage.getAll();
            setProjects(data);
        }

        fetchProjects();
    }, [refresh]);

    const handleDelete = async (id: string) => {
        await ProjectStorage.delete(id);
        const data = await ProjectStorage.getAll();
        setProjects(data);
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
        <div className={`p-3 rounded shadow-sm border mt-2 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-body-tertiary text-dark border'}`} style={{ minWidth: 340 }}>
            <h2>Lista projektów</h2>
            {projects.length === 0 && <p>Brak projektów</p>}
            <ul className="mb-0">
                {projects.map((project) => (
                    <li key={project.id} className="mb-2">
                        <strong>{project.name}</strong> - {project.description}
                        <button onClick={() => handleSelectProject(project.id)} className={`btn btn-sm ms-2 ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Wybierz projekt</button>
                        <button onClick={() => handleDelete(project.id)} className={`btn btn-sm ms-2 ${theme === 'dark' ? 'btn-outline-danger' : 'btn-outline-secondary'}`}>Usuń</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
