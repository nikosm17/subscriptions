const form = document.getElementById("subscription-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const subscription = {
  clientName: document.getElementById("client-name").value,
  subName: document.getElementById("sub-name").value,
  expiration: document.getElementById("expiration").value,
  price: document.getElementById("price").value
  };

  fetch('/api/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription)
  }).then(res => {
    if (res.ok) {
      form.reset();
      window.location.href = 'index.html';
    }
  });
});