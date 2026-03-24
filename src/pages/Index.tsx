import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import kulSharifImg from "@/assets/Kremlin_noBG_small.png";
import bolgarNoBgImg from "@/assets/Bolgar_noBG_small.png";
import sviyazhskImg from "@/assets/Sviyazhsk_noBG.png";
import slobodaNoBGImg from "@/assets/Sloboda_noBG_small.png";
import raifaImg from "@/assets/Raifa_noBG_small.png";
import agriculturePalaceImg from "@/assets/AP_noBG_small.png";
import nightGownImg from "@/assets/NightGown_noBG_small.png";
import soyombikehImg from "@/assets/Soyembikeh_small.png";
import pyramidImg from "@/assets/Pyramid_noBG_small.png";
import gastroTourImg from "@/assets/GastroTour_noBG_small.png";
import R22Img from "@/assets/R22.jpg";
import templeOfAllReligionsImg from "@/assets/TAR_noBG_small.png";
import logoImg from "@/assets/Logo.svg";
import zilantImg from "@/assets/Zilant_noBG_small.png";
import robotImg from "@/assets/robot_noBG.png";
import egyptImg from "@/assets/Egypt_noBG_small.png"
import Footer from "@/components/Footer";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useExcursions, type Excursion } from "@/hooks/useExcursions";
import { useSpecialOffers, type SpecialOffer } from "@/hooks/useSpecialOffers";

// Fallback image map for excursions loaded from DB (matched by name)
const IMAGE_MAP: Record<string, string> = {
  "Белый камень с крестом и полумесяцем": kulSharifImg,
  "Свияжск": sviyazhskImg,
  "Татарская слобода": slobodaNoBGImg,
  "Раифский монастырь": raifaImg,
  "Туфелька Сююмбике": soyombikehImg,
  "Болгар": bolgarNoBgImg,
  "Муха на окне": pyramidImg,
  "По следам Зиланта": zilantImg,
  "Казань на максималках": agriculturePalaceImg,
  "Вкусная татарская тарелка": gastroTourImg,
  "Вечерний наряд Сююмбике": nightGownImg,
  "Перезагрузка будущего 2к1": robotImg,
};

const OFFER_IMAGE_MAP: Record<string, string> = {
  "Күчтәнәч (гостинец)": templeOfAllReligionsImg,
  "Бүләк (подарок)": egyptImg,
};

