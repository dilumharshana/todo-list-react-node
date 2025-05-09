import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import '../styles/AddTaskForm.css';
import type { Task } from '../types';
import { API_BASE_URL } from '../configs';

interface AddTaskFormProps {
    onTaskAdded: (task: Task) => void;
    onCancel?: () => void; // Optional prop for cancellation
}

// Max character limits for fields
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdded, onCancel }) => {
    // Form state
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Validation state
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
    }>({});

    // Track if fields have been touched (for validation on blur)
    const [touched, setTouched] = useState<{
        title: boolean;
        description: boolean;
    }>({
        title: false,
        description: false
    });

    // Validate the title field
    const validateTitle = (value: string): string | undefined => {
        if (!value.trim()) {
            return 'Task title is required';
        }
        if (value.trim().length < 3) {
            return 'Title must be at least 3 characters';
        }
        if (value.length > MAX_TITLE_LENGTH) {
            return `Title cannot exceed ${MAX_TITLE_LENGTH} characters`;
        }
        return undefined;
    };

    // Handle field changes with validation
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);

        // Only show errors after user has interacted with the field
        if (touched.title) {
            const error = validateTitle(newTitle);
            setErrors(prev => ({ ...prev, title: error }));
        }
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newDescription = e.target.value;
        // Prevent exceeding max length
        if (newDescription.length <= MAX_DESCRIPTION_LENGTH) {
            setDescription(newDescription);
        }
    };

    // Handle field blur events for validation
    const handleBlur = (field: 'title' | 'description') => {
        setTouched(prev => ({ ...prev, [field]: true }));

        if (field === 'title') {
            const error = validateTitle(title);
            setErrors(prev => ({ ...prev, title: error }));
        }
    };

    // Form submission handler
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate all fields before submitting
        const titleError = validateTitle(title);

        if (titleError) {
            setErrors({ title: titleError });
            setTouched({ title: true, description: true });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: title.trim(), description: description.trim() }),
            });

            if (response.ok) {
                const newTask = await response.json();
                onTaskAdded(newTask);

                // Reset form and validation states
                setTitle('');
                setDescription('');
                setErrors({});
                setTouched({ title: false, description: false });
            } else {
                // Handle API error response
                const errorData = await response.json().catch(() => null);
                setErrors({
                    title: errorData?.errors?.title || 'Failed to add task. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error adding task:', error);
            setErrors({
                title: 'Network error. Please check your connection and try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to determine character counter class based on length
    const getCharCounterClass = (current: number, max: number) => {
        if (current >= max) return 'char-counter limit-reached';
        if (current >= max * 0.8) return 'char-counter limit-close';
        return 'char-counter';
    };

    return (
        <div className="add-task-form-container">
            <h2>
                {/* Uncomment if using icons */}
                {/* <PlusCircle size={20} /> */}
                Add a Task
            </h2>

            <form onSubmit={handleSubmit} className="add-task-form">
                <div className={`form-group ${errors.title && touched.title ? 'has-error' : ''}`}>
                    <label htmlFor="title">Task Title</label>
                    <input
                        type="text"
                        id="title"
                        placeholder="What needs to be done?"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={() => handleBlur('title')}
                        className="form-control"
                        disabled={isSubmitting}
                        maxLength={MAX_TITLE_LENGTH + 1} // +1 to allow validation to trigger
                    />
                    {touched.title && errors.title && (
                        <div className="error-message">{errors.title}</div>
                    )}
                    <div className={getCharCounterClass(title.length, MAX_TITLE_LENGTH)}>
                        {title.length}/{MAX_TITLE_LENGTH}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <textarea
                        id="description"
                        placeholder="Add details about this task..."
                        value={description}
                        onChange={handleDescriptionChange}
                        onBlur={() => handleBlur('description')}
                        className="form-control"
                        rows={3}
                        disabled={isSubmitting}
                    />
                    <div className={getCharCounterClass(description.length, MAX_DESCRIPTION_LENGTH)}>
                        {description.length}/{MAX_DESCRIPTION_LENGTH}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="add-button"
                        disabled={isSubmitting || Boolean(errors.title) || !title.trim()}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Task'}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddTaskForm;