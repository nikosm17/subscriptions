const list = document.getElementById("sub-list");

const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

fetch('/api/subscriptions')
  .then(res => res.json())
  .then(subscriptions => {
    allItems = subscriptions.map(sub => {
      const item = document.createElement("li");
      item.innerHTML = `
        <div class="sub-row">
          <span>${sub.clientName}</span>
          <span>${sub.subName}</span>
          <span>${sub.expiration}</span>
          <span>${sub.price}€/year</span>
          <button class="remove">Delete</button>
        </div><br>
      `;
      item.querySelector(".remove").addEventListener("click", () => {
        fetch(`/api/subscriptions/${sub.id}`, {
          method: 'DELETE'
        }).then(() => {
          allItems = allItems.filter(i => i !== item);
          changePage(current_page);
        });
      });
      return item;
    });
    changePage(current_page);
  });

function myFunction() {
  const input = document.getElementById('myInput');
  const filter = input.value.toUpperCase();
  const ul = document.getElementById("sub-list");
  const items = ul.getElementsByTagName("li");

  for (let i = 0; i < items.length; i++) {
    const txtValue = items[i].textContent || items[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      items[i].style.display = "";
    } else {
      items[i].style.display = "none";
    }
  }
}

let current_page = 1;
let records_per_page = 7;

function changePage(page) {
  const list = document.getElementById("sub-list");
  const page_span = document.getElementById("page");
  const btn_prev = document.getElementById("btn_prev");
  const btn_next = document.getElementById("btn_next");

  list.innerHTML = "";

  const start = (page - 1) * records_per_page;
  const end = start + records_per_page;

  allItems.slice(start, end).forEach(item => list.appendChild(item));
  page_span.innerText = page;
}

function numPages() {
  return Math.ceil(allItems.length / records_per_page);
}

function prevPage() {
  if (current_page > 1) {
    current_page--;
    changePage(current_page);
  }
}

function nextPage() {
  if (current_page < numPages()) {
    current_page++;
    changePage(current_page);
  }
}

window.onload = () => changePage(current_page);

