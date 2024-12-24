"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import ClientWithLocations from "~/app/(protected)/clientele/_types/ClientWithLocations";

/**
 * Context for clientele pages
 */
export const ClienteleContext = createContext<{
  clients: ClientWithLocations[];
  setClients: Dispatch<SetStateAction<ClientWithLocations[]>>;
}>({
  clients: [],
  setClients: (prev) => prev,
});

/**
 * Props for {@link ClienteleContextProvider}
 */
interface ClienteleContextProps {
  children: ReactNode;
}

/**
 * Provider for {@link ClienteleContext}
 */
export default function ClienteleContextProvider(props: ClienteleContextProps) {
  const [clients, setClients] = useState<ClientWithLocations[]>([]);

  return (
    <ClienteleContext.Provider value={{ clients, setClients }}>
      {props.children}
    </ClienteleContext.Provider>
  );
}
