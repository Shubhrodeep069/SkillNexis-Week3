
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchTasks() {
    setError("");
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        const response = await api.put(`/tasks/${editingId}`, {
          title: title.trim(),
          description: description.trim(),
        });

        setTasks((current) =>
          current.map((task) =>
            task._id === editingId ? response.data.task : task
          )
        );
        setEditingId(null);
      } else {
        const response = await api.post("/tasks", {
          title: title.trim(),
          description: description.trim(),
        });
        setTasks((current) => [response.data.task, ...current]);
      }

      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save task.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(task) {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setDescription("");
  }

  async function toggleTask(task) {
    try {
      const response = await api.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });

      setTasks((current) =>
        current.map((item) =>
          item._id === task._id ? response.data.task : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not update task.");
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      setTasks((current) => current.filter((task) => task._id !== id));

      if (editingId === id) cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete task.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="dashboard-page">
      <section className="todo-dashboard">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">YOUR PRODUCTIVITY SPACE</p>
            <h1>Hello, {user.name || "User"}! 👋</h1>
            <p className="subtitle">Small steps every day make a big difference.</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </header>

        <section className="stats-row">
          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{tasks.length}</strong>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
          <div className="stat-card">
            <span>Remaining</span>
            <strong>{tasks.length - completedCount}</strong>
          </div>
        </section>

        <form className="task-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Task ✏️" : "Add a New Task ✨"}</h2>

          <label htmlFor="task-title">Task title</label>
          <input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Complete my assignment"
            maxLength={150}
            required
          />

          <label htmlFor="task-description">Description (optional)</label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a few details..."
            rows={3}
            maxLength={1000}
          />

          <div className="form-actions">
            <button className="primary-btn" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                ? "Save Changes"
                : "Add Task"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="error-message">{error}</p>}

        <section className="task-list-section">
          <div className="task-list-heading">
            <h2>My Tasks</h2>
            <span>{tasks.length} tasks</span>
          </div>

          {loading ? (
            <p className="empty-state">Loading your tasks...</p>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <h3>No tasks yet</h3>
              <p>Add your first task above to get started!</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <article className="task-item" key={task._id}>
                  <input
                    className="task-checkbox"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                    aria-label={`Mark ${task.title} as completed`}
                  />

                  <div className="task-content">
                    <h3 className={task.completed ? "completed-task" : ""}>
                      {task.title}
                    </h3>
                    {task.description && <p>{task.description}</p>}
                    <span className={`task-status ${task.completed ? "done" : ""}`}>
                      {task.completed ? "Completed" : "In progress"}
                    </span>
                  </div>

                  <div className="task-actions">
                    <button
                      className="edit-btn"
                      onClick={() => startEdit(task)}
                      aria-label={`Edit ${task.title}`}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task._id)}
                      aria-label={`Delete ${task.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
