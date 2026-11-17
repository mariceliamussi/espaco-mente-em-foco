import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const servicesQuery = queryOptions({
  queryKey: ["services", "public"],
  queryFn: async () => {
    const { data, error } = await supabase.from("services").select("*").eq("active", true).order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const postsQuery = queryOptions({
  queryKey: ["posts", "public"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("id,slug,title,excerpt,cover_url,published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["posts", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
