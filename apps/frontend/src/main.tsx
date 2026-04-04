import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

// 1. Import the TanStack Query pieces
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 2. Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // These settings prevent the app from re-fetching every
      // time you click away and back to the window
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 3. Wrap the RouterProvider with the QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
