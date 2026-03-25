import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useSiteContent, useUpdateSiteContent } from "@/hooks/useSiteContent";
import { useAllExcursions, useUpsertExcursion, useDeleteExcursion, type Excursion } from "@/hooks/useExcursions";
import { useAllSpecialOffers, useUpsertSpecialOffer, useDeleteSpecialOffer, type SpecialOffer } from "@/hooks/useSpecialOffers";
import { useAllReviews, useUpsertReview, useDeleteReview, type Review } from "@/hooks/useReviews";
import { LogOut, Save, Plus, Trash2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const Admin = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background">Загрузка...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Панель управления</h1>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-1" /> Выйти
          </Button>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Tabs defaultValue="content">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="content" className="flex-1">Тексты</TabsTrigger>
              <TabsTrigger value="excursions" className="flex-1">Экскурсии</TabsTrigger>
              <TabsTrigger value="offers" className="flex-1">Акции</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">Отзывы</TabsTrigger>
            </TabsList>
            <TabsContent value="content"><SiteContentEditor /></TabsContent>
            <TabsContent value="excursions"><ExcursionsEditor /></TabsContent>
            <TabsContent value="offers"><OffersEditor /></TabsContent>
            <TabsContent value="reviews"><ReviewsEditor /></TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

// --- Site Content Editor ---
const CONTENT_FIELDS = [
  { key: "site_title", label: "Заголовок сайта" },
  { key: "subtitle", label: "Подзаголовок" },
  { key: "motivational_top", label: "Мотивация (верх)" },
  { key: "motivational_middle", label: "Мотивация (середина)" },
  { key: "motivational_bottom", label: "Мотивация (низ)" },
  { key: "phone_number", label: "Телефон" },
  { key: "chef_section_title", label: "Заголовок секции повара" },
  { key: "chef_name", label: "Имя повара" },
  { key: "chef_title", label: "Должность повара" },
  { key: "chef_description", label: "Описание повара", multiline: true },
  { key: "offers_section_title", label: "Заголовок секции акций" },
  { key: "footer_copyright", label: "Копирайт в подвале" },
  { key: "footer_created_by", label: "'Создано...' в подвале" },
  { key: "footer_telegram_url", label: "Telegram ссылка" },
  { key: "footer_vk_url", label: "VK ссылка" },
];

function SiteContentEditor() {
  const { data: content, isLoading } = useSiteContent();
  const updateMutation = useUpdateSiteContent();
  const [edits, setEdits] = useState<Record<string, string>>({});

  if (isLoading) return <p>Загрузка...</p>;

  const getValue = (key: string) => edits[key] ?? content?.[key] ?? "";
  const isDirty = Object.keys(edits).some((k) => edits[k] !== (content?.[k] ?? ""));

  const handleSave = async () => {
    try {
      for (const [key, value] of Object.entries(edits)) {
        if (value !== (content?.[key] ?? "")) {
          await updateMutation.mutateAsync({ key, value });
        }
      }
      setEdits({});
      toast.success("Сохранено!");
    } catch {
      toast.error("Ошибка сохранения");
    }
  };

  return (
    <div className="space-y-4">
      {CONTENT_FIELDS.map((field) => (
        <div key={field.key}>
          <label className="text-sm font-medium text-foreground mb-1 block">{field.label}</label>
          {"multiline" in field && field.multiline ? (
            <Textarea
              value={getValue(field.key)}
              onChange={(e) => setEdits({ ...edits, [field.key]: e.target.value })}
              rows={3}
            />
          ) : (
            <Input
              value={getValue(field.key)}
              onChange={(e) => setEdits({ ...edits, [field.key]: e.target.value })}
            />
          )}
        </div>
      ))}
      <Button onClick={handleSave} disabled={!isDirty || updateMutation.isPending}>
        <Save className="h-4 w-4 mr-1" /> Сохранить изменения
      </Button>
    </div>
  );
}

// --- Excursions Editor ---
function ExcursionsEditor() {
  const { data: excursions, isLoading } = useAllExcursions();
  const upsertMutation = useUpsertExcursion();
  const deleteMutation = useDeleteExcursion();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Excursion>>({});

  if (isLoading) return <p>Загрузка...</p>;

  const startEdit = (exc: Excursion) => {
    setEditingId(exc.id);
    setForm({ ...exc });
  };

  const startNew = () => {
    setEditingId("new");
    setForm({ name: "", price: "", description: "", details: "", sort_order: (excursions?.length ?? 0) + 1, is_active: true });
  };

  const handleSave = async () => {
    if (!form.name) { toast.error("Введите название"); return; }
    try {
      const payload = editingId === "new" ? { ...form } : { id: editingId, ...form };
      await upsertMutation.mutateAsync(payload as any);
      toast.success("Сохранено!");
      setEditingId(null);
      setForm({});
    } catch {
      toast.error("Ошибка сохранения");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить экскурсию?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Удалено");
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  if (editingId) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold">{editingId === "new" ? "Новая экскурсия" : "Редактирование"}</h3>
        <Input placeholder="Название" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Отображаемое имя (необязательно)" value={form.display_name ?? ""} onChange={(e) => setForm({ ...form, display_name: e.target.value || null })} />
        <Input placeholder="Цена" value={form.price ?? ""} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <ImageUpload value={form.image_url ?? null} onChange={(url) => setForm({ ...form, image_url: url })} folder="excursions" />
        <Textarea placeholder="Описание" rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Textarea placeholder="Детали" rows={3} value={form.details ?? ""} onChange={(e) => setForm({ ...form, details: e.target.value || null })} />
        <Input type="number" placeholder="Порядок сортировки" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        <div className="flex items-center gap-2">
          <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
          <span className="text-sm">Активна</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={upsertMutation.isPending}><Save className="h-4 w-4 mr-1" />Сохранить</Button>
          <Button variant="outline" onClick={() => { setEditingId(null); setForm({}); }}>Отмена</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button onClick={startNew} variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" />Добавить</Button>
      {excursions?.map((exc) => (
        <Card key={exc.id} className={!exc.is_active ? "opacity-50" : ""}>
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{exc.name}</p>
              <p className="text-xs text-muted-foreground">{exc.price}</p>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => startEdit(exc)}>✏️</Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(exc.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- Offers Editor ---
function OffersEditor() {
  const { data: offers, isLoading } = useAllSpecialOffers();
  const upsertMutation = useUpsertSpecialOffer();
  const deleteMutation = useDeleteSpecialOffer();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<SpecialOffer>>({});

  if (isLoading) return <p>Загрузка...</p>;

  const startEdit = (offer: SpecialOffer) => {
    setEditingId(offer.id);
    setForm({ ...offer });
  };

  const startNew = () => {
    setEditingId("new");
    setForm({ title: "", price: "", description: "", details: "", sort_order: (offers?.length ?? 0) + 1, is_active: true });
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("Введите название"); return; }
    try {
      const payload = editingId === "new" ? { ...form } : { id: editingId, ...form };
      await upsertMutation.mutateAsync(payload as any);
      toast.success("Сохранено!");
      setEditingId(null);
      setForm({});
    } catch {
      toast.error("Ошибка сохранения");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить акцию?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Удалено");
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  if (editingId) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold">{editingId === "new" ? "Новая акция" : "Редактирование"}</h3>
        <Input placeholder="Название" value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input placeholder="Цена" value={form.price ?? ""} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <ImageUpload value={form.image_url ?? null} onChange={(url) => setForm({ ...form, image_url: url })} folder="offers" />
        <Textarea placeholder="Описание" rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Textarea placeholder="Детали" rows={3} value={form.details ?? ""} onChange={(e) => setForm({ ...form, details: e.target.value || null })} />
        <Input type="number" placeholder="Порядок" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        <div className="flex items-center gap-2">
          <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
          <span className="text-sm">Активна</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={upsertMutation.isPending}><Save className="h-4 w-4 mr-1" />Сохранить</Button>
          <Button variant="outline" onClick={() => { setEditingId(null); setForm({}); }}>Отмена</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button onClick={startNew} variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" />Добавить</Button>
      {offers?.map((offer) => (
        <Card key={offer.id} className={!offer.is_active ? "opacity-50" : ""}>
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{offer.title}</p>
              <p className="text-xs text-muted-foreground">{offer.price}</p>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => startEdit(offer)}>✏️</Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(offer.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- Reviews Editor ---
function ReviewsEditor() {
  const { data: reviews, isLoading } = useAllReviews();
  const upsertMutation = useUpsertReview();
  const deleteMutation = useDeleteReview();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Review>>({});

  if (isLoading) return <p>Загрузка...</p>;

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setForm({ ...review });
  };

  const startNew = () => {
    setEditingId("new");
    setForm({ author: "", text: "", sort_order: (reviews?.length ?? 0) + 1, is_active: true });
  };

  const handleSave = async () => {
    if (!form.author || !form.text) { toast.error("Заполните автора и текст"); return; }
    try {
      const payload = editingId === "new" ? { ...form } : { id: editingId, ...form };
      await upsertMutation.mutateAsync(payload as any);
      toast.success("Сохранено!");
      setEditingId(null);
      setForm({});
    } catch {
      toast.error("Ошибка сохранения");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить отзыв?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Удалено");
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  if (editingId) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold">{editingId === "new" ? "Новый отзыв" : "Редактирование"}</h3>
        <Input placeholder="Автор" value={form.author ?? ""} onChange={(e) => setForm({ ...form, author: e.target.value })} />
        <Textarea placeholder="Текст отзыва" rows={4} value={form.text ?? ""} onChange={(e) => setForm({ ...form, text: e.target.value })} />
        <Input type="number" placeholder="Порядок сортировки" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        <div className="flex items-center gap-2">
          <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
          <span className="text-sm">Активен</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={upsertMutation.isPending}><Save className="h-4 w-4 mr-1" />Сохранить</Button>
          <Button variant="outline" onClick={() => { setEditingId(null); setForm({}); }}>Отмена</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button onClick={startNew} variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" />Добавить</Button>
      {reviews?.map((review) => (
        <Card key={review.id} className={!review.is_active ? "opacity-50" : ""}>
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{review.author}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{review.text}</p>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => startEdit(review)}>✏️</Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(review.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Admin;
