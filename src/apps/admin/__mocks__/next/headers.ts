import { vi } from "vitest";

export const cookies = vi.fn().mockReturnValue({ get: vi.fn(), set: vi.fn() });
