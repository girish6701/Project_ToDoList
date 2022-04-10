const addBtn = document.querySelector(".add-btn");
const removeBtn = document.querySelector(".remove-btn");
const modalCont = document.querySelector(".modal-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
const allColors = document.querySelectorAll(".color");

let showModalCont = false;
let ticketColor = "black";
let toDelete = false;
const arr = ["lightpink", "lightgreen", "lightblue", "black"];
let ticketsArr = JSON.parse(localStorage.getItem("tickets")) || [];

if (localStorage.getItem("tickets")) {
  ticketsArr.forEach(function (ticket) {
    appendTickets(ticket.ticketVal, ticket.ticketColor, ticket.ticketId);
  });
}

modalCont.addEventListener("keydown", function (e) {
  const taskAreaText = document.querySelector(".textarea-cont");
  if (e.key === "Alt") {
    createTicket(
      taskAreaText.value,
      ticketColor,
      shortid.generate().toLowerCase()
    );
    taskAreaText.value = "";
    showModalCont = false;
    modalCont.style.display = "none";
  }
});

removeBtn.addEventListener("click", function () {
  toDelete = !toDelete;
});

addBtn.addEventListener("click", function (e) {
  showModalCont = !showModalCont;
  if (showModalCont) {
    modalCont.style.display = "flex";
  } else {
    modalCont.style.display = "none";
  }
});

// Filter based on Color
allColors.forEach(function (color) {
  color.addEventListener("click", function (e) {
    const tickets = document.querySelectorAll(".ticket-color");
    let currColor = e.currentTarget.classList[0];
    tickets.forEach(function (ticket) {
      if (ticket.classList[0] === currColor) {
        ticket.parentElement.style.display = "block";
      } else {
        ticket.parentElement.style.display = "none";
      }
    });
  });
  color.addEventListener("dblclick", function (e) {
    const tickets = document.querySelectorAll(".ticket-color");
    tickets.forEach(function (ticket) {
      ticket.parentElement.style.display = "block";
    });
  });
});

// Select Color in Create Ticket Div
allPriorityColors.forEach(function (firstColor) {
  firstColor.addEventListener("click", function (e) {
    allPriorityColors.forEach(function (secondColor) {
      secondColor.classList.remove("active");
    });
    e.target.classList.add("active");
    ticketColor = e.target.classList[0];
  });
});

function createTicket(ticketVal, ticketColor, ticketId) {
  appendTickets(ticketVal, ticketColor, ticketId);
  ticketsArr.push({ ticketColor, ticketVal, ticketId });
  localStorage.setItem("tickets", JSON.stringify(ticketsArr));
}

// Creates New Ticket
function appendTickets(ticketVal, ticketColor, ticketId) {
  const mainCont = document.querySelector(".main-cont");
  const ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML += `
      <div class="${ticketColor} ticket-color"></div>
      <div class="ticket-id">#${ticketId}</div>
      <div class="task-area">${ticketVal}</div>
      <div class="ticket-lock">
          <i class="fa-solid fa-lock"></i>
      </div>`;
  mainCont.appendChild(ticketCont);
  handleLock(ticketCont);
  handleColor(ticketCont);
  handleRemove(ticketCont, ticketId);
}

// Edit Text and Lock
function handleLock(ticket) {
  const ticketLockElem = ticket.querySelector(".ticket-lock");
  const task = ticket.querySelector(".task-area");
  const lockCont = ticketLockElem.children[0];
  lockCont.addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("fa-lock")) {
      e.currentTarget.classList.remove("fa-lock");
      e.currentTarget.classList.add("fa-unlock");
      task.setAttribute("contenteditable", "true");
    } else {
      e.currentTarget.classList.remove("fa-unlock");
      e.currentTarget.classList.add("fa-lock");
      task.setAttribute("contenteditable", "false");
      changeLocalStorage(ticket, "ticketVal", task.innerText);
    }
  });
}

// Change Stripe Color
function handleColor(ticket) {
  const colorDiv = ticket.querySelector(".ticket-color");
  colorDiv.addEventListener("click", function (e) {
    let currColor = e.currentTarget.classList[0];
    let index = getIndex(arr, currColor);
    index = (index + 1) % arr.length;
    e.currentTarget.setAttribute("class", arr[index]);
    e.currentTarget.classList.add("ticket-color");
    changeLocalStorage(ticket, "ticketColor", arr[index]);
  });
}

//Remove Ticket
function handleRemove(ticket, ticketID) {
  ticket.addEventListener("click", function (e) {
    if (toDelete) {
      e.currentTarget.remove();
      ticketsArr = ticketsArr.filter(function (singleTicket) {
        return !(singleTicket.ticketId === ticketID);
      });
      localStorage.setItem("tickets", JSON.stringify(ticketsArr));
    }
  });
}

// Set Local Storage after updating Text or Stripe Color
function changeLocalStorage(ticket, keyToBeUpdated, value) {
  let id = ticket.querySelector(".ticket-id").innerText;
  ticketsArr = ticketsArr.map(function (t) {
    if ("#" + t.ticketId == id) {
      t[keyToBeUpdated] = value;
    }
    return t;
  });
  localStorage.setItem("tickets", JSON.stringify(ticketsArr));
}

function getIndex(arr, color) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === color) {
      return i;
    }
  }
}
