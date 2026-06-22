import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom does not implement IntersectionObserver, which is used by
// components such as HeroStats. Provide a no-op mock so they can render.
class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
