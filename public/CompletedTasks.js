document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("completed-tasks-list");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let completedTasks = tasks.filter(task => task.status === "completed");

    completedTasks.forEach(task => {
        const taskElement = document.createElement("li");
        taskElement.textContent = `${task.title} - Completed: ${task.completionDate}`;
        taskElement.addEventListener("click", () => openTaskDetails(task));
        taskList.appendChild(taskElement);
    });

    function openTaskDetails(task) {
        localStorage.setItem('taskDetails', JSON.stringify(task));
        window.location.href = '/TaskDetails';
    }

    // Swipe left to go back
    let touchStartX = 0;
    document.addEventListener("touchstart", (event) => touchStartX = event.touches[0].clientX);
    document.addEventListener("touchend", (event) => {
        if(event.changedTouches[0].clientX > touchStartX + 50) {
            window.location.href = '/';
        }
    });

    // Swipe left to go back(Mouse)
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
        if (mouseEndX > mouseStartX + 50) {
            window.location.href = '/';
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
});