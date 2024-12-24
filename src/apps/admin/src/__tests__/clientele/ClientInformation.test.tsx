import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ClienteleContextProvider from "~/app/(protected)/clientele/_context/ClienteleContext";
import ClientInformation from "~/app/(protected)/clientele/[id]/_components/ClientInformation";
import { createUser } from "~/utils/user-utilities";
import {
  SELECTED_MOCK_CITY,
  SELECTED_MOCK_COUNTRY,
  SELECTED_MOCK_STATE_PROVINCE,
} from "~/utils/integration-test-utilities";
import ClientWithLocations from "~/app/(protected)/clientele/_types/ClientWithLocations";

const client = {
  ...createUser(),
  country: { ...SELECTED_MOCK_COUNTRY, alternatenames: [] },
  stateProvince: { ...SELECTED_MOCK_STATE_PROVINCE, alternatenames: [] },
  city: { ...SELECTED_MOCK_CITY, alternatenames: [] },
} as ClientWithLocations;

describe("ClientInformation", async () => {
  beforeEach(() => {
    render(
      <ClienteleContextProvider>
        <ClientInformation client={client} />
      </ClienteleContextProvider>,
    );
  });

  it("should display client information correctly", async () => {
    expect(screen.getByText(client.firstName, { exact: false })).toBeDefined();
    expect(screen.getByText(client.lastName, { exact: false })).toBeDefined();
    expect(screen.getByText(client.emailAddress)).toBeDefined();
    expect(screen.getByText(client.country.name)).toBeDefined();
    expect(screen.getByText(client.stateProvince.name)).toBeDefined();

    if (client.city) {
      expect(screen.getByText(client.city.name)).toBeDefined();
    }
  });
});
