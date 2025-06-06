import { useState } from "react";
import { ProjectStorage } from "../api/ProjectStorage";
import { v4 as uuidv4 } from "uuid";
import type { Project } from "../models/project";

interface Props {
    onProjectAdded: () => void;
}

export function ProjectForm({ onProjectAdded }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newProject: Project = {
            id: uuidv4(),
            name,
            description,
        };
        ProjectStorage.add(newProject);
        setName("");
        setDescription("");
        onProjectAdded();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Dodaj projekt</h2>
            <input
                placeholder="Nazwa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder="Opis"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Zapisz</button>
        </form>
    );
}
