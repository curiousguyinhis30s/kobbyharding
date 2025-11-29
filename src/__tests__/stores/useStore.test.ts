import { describe, it, expect, beforeEach } from 'vitest';
import useStore, { type Piece } from '../../stores/useStore';

describe('useStore - Cart functionality', () => {
  beforeEach(() => {
    // Reset the store before each test
    const store = useStore.getState();
    store.clearCart();
    // Set up mock pieces for testing
    const mockPieces: Piece[] = [
      {
        id: 'piece-1',
        name: 'Test Piece 1',
        story: 'A beautiful piece',
        fabricOrigin: 'Italy',
        denimType: 'Selvedge',
        vibe: 'Classic',
        imageUrl: '/test1.jpg',
        createdFor: 'Festival',
        currentLocation: 'Bangkok',
        weight: 0.5,
        views: 10,
        hearts: 5,
        inquiries: 2,
        price: 150,
        available: true,
        category: 'denims',
      },
      {
        id: 'piece-2',
        name: 'Test Piece 2',
        story: 'Another beautiful piece',
        fabricOrigin: 'Japan',
        denimType: 'Raw',
        vibe: 'Modern',
        imageUrl: '/test2.jpg',
        createdFor: 'Casual',
        currentLocation: 'Bangkok',
        weight: 0.6,
        views: 15,
        hearts: 8,
        inquiries: 3,
        price: 200,
        available: true,
        category: 't-shirts',
      },
    ];
    store.setPieces(mockPieces);
  });

  describe('addToCart', () => {
    it('should add a new item to cart', () => {
      useStore.getState().addToCart('piece-1', 'M');
      const state = useStore.getState();

      expect(state.cartItems).toHaveLength(1);
      expect(state.cartItems[0]).toEqual({
        pieceId: 'piece-1',
        size: 'M',
        quantity: 1,
      });
    });

    it('should increment quantity if item already exists', () => {
      useStore.getState().addToCart('piece-1', 'M');
      useStore.getState().addToCart('piece-1', 'M');
      const state = useStore.getState();

      expect(state.cartItems).toHaveLength(1);
      expect(state.cartItems[0].quantity).toBe(2);
    });

    it('should add different sizes as separate items', () => {
      useStore.getState().addToCart('piece-1', 'M');
      useStore.getState().addToCart('piece-1', 'L');
      const state = useStore.getState();

      expect(state.cartItems).toHaveLength(2);
      expect(state.cartItems[0].size).toBe('M');
      expect(state.cartItems[1].size).toBe('L');
    });
  });

  describe('removeFromCart', () => {
    it('should remove an item from cart', () => {
      useStore.getState().addToCart('piece-1', 'M');
      useStore.getState().removeFromCart('piece-1', 'M');
      const state = useStore.getState();

      expect(state.cartItems).toHaveLength(0);
    });

    it('should only remove the specific size', () => {
      useStore.getState().addToCart('piece-1', 'M');
      useStore.getState().addToCart('piece-1', 'L');
      useStore.getState().removeFromCart('piece-1', 'M');
      const state = useStore.getState();

      expect(state.cartItems).toHaveLength(1);
      expect(state.cartItems[0].size).toBe('L');
    });

    it('should not affect other items', () => {
      useStore.getState().addToCart('piece-1', 'M');
      useStore.getState().addToCart('piece-2', 'M');
      useStore.getState().removeFromCart('piece-1', 'M');
      const state = useStore.getState();

      expect(state.cartItems).toHaveLength(1);
      expect(state.cartItems[0].pieceId).toBe('piece-2');
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      useStore.getState().addToCart('piece-1', 'M');
      useStore.getState().updateQuantity('piece-1', 'M', 5);
      const state = useStore.getState();

      expect(state.cartItems[0].quantity).toBe(5);
    });

    it('should remove item if quantity is zero', () => {
      useStore.getState().addToCart('piece-1', 'M');
      useStore.getState().updateQuantity('piece-1', 'M', 0);
      const state = useStore.getState();

      expect(state.cartItems).toHaveLength(0);
    });

    it('should remove item if quantity is negative', () => {
      useStore.getState().addToCart('piece-1', 'M');
      useStore.getState().updateQuantity('piece-1', 'M', -1);
      const state = useStore.getState();

      expect(state.cartItems).toHaveLength(0);
    });

    it('should only update the specific item', () => {
      useStore.getState().addToCart('piece-1', 'M');
      useStore.getState().addToCart('piece-2', 'M');
      useStore.getState().updateQuantity('piece-1', 'M', 3);
      const state = useStore.getState();

      expect(state.cartItems[0].quantity).toBe(3);
      expect(state.cartItems[1].quantity).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const store = useStore.getState();
      store.addToCart('piece-1', 'M');
      store.addToCart('piece-2', 'L');
      store.clearCart();

      expect(store.cartItems).toHaveLength(0);
    });

    it('should work when cart is already empty', () => {
      const store = useStore.getState();
      store.clearCart();

      expect(store.cartItems).toHaveLength(0);
    });
  });

  describe('getCartTotal', () => {
    it('should calculate total for single item', () => {
      const store = useStore.getState();
      store.addToCart('piece-1', 'M');

      expect(store.getCartTotal()).toBe(150);
    });

    it('should calculate total with quantity', () => {
      const store = useStore.getState();
      store.addToCart('piece-1', 'M');
      store.updateQuantity('piece-1', 'M', 3);

      expect(store.getCartTotal()).toBe(450);
    });

    it('should calculate total for multiple items', () => {
      const store = useStore.getState();
      store.addToCart('piece-1', 'M');
      store.addToCart('piece-2', 'L');

      expect(store.getCartTotal()).toBe(350); // 150 + 200
    });

    it('should return 0 for empty cart', () => {
      const store = useStore.getState();

      expect(store.getCartTotal()).toBe(0);
    });

    it('should handle complex cart scenarios', () => {
      const store = useStore.getState();
      store.addToCart('piece-1', 'M');
      store.addToCart('piece-1', 'M'); // quantity 2
      store.addToCart('piece-2', 'L');
      store.updateQuantity('piece-2', 'L', 3);

      expect(store.getCartTotal()).toBe(900); // (150 * 2) + (200 * 3)
    });
  });
});
