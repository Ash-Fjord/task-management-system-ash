function displayHighPriorityTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Load tasks from localStorage
    // Correctly filter tasks with priority "1", "2", or "3"
    const highPriorityTasks = tasks.filter(task => 
        task.priority === "1" || task.priority === "2" || task.priority === "3"
    );

    const highPriorityTasksContainer = document.getElementById("high-priority-tasks");
    highPriorityTasksContainer.innerHTML = ""; // Clear previous tasks

    if (highPriorityTasks.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No high priority tasks.";
        highPriorityTasksContainer.appendChild(li);
    } else {
        highPriorityTasks.forEach(task => {
            const li = document.createElement("li");
            li.textContent = `${task.title} (Due: ${task.dueDate})`; // Display the task title and due date
            li.addEventListener("click", function() {
                showTaskDetails(task); // Show task details when clicked
            });
            highPriorityTasksContainer.appendChild(li);
        });
    }
}

function openTaskDetails(task) {
        localStorage.setItem('taskDetails', JSON.stringify(task));
        window.location = '/TaskDetails';
    }

document.addEventListener("DOMContentLoaded", function()  {
    displayHighPriorityTasks(); // Call the function to display high-priority tasks

    let touchStartY = 0;

    document.addEventListener("touchstart", (event) => touchStartY = event.touches[0].clientY);
    document.addEventListener("touchend", (event) => {
        const touchEndY = event.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffY) > 50) {
            // Scroll the List
            window.scrollBy({
                top: diffY > 0 ? 200 : -200, // Scroll up or down
                behavior: "smooth"
            });
        }
    });

    // Swipe right to go back
    document.addEventListener("touchstart", (event) => touchStartX = event.touches[0].clientX);
    document.addEventListener("touchend", (event) => {
        if(event.changedTouches[0].clientX < touchStartX - 50) {
            window.location = '/';
        }
    });
});
     
// Swipe right to go back(Mouse)
let mouseStartX = 0;
let isMouseDown = false;

document.addEventListener("mousedown", (event) => {
    isMouseDown = true;
    mouseStartX = event.clientX;
});

document.addEventListener("mouseup", (event) => {
    if (!isMouseDown) return;
    isMouseDown = false;

    const mouseEndX = event.clientX;
    if (mouseEndX < mouseStartX - 50) {
        window.location = '/';
    }
});

// Swipe up/down to scroll through the list
let touchStartY = 0;
document.addEventListener("touchstart", (event) => touchStartY = event.touches[0].clientY);
document.addEventListener("touchend", (event) => {
    const touchEndY = event.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffY) > 50) {
        window.scrollBy({
            top: diffY > 0 ? 200 : -200,
            behavior: 'smooth'
        });
    }
});