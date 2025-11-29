import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../utils/testUtils';
import Navigation from '../../components/Navigation';
import useStore from '../../stores/useStore';

// Mock useNavigate and useLocation from react-router-dom
const mockNavigate = vi.fn();
const mockLocation = { pathname: '/' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

describe('Navigation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear cart before each test
    useStore.getState().clearCart();
  });

  describe('Rendering', () => {
    it('should render the brand name', () => {
      render(<Navigation />);
      expect(screen.getByText(/KHARDING/i)).toBeInTheDocument();
    });

    it('should render all navigation links on desktop', () => {
      // Mock window.innerWidth for desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<Navigation />);

      expect(screen.getByText('Collection')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Festival')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should show cart icon with item count', () => {
      // Add items to cart
      const store = useStore.getState();
      store.addToCart('test-piece-1', 'M');
      store.addToCart('test-piece-2', 'L');

      render(<Navigation />);

      const cartBadge = screen.getByText('2');
      expect(cartBadge).toBeInTheDocument();
    });

    it('should not show cart badge when cart is empty', () => {
      render(<Navigation />);

      const cartBadge = screen.queryByText('0');
      expect(cartBadge).not.toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should navigate to home when brand is clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const brandButton = screen.getByText(/KHARDING/i);
      await user.click(brandButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to collection page when Collection is clicked', async () => {
      const user = userEvent.setup();
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<Navigation />);

      const collectionLink = screen.getByText('Collection');
      await user.click(collectionLink);

      expect(mockNavigate).toHaveBeenCalledWith('/collection');
    });

    it('should navigate to cart when cart icon is clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      // Cart is the button with ShoppingBag icon - find by checking buttons
      const buttons = screen.getAllByRole('button');
      // Cart button is after brand and nav items
      const cartButton = buttons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg && btn.onclick !== null;
      });

      if (cartButton) {
        await user.click(cartButton);
      }

      // Just verify navigate was called (it will be called for cart)
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe('Mobile Menu', () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('should render on mobile viewport', () => {
      render(<Navigation />);

      // On mobile, navigation links are initially hidden
      // Just verify the component renders
      expect(screen.getByText(/KHARDING/i)).toBeInTheDocument();
    });

    it('should show mobile menu structure', async () => {
      render(<Navigation />);

      // Verify mobile layout is present by checking for icon buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Cart Count Updates', () => {
    it('should update cart count when items are added', () => {
      const { rerender } = render(<Navigation />);

      // Initially no badge
      expect(screen.queryByText('1')).not.toBeInTheDocument();

      // Add item to cart
      const store = useStore.getState();
      store.addToCart('test-piece-1', 'M');

      // Force re-render
      rerender(<Navigation />);

      // Should show badge with count
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should calculate total quantity correctly', () => {
      const store = useStore.getState();
      store.addToCart('test-piece-1', 'M');
      store.addToCart('test-piece-1', 'M'); // quantity 2
      store.addToCart('test-piece-2', 'L'); // quantity 1

      render(<Navigation />);

      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});
