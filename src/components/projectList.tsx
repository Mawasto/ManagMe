import { useEffect, useState } from "react";
import { ProjectStorage } from "../api/ProjectStorage";
import type { Project } from "../models/project";

interface ProjectListProps {
    onProjectSelected: (projectId: string) => void;
    refresh: boolean;
    theme: 'light' | 'dark';
}


export function ProjectList({ onProjectSelected, refresh, theme }: ProjectListProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editProjectId, setEditProjectId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");

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
        if (ProjectStorage.getCurrentProject() === id && onProjectSelected) {
            onProjectSelected('');
        }
    };

    const handleEdit = (project: Project) => {
        setEditProjectId(project.id);
        setEditName(project.name);
        setEditDescription(project.description);
    };

    const handleEditCancel = () => {
        setEditProjectId(null);
        setEditName("");
        setEditDescription("");
    };

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editProjectId) return;
        await ProjectStorage.update({ id: editProjectId, name: editName, description: editDescription });
        setEditProjectId(null);
        setEditName("");
        setEditDescription("");
        const data = await ProjectStorage.getAll();
        setProjects(data);
    };

    const handleSelectProject = (projectId: string) => {
        ProjectStorage.setCurrentProject(projectId);
        if (onProjectSelected) {
            onProjectSelected(projectId);
        }
    };

    if (projects.length === 0) return null;

    return (
        <div className={`p-3 rounded shadow-sm border mt-2 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-body-tertiary text-dark border'}`} style={{ minWidth: 340 }}>
            <h2>Lista projektów</h2>
            <ul className="mb-0">
                {projects.map((project) => (
                    <li key={project.id} className="mb-2">
                        {editProjectId === project.id ? (
                            <form onSubmit={handleEditSave} className="d-inline-block w-100">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="form-control form-control-sm mb-1"
                                    required
                                />
                                <input
                                    type="text"
                                    value={editDescription}
                                    onChange={e => setEditDescription(e.target.value)}
                                    className="form-control form-control-sm mb-1"
                                    required
                                />
                                <button type="submit" className={`btn btn-sm me-1 ${theme === 'dark' ? 'btn-outline-success' : 'btn-outline-primary'}`}>Zapisz</button>
                                <button type="button" onClick={handleEditCancel} className="btn btn-sm btn-outline-secondary">Anuluj</button>
                            </form>
                        ) : (
                            <>
                                <strong>{project.name}</strong> - {project.description}
                                <button onClick={() => handleSelectProject(project.id)} className={`btn btn-sm ms-2 ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Wybierz projekt</button>
                                <button onClick={() => handleEdit(project)} className={`btn btn-sm ms-2 ${theme === 'dark' ? 'btn-outline-warning' : 'btn-outline-primary'}`}>Edytuj</button>
                                <button onClick={() => handleDelete(project.id)} className={`btn btn-sm ms-2 ${theme === 'dark' ? 'btn-outline-danger' : 'btn-outline-secondary'}`}>Usuń</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