const Index = () => {
  const { data: content } = useSiteContent();
  const { data: dbExcursions } = useExcursions();
  const { data: dbOffers } = useSpecialOffers();

  const c = (key: string, fallback: string) => content?.[key] ?? fallback;
  const phoneNumber_ = c("phone_number", "+79600897952");

  const excursions = dbExcursions ?? [];
  const offers = dbOffers ?? [];

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const handleCheckboxChange = (productId: string, checked: boolean) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (checked) next.add(productId); else next.delete(productId);
      return next;
    });
  };

  const [isSending, setIsSending] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleOrderClick = () => setShowPhoneDialog(true);

  const handleSubmit = async () => {
    if (!phoneNumber.trim()) { toast.error("Введите номер телефона"); return; }
    const selected = excursions.filter((p) => selectedProducts.has(p.id));
    const productsForSubmission = selected.length > 0
      ? selected.map((p) => ({ name: p.name, price: p.price }))
      : [{ name: "Заявка без выбранных экскурсий", price: "Уточнить по телефону" }];
    setIsSending(true);
    setShowPhoneDialog(false);
    try {
      const { error } = await supabase.functions.invoke("send-telegram", {
        body: { products: productsForSubmission, phone: phoneNumber.trim() },
      });
      if (error) throw error;
      toast.success("Заказ отправлен!");
      setSelectedProducts(new Set());
      setPhoneNumber("");
    } catch (err) {
      console.error("Send error:", err);
      toast.error("Ошибка отправки заказа");
    } finally {
      setIsSending(false);
    }
  };

  const leftProducts = excursions.filter((_, i) => i % 2 === 0);
  const rightProducts = excursions.filter((_, i) => i % 2 === 1);

  const getImage = (exc: Excursion) => exc.image_url || IMAGE_MAP[exc.name] || "";

  const renderProductCard = (product: Excursion) => {
    const isExpanded = expandedId === product.id;
    const productTitle = product.display_name || product.name;
    const img = getImage(product);
    return (
      <Card key={product.id} className="overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-md" onClick={() => setExpandedId((prev) => prev === product.id ? null : product.id)}>
        <CardContent className="p-0">
          <div className="relative aspect-square bg-muted">
            {img && (
              <img
                src={img}
                alt={product.name}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 50vw, 240px"
                className="w-full h-full object-contain"
              />
            )}
            <label className="absolute top-2 right-2 flex items-center gap-1.5 z-10 cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <span className="text-[10px] font-medium text-foreground bg-background/80 backdrop-blur-sm rounded px-1 py-0.5">Выбрать</span>
              <Checkbox checked={selectedProducts.has(product.id)} onCheckedChange={(checked) => handleCheckboxChange(product.id, !!checked)} className="h-5 w-5 rounded-full border-2 border-primary bg-background/80 backdrop-blur-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
            </label>
          </div>
          <div className="p-3">
            <p className="text-sm font-medium text-card-foreground whitespace-pre-line">{productTitle}</p>
            <p className="text-xs text-muted-foreground">{product.price}</p>
          </div>
          <div className="overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out" style={{ maxHeight: isExpanded ? "400px" : "0px", opacity: isExpanded ? 1 : 0 }}>
            <div className="px-3 pb-3">
              <p className="text-xs leading-relaxed text-secondary-foreground">{product.description}</p>
              {product.details && (
                <>
                  <hr className="my-2 border-border" />
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{product.details}</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderOfferCard = (offer: SpecialOffer) => {
    const isExpanded = expandedOfferId === offer.id;
    const img = offer.image_url || OFFER_IMAGE_MAP[offer.title] || "";
    return (
      <Card key={offer.id} className="flex-1 min-w-0 overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-md" onClick={() => setExpandedOfferId((prev) => prev === offer.id ? null : offer.id)}>
        <CardContent className="p-0">
          <div className="relative aspect-square bg-muted">
            {img && (
              <img
                src={img}
                alt={offer.title}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 50vw, 240px"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="p-3">
            <p className="text-sm font-medium text-card-foreground whitespace-pre-line">{offer.title}</p>
            <p className="text-xs text-muted-foreground">{offer.price}</p>
          </div>
          <div className="overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out" style={{ maxHeight: isExpanded ? "400px" : "0px", opacity: isExpanded ? 1 : 0 }}>
            <div className="px-3 pb-3">
              <p className="text-xs leading-relaxed text-secondary-foreground">{offer.description}</p>
              {offer.details && (
                <>
                  <hr className="my-2 border-border" />
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{offer.details}</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TelegramIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
  );

  const ActionButtons = () => (
    <div className="flex items-stretch gap-3 mb-6">
      <Button asChild className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
        <a href={`tel:${phoneNumber_}`}><Phone className="h-4 w-4" />​ПОЗВОНИТЬ</a>
      </Button>
      <Button variant="secondary" className="flex-1 rounded-xl text-primary" onClick={handleOrderClick} disabled={isSending}>
        <TelegramIcon />
        {isSending ? "ОТПРАВКА..." : "ЗАКАЗАТЬ"}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-[12px] py-[24px]">
        <header className="flex items-center justify-between mb-4">
          <div className="w-1/4 flex items-center justify-center">
            <img
              src={logoImg}
              alt="logo"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-bold text-foreground text-center py-[10px] px-[10px] text-2xl">
            {c("site_title", "Тур-кафе СӘЯХӘТ (путешествие)")}
          </h1>
          <a href={`tel:${phoneNumber_}`} className="text-muted-foreground">
            <Phone className="h-5 w-5" />
          </a>
        </header>

        <p className="text-center text-foreground mb-4 font-semibold">{c("subtitle", "")}</p>
        <p className="text-center text-muted-foreground mb-4 font-semibold">{c("motivational_top", "")}</p>

        <ActionButtons />

        <div className="flex gap-3 mb-8">
          <div className="flex-1 flex flex-col gap-3">{leftProducts.map(renderProductCard)}</div>
          <div className="flex-1 flex flex-col gap-3">{rightProducts.map(renderProductCard)}</div>
        </div>

        <p className="text-center text-muted-foreground mb-4 font-semibold">{c("motivational_middle", "")}</p>

        <ActionButtons />

        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">{c("chef_section_title", "Наш повар и его команда")}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg overflow-hidden">
              <img
                src={R22Img}
                alt={c("chef_name", "Руслан Валиев")}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 50vw, 320px"
                className="h-full w-full object-cover"
              />
            </div>
            <Card className="overflow-hidden">
              <CardContent className="p-0 h-full">
                <div className="p-3 flex flex-col justify-center">
                  <p className="text-sm font-semibold text-card-foreground mb-2">{c("chef_name", "Руслан Валиев")}</p>
                  <p className="text-xs text-muted-foreground font-semibold mb-4">{c("chef_title", "шеф-повар")}</p>
                  <p className="text-xs text-muted-foreground">{c("chef_description", "")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">{c("offers_section_title", "Комплимент от шеф-повара")}</h2>
          <div className="flex items-start gap-3">
            <div className="flex w-full flex-row items-stretch gap-3">
              {offers.map(renderOfferCard)}
            </div>
          </div>
        </section>

        <p className="text-center text-muted-foreground mb-4 font-semibold">{c("motivational_bottom", "")}</p>

        <ActionButtons />

        <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Введите номер телефона</DialogTitle>
              <DialogDescription>Укажите ваш номер телефона для связи по заказу</DialogDescription>
            </DialogHeader>
            <Input type="tel" placeholder="+7 (900) 000-00-00" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="text-lg" />
            <Button onClick={handleSubmit} disabled={!phoneNumber.trim() || isSending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSending ? "Отправка..." : "Отправить заказ"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <Footer content={content} />
    </div>
  );
};

export default Index;
