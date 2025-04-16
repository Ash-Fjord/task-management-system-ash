document.addEventListener("DOMContentLoaded", function() {
    // Set sample tasks in localStorage
    localStorage.setItem("tasks", JSON.stringify([
        { title: "Task 1", priority: "1", status: "completed" },
        { title: "Task 2", priority: "2", status: "pending" },
        { title: "Task 3", priority: "3", status: "in-progress" },
        { title: "Task 4", priority: "4", status: "completed" },
        { title: "Task 5", priority: "5", status: "pending" }
    ]));

    function handleCount() {
        // Reset counters and priority counts
        let completedTasks = 0;
        let pendingTasks = 0;
        const priorityCounts = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

        let tasks = [];
        try {
            tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        } catch (error) {
            console.error("Failed to parse tasks from localStorage:", error);
        }

        tasks.forEach(task => {
            if (task.status === "completed") {
                completedTasks++;
            } else if (task.status === "pending") {
                pendingTasks++;
            }

            if (task.priority) {
                priorityCounts[task.priority]++;
            }
        });

        document.getElementById("completed-tasks-count").textContent = completedTasks;
        document.getElementById("pending-tasks-count").textContent = pendingTasks;

        // Render the chart
        const ctx = document.getElementById("task-priority-chart").getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Critical", "Urgent", "High Priority", "Medium Priority", "Low Priority"],
                datasets: [{
                    label: "Task Count by Priority",
                    data: Object.values(priorityCounts),
                    backgroundColor: ["red", "orange", "yellow", "blue", "green"]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
    }

    handleCount(); // Call the function to count tasks and render the chart

    // Swipe gesture handling
    let touchStartX = 0;
    let touchEndX = 0;
    let mouseStartX = 0;
    let mouseEndX = 0; // Variables for mouse events

    function handleGesture() {
        if (touchEndX < touchStartX - 50 || mouseEndX < mouseStartX - 50) { // Swipe left detection
            window.location.href = "/TaskDetails"; // Navigate to Task Details screen
        }
    }
    document.addEventListener("touchstart", function(event) {
        touchStartX = event.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", function(event) {
        touchEndX = event.changedTouches[0].screenX;
        handleGesture();
    });
     // Mouse events for destop devices 
    document.addEventListener("mousedown", function(event) {
        mouseStartX = event.clientX; 
    });
    document.addEventListener("mouseup", function(event) {
        mouseEndX = event.clientX;
        handleGesture();
    });
});