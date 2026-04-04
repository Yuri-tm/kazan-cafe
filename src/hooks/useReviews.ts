import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Review = {
  id: string;
  author: string;
  text: string;
  sort_order: number;
  is_active: boolean;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
};

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data as Review[];
    },
  });
}

export function useAllReviews() {
  return useQuery({
    queryKey: ["reviews", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Review[];
    },
  });
}

export function useUpsertReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (review: Partial<Review>) => {
      const { error } = await supabase.from("reviews").upsert({
        ...review,
        updated_at: new Date().toISOString(),
      } as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (review: { author: string; text: string }) => {
      const { error } = await supabase.from("reviews").insert({
        author: review.author,
        text: review.text,
        is_active: true,
        sort_order: 999,
        likes: 0,
        dislikes: 0,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useReactToReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, field }: { id: string; field: "likes" | "dislikes" }) => {
      // Fetch current value first
      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select(field)
        .eq("id", id)
        .single();
      if (fetchError) throw fetchError;
      const current = (data as any)[field] as number;
      const { error } = await supabase
        .from("reviews")
        .update({ [field]: current + 1 } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
