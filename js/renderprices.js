const priceContainer = document.getElementById("price-list");

prices.forEach(paper => {
  const div = document.createElement("div");
  div.className = "price-card";

  div.innerHTML = `
    <h3>${paper.name}</h3>
    <p>Monthly Price: ₹${paper.zipinallPrice}</p>
    <small>Includes ₹10 Zipinall service charge</small>
  `;

  priceContainer.appendChild(div);
});

