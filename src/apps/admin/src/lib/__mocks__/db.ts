import { vi } from "vitest";

export const db = {
  user: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  country: {
    findUnique: vi.fn(),
  },
  stateProvince: {
    findMany: vi.fn(),
  },
  city: {
    findMany: vi.fn(),
  },
};
