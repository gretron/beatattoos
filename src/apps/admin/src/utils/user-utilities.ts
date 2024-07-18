import { faker } from "@faker-js/faker";
import { Role } from "@prisma/client";
import type { User } from "@prisma/client";

/**
 * Utility to create a randomized user
 * @param overrideFields Fields to override certain randomized values
 * @returns A randomized user
 */
export function createUser(overrideFields?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    emailAddress: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.enumValue(Role),
    ...overrideFields,
  };
}
