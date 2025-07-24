let cart = [];
let allProducts = []

async function main() {
  const response = await fetch('/api/products');
  const products = await response.json();

  allProducts = products

  renderProducts(products)
  setupCategoryButtons()
  
  const productList = document.getElementById('product-list');

  const htmlProducts = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <h2>${product.name}</h2>
      <h3>${product.price} €</h3>
      <button data-id="${product.id}">To Cart</button>
    </div>
  `).join('');

  productList.innerHTML = htmlProducts;

  const buttons = productList.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const product = products.find(p => p.id === id);
      if (product) {
        addToCart(product);
      }
    });
  });
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  cartItems.innerHTML = '';

  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} × ${item.quantity} - ${item.price * item.quantity} €`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.classList.add('remove-item');
    removeBtn.addEventListener('click', () => {
      removeFromCart(item.id);
    });

    li.appendChild(removeBtn);
    cartItems.appendChild(li);

    total += item.price * item.quantity;
  });

  cartTotal.textContent = total;
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

document.getElementById('checkout-btn')?.addEventListener('click', async () => {
  if (cart.length === 0) {
    alert("The cart is empty!");
    return;
  }

  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cart),
  });

  if (response.ok) {
    alert("Successfull order!");
    cart = [];
    renderCart();
  } else {
    alert("There was an error during the order.");
  }
});

function renderProducts(products) {
  const productList = document.getElementById('product-list');
  const htmlProducts = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <h2>${product.name}</h2>
      <h3>${product.price} €</h3>
      <button data-id="${product.id}">To Cart</button>
    </div>
  `).join('');
  productList.innerHTML = htmlProducts;

  const buttons = productList.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const product = allProducts.find(p => p.id === id);
      if (product) {
        addToCart(product);
      }
    });
  });
}

function setupCategoryButtons() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      if (category === 'all') {
        renderProducts(allProducts);
      } else {
        const filtered = allProducts.filter(p => p.type === category);
        renderProducts(filtered);
      }
    });
  });
}

main();