document.addEventListener('DOMContentLoaded', () => {
  const wishlistKey = 'user_wishlist';

  // Helper: Get current wishlist
  const getWishlist = () => {
    return JSON.parse(localStorage.getItem(wishlistKey) || '[]');
  };

  // Helper: Save wishlist
  const saveWishlist = (array) => {
    localStorage.setItem(wishlistKey, JSON.stringify(array));
    updateWishlistUI();
  };

  // Toggle Function
  const toggleWishlist = (handle) => {
    let wishlist = getWishlist();
    const index = wishlist.indexOf(handle);

    if (index === -1) {
      wishlist.push(handle); // Add
    } else {
      wishlist.splice(index, 1); // Remove
    }
    saveWishlist(wishlist);
  };

  // UI Update Function (Runs on load and change)
  const updateWishlistUI = () => {
    const wishlist = getWishlist();
    
    // 1. Update all heart buttons across the site
    document.querySelectorAll('.js-wishlist-btn').forEach(btn => {
      const handle = btn.dataset.productHandle;
      if (wishlist.includes(handle)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 2. Update the global sticky counter (optional logic)
    const countElement = document.querySelector('.wishlist-count-bubble');
    if (countElement) countElement.innerText = wishlist.length;
  };

 // Event Delegation for clicks
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-wishlist-btn');
    if (!btn) return;
    
    // Stop the link from firing
    e.preventDefault(); 
    e.stopPropagation(); 
    
    const handle = btn.dataset.productHandle;
    toggleWishlist(handle);
  });

  // Init
  updateWishlistUI();
});