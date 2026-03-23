import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SpecialOffer = {
  id: string;
  sort_order: number;
  title: string;
  price: string;
  image_url: string | null;
  description: string;
  details: string | null;
  is_active: boolean;
};

export function useSpecialOffers() {
  return useQuery({
    queryKey: ["special_offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("special_offers")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data as SpecialOffer[];
    },
  });
}

export function useAllSpecialOffers() {
  return useQuery({
    queryKey: ["special_offers_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("special_offers")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as SpecialOffer[];
    },
  });
}

export function useUpsertSpecialOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (offer: Partial<SpecialOffer> & { title: string }) => {
      const { error } = await supabase
        .from("special_offers")
        .upsert({ ...offer, updated_at: new Date().toISOString() } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["special_offers"] });
      qc.invalidateQueries({ queryKey: ["special_offers_all"] });
    },
  });
}

export function useDeleteSpecialOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("special_offers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["special_offers"] });
      qc.invalidateQueries({ queryKey: ["special_offers_all"] });
    },
  });
}
