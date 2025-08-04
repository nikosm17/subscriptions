const list = document.getElementById("sub-list");

const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

fetch('/api/subscriptions')
  .then(res => res.json())
  .then(subscriptions => {
subscriptions.forEach(sub => {
  const item = document.createElement("li");
  item.innerHTML = `
    <div>
      <strong>${sub.clientName}</strong><strong>${sub.subName}</strong> Expires: ${sub.expiration } - ${sub.price}€/year <button class="remove">Delete</button>
    </div> <br>
  `;

  item.querySelector(".remove").addEventListener("click", () => {
    fetch(`/api/subscriptions/${sub.id}`, {
     method: 'DELETE'
        }).then(() => item.remove());
      });

  list.appendChild(item);
    });
});
