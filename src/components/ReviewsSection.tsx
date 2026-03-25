import { useState } from "react";

const reviews = [
  { author: "Анна М.", text: "Прекрасная экскурсия! Узнали много нового о Казани. Рекомендуем!" },
  { author: "Дмитрий К.", text: "Отличный гид, интересный маршрут. Дети были в восторге." },
  { author: "Елена С.", text: "Очень вкусная татарская кухня и замечательная атмосфера. Спасибо!" },
];

const ReviewsSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-8">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl bg-card border border-border px-4 py-3 text-left transition-colors hover:bg-muted"
      >
        <h2 className="text-lg font-bold text-foreground">Наши отзывы</h2>
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
          maxHeight: isOpen ? "600px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="mt-3 flex flex-col gap-3">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-card-foreground mb-1">
                {review.author}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
