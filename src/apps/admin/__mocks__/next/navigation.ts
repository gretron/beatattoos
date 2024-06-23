import { vi } from "vitest";

export const redirect = vi.fn();
export const useSearchParams = vi.fn().mockReturnValue({ get: vi.fn() });
