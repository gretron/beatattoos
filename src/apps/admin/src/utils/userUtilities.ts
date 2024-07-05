import { faker } from "@faker-js/faker";
import { Role } from "@prisma/client";
import type { User } from "@prisma/client";

/**
 * Utility to create a randomized user
 * @returns A randomized user
 */
export function createUser(): User {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    emailAddress: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.enumValue(Role),
  };
}
