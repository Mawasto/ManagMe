import { useEffect, useState } from "react";
import { ProjectStorage } from "../api/ProjectStorage";
import type { Project } from "../models/project";

export function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);

    const loadProjects = () => {
        setProjects(ProjectStorage.getAll());
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleDelete = (id: string) => {
        ProjectStorage.delete(id);
        loadProjects();
    };

    return (
        <div>
            <h2>Lista projektów</h2>
            {projects.length === 0 && <p>Brak projektów</p>}
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>
                        <strong>{project.name}</strong> - {project.description}
                        <button onClick={() => handleDelete(project.id)}>Usuń</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
