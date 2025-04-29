import { supabase } from "./lib/supabase";

// This is a simple middleware function that can be used to check if a user is authenticated
// It can be imported and used in any component or route
export async function requireAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { authenticated: false };
  }

  return { authenticated: true, user: session.user };
}

// Helper function to redirect unauthenticated users
export function redirectIfUnauthenticated(navigate: (path: string) => void) {
  return async () => {
    const { authenticated } = await requireAuth();

    if (!authenticated) {
      navigate("/signin");
      return false;
    }

    return true;
  };
}
