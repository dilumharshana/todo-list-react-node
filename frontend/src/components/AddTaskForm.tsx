import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import '../styles/AddTaskForm.css';
import type { Task } from '../types';
import { API_BASE_URL } from '../configs';

interface AddTaskFormProps {
    onTaskAdded: (task: Task) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdded }) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            return; // Don't submit empty tasks
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            if (response.ok) {
                const newTask = await response.json();
                onTaskAdded(newTask);
                // Reset form
                setTitle('');
                setDescription('');
            } else {
                console.error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-task-form-container">
            <h2>Add a Task</h2>
            <form onSubmit={handleSubmit} className="add-task-form">
                <div className="form-group">
                    <input
                        type="text"
                        id="title"
                        placeholder="Title"
                        value={title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        id="description"
                        placeholder="Description"
                        value={description}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        className="form-control"
                        rows={3}
                    />
                </div>
                <button
                    type="submit"
                    className="add-button"
                    disabled={isSubmitting || !title.trim()}
                >
                    {isSubmitting ? 'Adding...' : 'Add'}
                </button>
            </form>
        </div>
    );
};

export default AddTaskForm;