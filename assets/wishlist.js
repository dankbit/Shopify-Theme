class WishlistManager {
  constructor() {
    this.storageKey = 'shopify_wishlist';
    this.wishlist = this.getWishlist();
    this.init();
  }

  init() {
    this.renderWishlistButtons();
    this.attachEventListeners();
  }

  getWishlist() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveWishlist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
  }

  addToWishlist(productId) {
    if (!this.wishlist.includes(productId)) {
      this.wishlist.push(productId);
      this.saveWishlist();
    }
  }

  removeFromWishlist(productId) {
    this.wishlist = this.wishlist.filter((id) => id !== productId);
    this.saveWishlist();
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  attachEventListeners() {
    document.querySelectorAll('.wishlist-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = btn.dataset.productId;

        if (this.isInWishlist(productId)) {
          this.removeFromWishlist(productId);
          btn.classList.remove('is-wishlisted');
        } else {
          this.addToWishlist(productId);
          btn.classList.add('is-wishlisted');
        }
      });
    });
  }

  renderWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach((btn) => {
      const productId = btn.dataset.productId;
      if (this.isInWishlist(productId)) {
        btn.classList.add('is-wishlisted');
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WishlistManager();
  });
} else {
  new WishlistManager();
}