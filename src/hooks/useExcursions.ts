import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Excursion = {
  id: string;
  sort_order: number;
  name: string;
  display_name: string | null;
  price: string;
  image_url: string | null;
  description: string;
  details: string | null;
  category: string | null;
  is_active: boolean;
};

export function useExcursions() {
  return useQuery({
    queryKey: ["excursions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excursions")
        .select("id, sort_order, name, display_name, price, image_url, description, details, category, is_active")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data as Excursion[];
    },
  });
}

export function useAllExcursions() {
  return useQuery({
    queryKey: ["excursions_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excursions")
        .select("id, sort_order, name, display_name, price, image_url, description, details, category, is_active")
        .order("sort_order");
      if (error) throw error;
      return data as Excursion[];
    },
  });
}

export function useUpsertExcursion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (exc: Partial<Excursion> & { name: string }) => {
      const { error } = await supabase
        .from("excursions")
        .upsert({ ...exc, updated_at: new Date().toISOString() } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["excursions"] });
      qc.invalidateQueries({ queryKey: ["excursions_all"] });
    },
  });
}

export function useDeleteExcursion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("excursions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["excursions"] });
      qc.invalidateQueries({ queryKey: ["excursions_all"] });
    },
  });
}
