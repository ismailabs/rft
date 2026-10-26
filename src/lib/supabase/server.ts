import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";
import { authCookieOptions } from "./cookie-options";

export async function serverClient() {
  const config = supabaseConfig();
  if (!config) throw new Error("NOT_CONFIGURED");
  const store = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions: authCookieOptions(),
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          /* Server Component refresh is handled by proxy. */
        }
      },
    },
  });
}
