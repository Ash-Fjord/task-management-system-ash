"use client";
import Head from "next/head";
import Script from 'next/script';
import '../styles/Detailstyles.css'

export default function TaskDetails() {
  return (
    <>
    <Head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Task Details</title>
    </Head>
    <div>
    {/* For Stats Section */}
    <div className="screen">
        <button id="return-to-task-list-btn">Return to Task List</button>
        <button id="add-task-btn" title="Add New Task">⊞</button>
        <button id="stats-btn">📊</button>
        <h1>Task Details</h1>
        <form id="task-details-form">
        <label htmlFor="task-title">Task Title:</label>
        <input type="text" id="task-title" name="task-title" required />
        <input type="hidden" id="original-title" name="original-title" />
        <label htmlFor="task-description">Task Description:</label>
        <textarea id="task-description" name="task-description" required defaultValue={""} />
        <label htmlFor="start-date">Start Date:</label>
        <input type="date" id="start-date" name="start-date" required />
        <label htmlFor="due-date">Due Date:</label>
        <input type="date" id="due-date" name="due-date" required />
        <label htmlFor="completion-date">Completion Date:</label>
        <input type="date" id="completion-date" name="completion-date" />
        <label htmlFor="priority-level">Priority Level:</label>
        <select id="priority-level" name="priority-level" required>
            <option value={1}>1 – Critical</option>
            <option value={2}>2 – Urgent</option>
            <option value={3}>3 – High Priority</option>
            <option value={4}>4 – Medium Priority</option>
            <option value={5}>5 – Low Priority</option>
        </select>
        <label htmlFor="status">Status:</label>
        <select id="status" name="status" required>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
        </select>
        <label htmlFor="task-category">Category:</label>
        <select id="task-category" name="task-category" required>
            <option value="landscaping">New Landscaping</option>
            <option value="site-clearing">Site Clearing</option>
            <option value="plant-maintenance">Plant Maintenance</option>
            <option value="grass-maintenance">Grass Maintenance</option>
            <option value="general-maintenance">General Maintenance</option>
        </select>
        <label htmlFor="task-location">Task Location:</label>
        <p id="task-location">Fetching Location...</p>
        <label>Task Map:</label>
        <div id="map" style={{height: 300, width: '100%', borderRadius: 12, marginBottom: '1rem'}} />
        <label htmlFor="task-audio">Upload New Audio:</label>
        <audio id="task-audio" controls />
        <input type="file" id="new-audio" name="new-audio" accept="audio/*" title="Upload an audio file" />
        <label htmlFor="task-video">Upload New Video:</label>
        <video id="task-video" controls />
        <input type="file" id="new-video" name="new-video" accept="video/*" title="Upload a video file" />
        <label htmlFor="task-document">Upload New Document (PDF):</label>
        <embed id="task-document" type="application/pdf" width="100%" height="600px" />
        <input type="file" id="new-document" name="new-document" accept="application/pdf" title="Upload a PDF document" />
        <button type="submit">Save Changes</button>
        </form>
        <div id="task-list" />
    </div>
    </div>
    <Script src="/Task Details.js" strategy="lazyOnload" async="true"/>
    </>
  )
}