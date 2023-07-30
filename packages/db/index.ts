import { createClient } from "@supabase/supabase-js";
import { Client } from "fauna";

export * from "./src/fauna/collections/event";
export * from "./src/fauna/collections/Users";

var _supabaseClient: ReturnType<typeof createClient> | undefined;
export const supabaseClient = (supabaseKey: string) => {
  "use strict";
  if (!_supabaseClient) {
    console.debug("Creating new supabase client");
    _supabaseClient = createClient(
      "https://hlfwftvznmtrejjxclvr.supabase.co",
      supabaseKey,
      { auth: { persistSession: false } },
    );
  }
  return _supabaseClient;
};

var _faunaClient: Client | undefined;
export const faunaClient = (faunaKey: string) => {
  "use strict";
  if (!_faunaClient) {
    console.debug("Creating new fauna client");
    _faunaClient = new Client({
      secret: faunaKey,
    });
  }
  return _faunaClient;
};
