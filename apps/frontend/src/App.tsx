import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";

// 1. Initialize the Query Client
// We set a default 'staleTime' so the dashboard doesn't
// spam your backend every time you switch tabs.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Prevents refreshing on every click
      retry: 1, // Only retry failed requests once
    },
  },
});

/**
 * App Root - Sentinel Command Center
 * Combines Routing and Global Data State
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* The RouterProvider sits inside the QueryClientProvider 
          so that all Dashboard pages can use useQuery() 
      */}
      <RouterProvider router={router} />

      {/* Optional: Add ReactQueryDevtools here if you want to debug in development */}
    </QueryClientProvider>
  );
};

export default App;
