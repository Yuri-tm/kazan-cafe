import { useEffect, useState } from "react";
import diploma1PrevImg from "@/assets/Diploma1_prev.jpg";
import diploma1FullImg from "@/assets/Diploma1_full.jpg";
import diploma2PrevImg from "@/assets/Diploma2_prev.jpg";
import diploma2FullImg from "@/assets/Diploma2_full.jpg";
import cert1PrevImg from "@/assets/Cert1_prev.jpg";
import cert1FullImg from "@/assets/Cert1_full.jpg";
import thanxPrevImg from "@/assets/Thanx_prev.jpg";
import thanxFullImg from "@/assets/Thanx_full.jpg";

type LegalDoc = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: string;
  previewSrc: string;
  fullSrc: string;
};

const docs: LegalDoc[] = [
  {
    id: "diploma1",
    title: "Удостоверение о повышении квалификации",
    subtitle: "РГУТИС, 2024",
    description: "Комплексный подход к развитию молодежного туризма.",
    details: "Скан документа доступен в полном размере по нажатию на превью.",
    previewSrc: diploma1PrevImg,
    fullSrc: diploma1FullImg,
  },
  {
    id: "diploma2",
    title: "Удостоверение о повышении квалификации",
    subtitle: "КФУ, 2023",
    description: "Методика подготовки и проведения автобусной экскурсии. Обзорная экскурсия по Казани.",
    details: "Используйте полноразмерное изображение для удобного чтения номера и даты.",
    previewSrc: diploma2PrevImg,
    fullSrc: diploma2FullImg,
  },
  {
    id: "cert1",
    title: "Удостоверение о повышении квалификации",
    subtitle: "Казанский государственный университет культуры, 2025",
    description: "Мультимедийные технологии в экскурсионной деятельности.",
    details: "Откройте изображение в модальном окне, чтобы рассмотреть документ целиком.",
    previewSrc: cert1PrevImg,
    fullSrc: cert1FullImg,
  },
  {
    id: "thanx",
    title: "Благодарственное письмо",
    subtitle: "От ООО ТревелМед, г.Сочи, 2025",
    description: "Выражение благодарности за профессиональное отношение и качественное обслуживание.",
    details: "Откройте изображение в модальном окне, чтобы рассмотреть документ целиком.",
    previewSrc: thanxPrevImg,
    fullSrc: thanxFullImg,
  },
];

const CredentialsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<LegalDoc | null>(null);

  useEffect(() => {
    if (!selectedDoc) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedDoc(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedDoc]);

  return (
    <>
      <section className="mb-8">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted"
        >
          <h2 className="text-lg font-bold text-foreground">Дипломы и документы</h2>
          <span
            className="text-2xl font-light text-muted-foreground transition-transform duration-300"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            {isOpen ? "−" : "+"}
          </span>
        </button>

        <div
          className="overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out"
          style={{
            maxHeight: isOpen ? "1400px" : "0px",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div className="mt-3 grid grid-cols-2 gap-3">
            {docs.map((doc) => {
              const isExpanded = expandedId === doc.id;

              return (
                <article
                  key={doc.id}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-sm cursor-pointer transition-shadow duration-300 hover:shadow-md"
                  onClick={() => setExpandedId((prev) => (prev === doc.id ? null : doc.id))}
                >
                  <div className="p-0">
                    <button
                      type="button"
                      className="relative block aspect-square w-full bg-muted"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedDoc(doc);
                      }}
                      aria-label={`Открыть ${doc.title}`}
                    >
                      <img
                        src={doc.previewSrc}
                        alt={doc.title}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 768px) 50vw, 240px"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 rounded bg-background/85 px-2 py-1 text-[10px] font-medium text-foreground backdrop-blur-sm">
                        Открыть
                      </span>
                    </button>

                    <div className="p-3">
                      <p className="text-sm font-medium text-card-foreground whitespace-pre-line">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.subtitle}</p>
                    </div>

                    <div
                      className="overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out"
                      style={{ maxHeight: isExpanded ? "240px" : "0px", opacity: isExpanded ? 1 : 0 }}
                    >
                      <div className="px-3 pb-3">
                        <p className="text-xs leading-relaxed text-secondary-foreground">{doc.description}</p>
                        <hr className="my-2 border-border" />
                        <p className="text-xs leading-relaxed text-muted-foreground">{doc.details}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-background shadow-xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-doc-modal-title"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h3 id="legal-doc-modal-title" className="text-base font-semibold text-foreground">
                  {selectedDoc.title}
                </h3>
                <p className="text-xs text-muted-foreground">{selectedDoc.subtitle}</p>
              </div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setSelectedDoc(null)}
              >
                Закрыть
              </button>
            </div>

            <div className="max-h-[80vh] overflow-auto bg-muted">
              <img
                src={selectedDoc.fullSrc}
                alt={selectedDoc.title}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CredentialsSection;
