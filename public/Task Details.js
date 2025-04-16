async function taskDetails(){

    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
        key: "AIzaSyDLhgEjAvDxyuvb3L40ii6kJ0ugD0iusGU",
        v: "weekly",
        // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
        // Add other bootstrap parameters as needed, using camel case.
    });
    let map;
    let marker;

    async function initMap() {
        const defaultLocation = { lat: 13.1939, lng: -59.5432 };

        const taskDetails = JSON.parse(localStorage.getItem('taskDetails')) || {};
        const taskLocation = taskDetails.location || defaultLocation;

        const mapCenter = (taskLocation && isFinite(taskLocation.lat) && isFinite(taskLocation.lng))
            ? taskLocation
            : defaultLocation;

        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        const map = new google.maps.Map(document.getElementById("map"), {
            center: mapCenter,
            zoom: 14,
            mapId: "DEMO_MAP_ID",
        });

        const marker = new AdvancedMarkerElement({
            position: mapCenter,
            map: map,
            title: "Task Location",
            gmpDraggable: true,
        });

        document.getElementById("map").newPosition = {
            lat: marker.position.lat,
            lng: marker.position.lng,
        };

        marker.addListener("dragend", () => {
            const newPosition = marker.position;
            document.getElementById("map").newPosition = {
                lat: newPosition.lat,
                lng: newPosition.lng,
            };

            console.log("Updated Position:", document.getElementById("map").newPosition);
        });
    }

    function displayTasksByDate() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        // Group tasks by dueDate
        const tasksByDate = tasks.reduce((grouped, task) => {
            const date = task.dueDate || "No Due Date";
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(task);
            return grouped;
        }, {});

        const taskListContainer = document.getElementById("task-list");
        taskListContainer.innerHTML = ""; // Clear previous tasks

        // Display tasks grouped by date
        Object.keys(tasksByDate).forEach(date => {
            const dateHeader = document.createElement("h3");
            dateHeader.textContent = date;
            taskListContainer.appendChild(dateHeader);

            const taskList = document.createElement("ul");
            tasksByDate[date].forEach(task => {
                const taskItem = document.createElement("li");
                taskItem.textContent = `${task.title} - ${task.priority}`;
                taskList.appendChild(taskItem);
            });
            taskListContainer.appendChild(taskList);
        });
    }

        // Retrieve task details from local storage
        const taskDetails = JSON.parse(localStorage.getItem('taskDetails')) || {};

        if (taskDetails) {
            // Populate form fields with task details
            document.getElementById('task-title').value = taskDetails.title || '';
            document.getElementById('original-title').value = taskDetails.title || '';
            document.getElementById('task-description').value = taskDetails.description || '';
            document.getElementById('start-date').value = taskDetails.startDate || '';
            document.getElementById('due-date').value = taskDetails.dueDate || '';
            document.getElementById('completion-date').value = taskDetails.completionDate || '';
            document.getElementById('priority-level').value = taskDetails.priority || '5';
            document.getElementById('status').value = taskDetails.status || 'pending';
            document.getElementById('task-category').value = taskDetails.category || 'landscaping';
            document.getElementById('task-location').textContent = taskDetails.location || 'Fetching Location...';
            document.getElementById('map').newPosition = taskDetails.location || { lat:latitude, lng: longitude };

            if (taskDetails.audio) {
                const audioFile = await getFileFromIndexedDB("audio");
                if (audioFile) {
                    document.getElementById("task-audio").src = audioFile;
                }
            }

            if (taskDetails.video) {
                const videoFile = await getFileFromIndexedDB("video");
                if (videoFile) {
                    document.getElementById("task-video").src = videoFile;
                }
            }

            if (taskDetails.document) {
                const documentFile = await getFileFromIndexedDB("document");
                if (documentFile) {
                    document.getElementById("task-document").src = documentFile;
                }
            }
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const {latitude, longitude} = position.coords;

                // Validate Latitude and Longitude
                if (isFinite(latitude) && isFinite(longitude)) {
                    const userLocation = { lat: latitude, lng: longitude };
                
                    if (window.map && window.marker) {
                        map.setCenter(userLocation);
                        marker.setPosition(userLocation);
                    }

                    document.getElementById('task-location').textContent = `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`;
                } else {
                    console.error("Invalid coordinates received from geolocation API.");
                }
            }, (error) => {
                console.error("Geolocation Error:", error);
                document.getElementById('task-location').textContent = "Location unavailable: " + error.message;
            }, { 
                enableHighAccuracy: true, 
                timeout: 5000, 
                maximumAge: 0 
            });
        }

        
        const taskDetailsForm = document.getElementById("task-details-form");

        taskDetailsForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const audioFile = document.getElementById("new-audio").files[0];
            const videoFile = document.getElementById("new-video").files[0];
            const documentFile = document.getElementById("new-document").files[0];

            const maxFileSize = 1024 * 1024 * 10; // 10MB

            if (audioFile && audioFile.size > maxFileSize) {
                alert("Audio file is too large. Please upload a file smaller than 10MB.");
                return;
            }

            if (videoFile && videoFile.size > maxFileSize) {
                alert("Video file is too large. Please upload a file smaller than 10MB.");
                return;
            }

            if (documentFile && documentFile.size > maxFileSize) {
                alert("Document file is too large. Please upload a file smaller than 10MB.");
                return;
            }

            const updatedLocation = document.getElementById("map").newPosition;

            const updatedTaskDetails = {
                id: taskDetails.id || Date.now(), // Generate a unique ID if not present
                title: document.getElementById("task-title").value,
                description: document.getElementById("task-description").value,
                startDate: document.getElementById("start-date").value,
                dueDate: document.getElementById("due-date").value,
                completionDate: document.getElementById("completion-date").value,
                priority: document.getElementById("priority-level").value,
                status: document.getElementById("status").value,
                category: document.getElementById("task-category").value,
                location: updatedLocation,
                audio: taskDetails.audio,
                video: taskDetails.video,
                document: taskDetails.document,
            };

            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            let taskIndex = tasks.findIndex(task => task.title === updatedTaskDetails.title);

            if (taskIndex !== -1) {
                // Update the existing task
                tasks[taskIndex] = updatedTaskDetails;
            } else {
                // Add the new task
                tasks.push(updatedTaskDetails);
            }

            // Save the updated tasks array back to localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            const message = document.createElement("div");
            message.textContent = "Task details saved successfully!";
            message.classList.add("Confirmed");
            document.body.appendChild(message);
            setTimeout(() => message.remove(), 3000); // Remove message after 3 seconds
        });

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let taskIndex = tasks.findIndex(task => task.id === taskDetails.id);
        let currentTaskIndex = tasks.findIndex(task => task.title === taskDetails.title);
        
        let touchstartX = 0;
        let touchendX = 0;

        document.addEventListener('touchstart', event => {
            touchstartX = event.touches[0].clientX;
        });
        document.addEventListener('touchend', event => {
            touchendX = event.changedTouches[0].clientX;

            if (touchendX < touchstartX - 50 && currentTaskIndex < tasks.length - 1) {
                currentTaskIndex++;
                localStorage.setItem('taskDetails', JSON.stringify(tasks[currentTaskIndex]));
                document.body.classList.add("loading"); // Add loading class
                window.location.reload(); // Reload the page to show the next task
            } 

            if (touchendX > touchstartX + 50 && currentTaskIndex > 0) {
                currentTaskIndex--;
                localStorage.setItem('taskDetails', JSON.stringify(tasks[currentTaskIndex]));
                document.body.classList.add("loading"); // Add loading class
                window.location.reload(); // Reload the page to show the previous task
            }
        });

        const selectedTask = tasks[currentTaskIndex];
        localStorage.setItem('taskDetails', JSON.stringify(selectedTask));

        // Return to Task List
        function returnToTaskList() {
            window.location.href = '/';
        }

        document.getElementById("return-to-task-list-btn").addEventListener("click", function() {
            returnToTaskList();
        });

        document.getElementById("stats-btn").addEventListener("click", function() {
            window.location.href = "/stats";
        });

        async function fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
        }

        function saveFileToIndexedDB(file, key) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open("TaskDatabase", 1);

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains("files")) {
                        db.createObjectStore("files", { keyPath: "key" });
                    }
                };

                request.onsuccess = (event) => {
                    const db = event.target.result;
                    const transaction = db.transaction("files", "readwrite");
                    const store = transaction.objectStore("files");

                    const fileData = { key, file };
                    const addRequest = store.put(fileData); // Correctly add the fileData to the store

                    addRequest.onsuccess = () => resolve();
                    addRequest.onerror = (error) => reject(error);
                };

                request.onerror = (error) => reject(error);
            });
        }

        function getFileFromIndexedDB(key) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open("TaskDatabase", 1);

                request.onsuccess = (event) => {
                    const db = event.target.result;
                    const transaction = db.transaction("files", "readonly");
                    const store = transaction.objectStore("files");

                    const getRequest = store.get(key);
                    getRequest.onsuccess = () => resolve(getRequest.result?.file || null);
                    getRequest.onerror = (error) => reject(error);
                };

                request.onerror = (error) => reject(error);
            });
        }
}

taskDetails()