import Script from 'next/script';
import './styles/Taskstyles.css';
import Head from "next/head";

export default function Home() {
  return (
    <>
    <div>
  <Head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Task List</title>
  </Head>
  <header>
    <input type="text" id="search-bar" placeholder="Search tasks..." />
    <div id="search-results" className="popup" hidden>
      <span className="close-btn" id="close-btn">X</span>
      <ul id="results" />
    </div>
  </header>
  <h1>Task Manager</h1>
  {/* Screen Continer*/}
  <div className="screen-container">
    {/* Task List Section*/}
    <div id="task-list" className="tab-content active">
      <form id="Task-form">
        <input type="text" id="Task-title" placeholder="Task Title" required />
        <label htmlFor="priority-filter">Priority:</label>
        <select id="priority-filter">
          <option value="all">All</option>
          <option value={1}>Critical</option>
          <option value={2}>Urgent</option>
          <option value={3}>High</option>
          <option value={4}>Medium</option>
          <option value={5}>Low</option>
        </select>
        <label htmlFor="status-filter">Status:</label>
        <select id="status-filter">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button id="addTaskBtn" type="button">Add Task</button>
      </form>
      <div id="Calendar" className="calendar-container" />
    </div>
    {/* High Priority Tasks */}
    <div id="high-priority-tasks" className="tab-content">
      <h2>High Priority Tasks</h2>
      <ul className="task-list" />
    </div>
    {/* Completed Tasks */}
    <div id="completed-tasks" className="tab-content">
      <h2>Completed Tasks</h2>
      <ul id="completed-tasks-list" className="task-list" />
    </div>
  </div>
</div>
    <Script src="https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js"></Script>
    <Script src="/Task List.js" strategy="lazyOnload"/>
    </>
  );
}

