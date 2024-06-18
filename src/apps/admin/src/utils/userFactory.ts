import { faker } from "@faker-js/faker";
import type { User } from "@prisma/client";
import { Role } from "@prisma/client";

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
