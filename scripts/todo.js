window.addEventListener("load", todoList);

// ToDo
const todoSection = document.querySelector("section#todo-list");
const todoUL = document.createElement("ul");
const todoForm = document.getElementById("todo-form");

const completedCountP = document.createElement("p");
var completedCount = 0;

// Audio
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext;

function todoList() {
    localStorage.clear();

    // Add event listeners for the form
    todoForm.addEventListener('submit', (event) => {
        createTodo(event)
    });

    // Check whether there is a todo,
    // if there isn't, populate the todolist,
    // otherwise create a message and post it to the todoList
    if (!localStorage.getItem("todo1")) {
        utilAddEmptyMessage();
        completedCountP.textContent = "completed: " + completedCount;
    } else {
        getTodos();
    }

    todoSection.appendChild(todoUL);

    // Clear completed todos on double click
    completedCountP.addEventListener("dblclick", (event) => {
        event.preventDefault();
        clearCompleted();
    })

    todoSection.appendChild(completedCountP);
}

let completedTodos = [];

// Get todo list from localStorage
function getTodos() {
    if (todoUL.childElementCount != 0) {
        todoUL.innerHTML = ''
    }

    for (var i = 0; i < localStorage.length; i++) {
        var todoId = "todo" + i;

        // If todo is in skip todos array, don't add to list
        if (completedTodos.includes(todoId)) {
            continue;
        }

        var listItem = document.createElement("li");
        var storageValue = localStorage.getItem(todoId);
        listItem.setAttribute("id", todoId);

        var listText = document.createElement("p");
        listText.textContent = storageValue;
        listItem.appendChild(listText);

        // Edit button
        var editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", (event) => {
            editTodo(event);
            event.target.parentNode.firstChild.nextSibling.nextSibling.remove(); // remove complete button
            event.target.parentNode.firstChild.nextSibling.remove() // remove edit button
        });
        listItem.appendChild(editButton);

        // Complete button
        var completeButton = document.createElement("button");
        completeButton.textContent = "Complete";
        completeButton.addEventListener("click", (event) => {
            completeTodo(event);
        });
        listItem.appendChild(completeButton);

        todoUL.appendChild(listItem);
    }

    if (todoUL.childElementCount == 0) {
        utilAddEmptyMessage();
    }

    completedCountP.textContent = "completed: " + completedCount;
}

function utilAddEmptyMessage() {
    const listItem = document.createElement("li");
    const message = document.createElement("p");
    message.textContent = "Nothing to do! Add one to get started";
    listItem.appendChild(message);
    todoUL.appendChild(listItem);
};

// Create item
function createTodo(event) {
    event.preventDefault();

    var todoInput = document.querySelector("#todo-input");
    var todoText = todoInput.value;

    localStorage.setItem("todo" + localStorage.length, todoText);

    getTodos();

    todoInput.value = "";
}

// Update item
// Get item by parent element ID >> ul contains ID not li
// Save text from list item
// Replace list item with form for editing
// On edit save,
// overwrite data of todoId == itemId in localStorage using
function editTodo(event) {
    var itemId = event.target.parentNode.id;
    var itemText = event.target.parentNode.firstChild.textContent;
    if (localStorage.getItem(itemId)) {
        var listItem = document.querySelector("#" + itemId + " p");

        var inputForm = document.createElement("form");

        var inputBox = document.createElement("input");
        inputBox.setAttribute("type", "text");
        inputBox.setAttribute("value", itemText);

        var saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.addEventListener("click", (event) => {
            // Save to do
            event.preventDefault();
            
            localStorage.setItem(itemId, inputBox.value);
            getTodos();
        });

        var cancelButton = document.createElement("button");
        cancelButton.textContent = "X";
        cancelButton.addEventListener("click", (event) => {
            event.preventDefault();

            getTodos();
        })

        inputForm.appendChild(inputBox);
        inputForm.appendChild(saveButton);
        inputForm.appendChild(cancelButton);

        listItem.replaceWith(inputForm);
    } else {
        console.log("Item does not exist, error");
    }
}

// Complete (soft delete) item
function completeTodo(event) {
    const itemId = event.target.parentNode.id;
    completedTodos.push(itemId);
    completedCount = completedTodos.length;
    getTodos();
}

function clearCompleted() {
    console.log("Clearing completed: " + completedTodos);

    // Remove completed todos from localStorage
    completedTodos.forEach((todo) => {
        if (localStorage.getItem(todo)) {
            localStorage.removeItem(todo);
        }
    });

    completedTodos = [];
    completedCount = completedTodos.length;
    getTodos();
}
