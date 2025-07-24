const LOCAL_API = 'http://localhost:3000/api/products';
const searchInput = document.getElementById('search');
const productList = document.getElementById('product-list');
let allSneakers = [];

async function loadSneakers(page) {
  const res = await fetch(`https://api.kicks.dev/v3/stockx/products/?page=${page}`, {
  headers: {
  'Authorization': 'sd_KszeHVd1FzVlSsEsOULkuv8GWQKeiK50',
  }
  });
  const json = await res.json();
  return json.data;
}

async function init() {
  const nextButton = document.getElementById('nextBtn');
  const prevButton = document.getElementById('prevBtn');
  let page = 1;

  async function updatePage() {
    allSneakers = await loadSneakers(page);
    displayProducts(allSneakers);
  }

  nextButton.addEventListener("click", async () => {
    if (page < 30) {
      page++;
      await updatePage();
    }
  });

  prevButton.addEventListener("click", async () => {
    if (page > 1) {
      page--;
      await updatePage();
    }
  });
  
  await updatePage();
}

function displayProducts(products) {
  const htmlProducts = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" width="300" height="220" alt="${product.title}" />
      <h2>${product.title}</h2>
      <button data-id="${product.id}">Add to products</button>
    </div>
  `).join('');
  productList.innerHTML = htmlProducts;

  const buttons = productList.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const product = allSneakers.find(p => p.id === id);
      if (product) {
        addProductToLocalDB(product);
      }
    });
  });
}

async function addProductToLocalDB(product) {
  const productToAdd = {
    id: product.id,
    name: product.title,
    price: Math.floor(Math.random() * 100) + 50,
    image: product.image,
    type: product.product_type,
    onSale: true
  };

  try {
    const response = await fetch(LOCAL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productToAdd)
    });

    if (response.ok) {
      alert(`Product "${product.title}" added to your webshop!`);
    } else {
      alert("Failed to add product to your backend.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while adding the product.");
  }
}

init();