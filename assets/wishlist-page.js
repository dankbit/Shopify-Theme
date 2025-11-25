class WishlistPage {
  constructor() {
    this.storageKey = 'shopify_wishlist';
    this.wishlist = this.getWishlist();
    this.init();
  }

  getWishlist() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveWishlist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
  }

  async init() {
    if (this.wishlist.length === 0) {
      this.showEmptyState();
      return;
    }

    await this.fetchAndRenderProducts();
  }

  async fetchAndRenderProducts() {
    try {
      const container = document.getElementById('wishlist-container');
      const emptyState = document.getElementById('empty-wishlist');
      const countEl = document.getElementById('wishlist-count');

      container.innerHTML = '';
      countEl.textContent = `${this.wishlist.length} item(s)`;

      for (const productId of this.wishlist) {
        const product = await this.fetchProduct(productId);
        if (product) {
          container.appendChild(this.createProductCard(product));
        }
      }

      if (container.children.length === 0) {
        this.showEmptyState();
      } else {
        emptyState.style.display = 'none';
      }
    } catch (error) {
      console.error('Error rendering wishlist:', error);
    }
  }

  async fetchProduct(productId) {
    try {
      const response = await fetch(
        `/products.json?limit=250&fields=id,title,handle,image,variants`
      );
      const data = await response.json();
      return data.products.find((p) => String(p.id) === String(productId));
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'wishlist-product-card';

    const image = product.image ? product.image.src : '/cdn/shop/t/0/blank.gif';
    const price = product.variants[0]?.price
      ? `$${(product.variants[0].price / 100).toFixed(2)}`
      : 'Contact for price';

    div.innerHTML = `
      <img src="${image}" alt="${product.title}" class="wishlist-product-image">
      <div class="wishlist-product-info">
        <a href="/products/${product.handle}" class="wishlist-product-title">
          ${product.title}
        </a>
        <div class="wishlist-product-price">${price}</div>
        <div class="wishlist-product-actions">
          <button class="wishlist-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
          <button class="wishlist-remove" data-product-id="${product.id}">
            ✕
          </button>
        </div>
      </div>
    `;

    const addBtn = div.querySelector('.wishlist-add-to-cart');
    const removeBtn = div.querySelector('.wishlist-remove');

    addBtn.addEventListener('click', () => this.addToCart(product.id));
    removeBtn.addEventListener('click', () => this.removeFromWishlist(product.id));

    return div;
  }

  removeFromWishlist(productId) {
    this.wishlist = this.wishlist.filter(
      (id) => id !== String(productId)
    );
    this.saveWishlist();
    this.init();
  }

  addToCart(productId) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: productId, quantity: 1 }],
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert('Added to cart!');
        window.location.href = '/cart';
      })
      .catch((err) => console.error('Error adding to cart:', err));
  }

  showEmptyState() {
    document.getElementById('wishlist-container').style.display = 'none';
    document.getElementById('empty-wishlist').style.display = 'block';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WishlistPage();
  });
} else {
  new WishlistPage();
}