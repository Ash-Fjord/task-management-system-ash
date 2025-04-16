    const taskForm = document.getElementById("Task-form");
    const taskTitle = document.getElementById("Task-title");
    const searchBar = document.getElementById("search-bar");
    const priorityFilter = document.getElementById("priority-filter");
    const statusFilter = document.getElementById("status-filter");
    const highPriorityList = document.querySelector("#high-priority-tasks .task-list");
    const completedTasksList = document.getElementById("completed-tasks-list");
    const calendar = document.getElementById("Calendar");


    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentDate = new Date();
    let currentScreen = "task-list"; // Default screen

    // Initialize Fuse.js with tasks array
    let fuse = new Fuse(tasks, {
        keys: ['title'],
        includeScore: true,
        threshold: 0.4 // Adjust the threshold for fuzzy search
    });

    // Handle task form submission
    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        document.getElementById("addTaskBtn").addEventListener("click", () => {
                window.location.href = "/TaskDetails";
            });
        
    });

    priorityFilter.addEventListener("change", processCalendar);
    statusFilter.addEventListener("change", processCalendar);

    // Search bar functionality with Fuse.js
    searchBar.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const resultsList = document.getElementById("results");
        resultsList.innerHTML = ""; // Clear previous results

        if (searchTerm) {
            // Perform fuzzy search
            const results = fuse.search(searchTerm);
            
            // Display AutoSuggestions
            results.forEach(result => {
                const task = result.item;
                const listItem = document.createElement("li");
                listItem.textContent = task.title;
                // Add click event to navigate to task details
                listItem.addEventListener("click", () => openTaskDetails(task));
                resultsList.appendChild(listItem); 
                  
                });
                document.getElementById("search-results").hidden = results.length === 0; // Show or hide results
            }  else {
            document.getElementById("search-results").hidden = true; // Hide results if search term is empty
        }    
    });

    // Function to render the calendar
    function processCalendar() {
        const calendar = document.getElementById("Calendar");
        calendar.innerHTML = "";
        const today = new Date();
        const priorityFilterValue = priorityFilter.value;
        const statusFilterValue = statusFilter.value;

        for (let f = 0; f < 8; f++) {
            let day = new Date(currentDate);
            day.setDate(currentDate.getDate() + f);

            const dayValue = document.createElement("div");
            dayValue.className = "Calendar-Day";
            if (f === 0) dayValue.classList.add("today");

            const dateString = formatDate(day);
            dayValue.innerHTML = `<strong>${dateString}</strong>`;

            const dayISO = day.toISOString().split("T")[0];
            let dayTasks = tasks.filter(task => task.dueDate === dayISO);

            // Apply filters
            if (priorityFilterValue !== "all") {
                dayTasks = dayTasks.filter(task => task.priority === priorityFilterValue);
            }

            if (statusFilterValue !== "all") {
                dayTasks = dayTasks.filter(task => task.status === statusFilterValue);
            }

            // Create Task List
            const taskList = document.createElement("ul");
            taskList.className = "task-list";

            dayTasks.forEach(task => {
                const taskItem = document.createElement("li");
                taskItem.className = `task-item priority-${task.priority}`;
                taskItem.dataset.taskId = task.id;
                taskItem.innerHTML = `<strong>${task.title}</strong><br><small>Priority: ${getPriorityName(task.priority)}</small><br><small>Status: ${task.status}</small>`;
                taskItem.addEventListener("click", () => openTaskDetails(task));
                taskList.appendChild(taskItem);
            });

            dayValue.appendChild(taskList);
            calendar.appendChild(dayValue);

            // Add click event to toggle accordion for the day
            dayValue.addEventListener("click", () => toggleAccordion(dayValue));
        }

        makeTaskDraggable(); // Make tasks draggable
    }

    function makeTaskDraggable() {
        const taskItems = document.querySelectorAll(".task-item");
        taskItems.forEach(task => {
            task.draggable = true;
            task.addEventListener("dragstart", handleDragStart);
            task.addEventListener("dragover", handleDragOver);
            task.addEventListener("drop", handleDrop);
        });
    }

    function handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.dataset.id); // Store the task ID
        event.target.classList.add("dragging");
    }

    function handleDragOver(event) {
        event.preventDefault(); // Allow dropping
        event.dataTransfer.dropEffect = "move"; // Show move cursor
    }

    function handleDrop(e) {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const draggedTask = document.querySelector(`[data-task-id="${taskId}"]`);
        const targetTask = e.target.closest('.task-item');
        
        if (targetTask && draggedTask !== targetTask) {
            const container = targetTask.parentNode;
            const targetIndex = Array.from(container.children).indexOf(targetTask);
            container.insertBefore(draggedTask, targetIndex > Array.from(container.children).indexOf(draggedTask) ? targetTask.nextSibling : targetTask);
            
            // Update task order in localStorage
            updateTaskOrder();
        }
    }

    function updateTaskOrder() {
        const taskElements = document.querySelectorAll(".task-item");
        const orderedTasks = [];
        const task = JSON.parse(localStorage.getItem("tasks")) || [];

        taskElements.forEach(taskElement => {
            const task = tasks.find(t => t.id === parseInt(taskElement.dataset.id));
            if (task) {
                orderedTasks.push(task);
            }
        });

        localStorage.setItem("tasks", JSON.stringify(orderedTasks)); // Save the new order to localStorage
    }

    
    // Add event listeners
    priorityFilter.addEventListener("change", processCalendar);
    statusFilter.addEventListener("change", processCalendar);

    document.addEventListener("DOMContentLoaded", () => {
        tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        processCalendar(); // Render the calendar on page load
    });

    // Render High Priority Tasks
    function renderHighPriorityTasks() {
        const list = document.querySelector("#high-priority-tasks .task-list");
        list.innerHTML = ""; // Clear previous tasks

        const highPriorityTasks = tasks.filter(task => task.priority === "1" || task.priority === "2" || task.priority === "3");

        highPriorityTasks.forEach(task => {
            const listItem = document.createElement("li");
            listItem.className = `task-item priority-${task.priority}`;
            listItem.innerHTML = `<strong>${task.title}</strong><br><small>Due Date: ${task.dueDate || "No due date"}</small><br><small>`;
            listItem.addEventListener("click", () => openTaskDetails(task));
            list.appendChild(listItem);
        });
    }

     // Render Completed Tasks
     function renderCompletedTasks() {
        const list = document.getElementById("completed-tasks-list");
        list.innerHTML = ""; // Clear previous tasks
        const completedTasks = tasks.filter(task => task.status === "completed");
        completedTasks.forEach(task => {
            const listItem = document.createElement("li");
            listItem.className = `task-item priority-${task.priority}`;
            listItem.innerHTML = `<strong>${task.title}</strong><br>Completion Date: ${task.completedAt || "No completion date"}</small>`;
            listItem.addEventListener("click", () => openTaskDetails(task));
            list.appendChild(listItem);
        });
    }

    function showScreen(screenId) {
        document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
        document.getElementById(screenId).classList.add("active");

        if (screenId === "high-priority-tasks") {
            renderHighPriorityTasks();
        } else if (screenId === "completed-tasks-list") {
            renderCompletedTasks();
    }
}

    // Handles swipe gestures for touch and mouse
    let startX = 0;
    let startXMouse = 0;
    let isMouseDown = false;

    // Touch Gestures
    document.addEventListener("touchstart", function (event) {
        startX = event.touches[0].clientX;
    });

    document.addEventListener("touchend", function (event) {
        const endX = event.changedTouches[0].screenX;
        const diffX = startX - endX;

        if (diffX > 50) {
            // Swipe Left: Navigate to Completed Tasks
            if (currentScreen === "task-list") {
                currentScreen = "completed-tasks";
                showScreen("completed-tasks-list");
            }
        } else if (diffX < -50) {
            // Swipe Right: Navigate to High Priority Tasks or back to Task List
            if (currentScreen === "task-list") {
                currentScreen = "high-priority-tasks";
                showScreen("high-priority-tasks");
            } else {
                currentScreen = "task-list";
                showScreen("task-list"); // Navigate back to Task List
            }
        }
    });

    // Mouse Gestures
    document.addEventListener("mousedown", function (event) {
        isMouseDown = true;
        startXMouse = event.clientX; // Record the starting X position
    });

    document.addEventListener("mouseup", function (event) {
        if (!isMouseDown) return; // Ensure the mouse was pressed
        isMouseDown = false;

        const diffX = startXMouse - event.clientX; // Calculate the horizontal swipe distance

        if (Math.abs(diffX) > 50) { // Check if the swipe distance exceeds the threshold
            if (diffX > 0) {
                // Swipe Left: Navigate to Completed Tasks
                if (currentScreen === "task-list") {
                    currentScreen = "completed-tasks-list";
                    showScreen("completed-tasks-list");
                }
            } else {
                // Swipe Right: Navigate to High Priority Tasks or back to Task List
                if (currentScreen === "task-list") {
                    currentScreen = "high-priority-tasks";
                    showScreen("high-priority-tasks");
                } else {
                    currentScreen = "task-list";
                    showScreen("task-list"); // Navigate back to Task List
                }
            }
        }
    });

    // Function to toggle accordion
    function toggleAccordion(dayValue) {
        const isOpen = dayValue.classList.contains("open");
        document.querySelectorAll(".Calendar-Day").forEach(day => day.classList.remove("open"));
        if  (!isOpen) {
            dayValue.classList.add("open");
        }
    }

     // Function to format the date
     function formatDate(date) {
        return date.toLocaleDateString("en-US", { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    // Function to get priority name
    function getPriorityName(priority) {
        switch (priority) {
            case "1": return "Critical";
            case "2": return "Urgent";
            case "3": return "High";
            case "4": return "Medium";
            case "5": return "Low";
        };
        return names[priority];
    }

    // Open Task Details
    function openTaskDetails(task) {
        localStorage.setItem("taskDetails", JSON.stringify(task));
        window.location.href = "/TaskDetails"; // Redirect to Task Details page
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Renders Calendar on page load
    showScreen("task-list");
    processCalendar();

    let touchStartX = 0;
    let touchEndX = 0;
    let mouseStartX = 0;
    let mouseEndX = 0;

    // Handle gestures
    function handleGesture() {
        const swipeThreshold = 50; // Minimum distance for a swipe

        if (mouseEndX > mouseStartX + swipeThreshold || touchEndX > touchStartX + swipeThreshold) {
            // Swipe right
            window.location.href = "/HighPriorityTasks";
        } else if (mouseEndX < mouseStartX - swipeThreshold || touchEndX < touchStartX - swipeThreshold) {
            // Swipe left
            window.location.href = "/CompletedTasks";
        }
    }

    // Touch support for mobile
    document.addEventListener("touchstart", function (event) {
        touchStartX = event.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", function (event) {
        touchEndX = event.changedTouches[0].screenX;
        handleGesture();
    });

    // Mouse support for desktop
    document.addEventListener("mousedown", function (event) {
        mouseStartX = event.clientX;
    });

    document.addEventListener("mouseup", function (event) {
        mouseEndX = event.clientX;
        handleGesture();
    });

    document.getElementById("addTaskBtn").addEventListener("click", function () {
        addNewTask(); // Call the function to add a new task
    });

    function addNewTask() {
        // Create a new task object with default values
        const newTask = {
            id: Date.now(), // Generate a unique ID for the new task
            title: "",
            description: "",
            startDate: "",
            dueDate: "",
            completionDate: "",
            priority: "5", // Default priority
            status: "pending", // Default status
            category: "general-maintenance", // Default category
            location: { lat: 13.1939, lng: -59.5432 }, // Default location
            audio: null,
            video: null,
            document: null,
        };

        // Save the new task to localStorage
        localStorage.setItem("taskDetails", JSON.stringify(newTask));

        // Redirect to the Task Details page
        window.location.href = "/TaskDetails";
    }

    document.getElementById("close-btn").addEventListener("click", function () {
        document.getElementById("search-results").hidden = true; // Hide search results
    });
