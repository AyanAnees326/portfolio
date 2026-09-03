import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'IntersectionObserver', { value: IntersectionObserverMock });
Object.defineProperty(window, 'ResizeObserver', { value: IntersectionObserverMock });
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true });
Object.defineProperty(Element.prototype, 'scrollIntoView', { value: () => {}, writable: true });
