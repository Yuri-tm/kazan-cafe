import { useState } from "react";
import { useReviews, useSubmitReview, useReactToReview } from "@/hooks/useReviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

const REACTED_KEY = "review_reactions";

function getReacted(): Record<string, "like" | "dislike"> {
  try {
    return JSON.parse(localStorage.getItem(REACTED_KEY) || "{}");
  } catch {
    return {};
  }
}

function setReacted(id: string, type: "like" | "dislike") {
  const r = getReacted();
  r[id] = type;
  localStorage.setItem(REACTED_KEY, JSON.stringify(r));
}

const ReviewsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: reviews } = useReviews();
  const submitMutation = useSubmitReview();
  const reactMutation = useReactToReview();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [reacted, setReactedState] = useState(getReacted);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!trimmedName || !trimmedText) {
      toast.error("Заполните имя и сообщение");
      return;
    }
    if (trimmedText.length > 200) {
      toast.error("Сообщение не более 200 символов");
      return;
    }
    try {
      await submitMutation.mutateAsync({ author: trimmedName, text: trimmedText });
      setName("");
      setText("");
      toast.success("Спасибо за Ваш отзыв!");
    } catch {
      toast.error("Ошибка отправки");
    }
  };

  const handleReact = async (id: string, field: "likes" | "dislikes") => {
    if (reacted[id]) return;
    try {
      await reactMutation.mutateAsync({ id, field });
      const type = field === "likes" ? "like" : "dislike";
      setReacted(id, type);
      setReactedState(getReacted());
    } catch {
      toast.error("Ошибка");
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
  };

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
          maxHeight: isOpen ? "5000px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="mt-3 flex flex-col gap-3">
          {/* Review submission form */}
          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <p className="text-sm font-semibold text-card-foreground">Оставить отзыв</p>
            <Input
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            <Textarea
              placeholder="Ваш отзыв (до 200 символов)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={200}
              rows={3}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{text.length}/200</span>
              <Button type="submit" size="sm" disabled={submitMutation.isPending}>
                Отправить
              </Button>
            </div>
          </form>

          {/* Reviews list */}
          {reviews?.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-card-foreground">
                  {review.author}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {formatDate(review.created_at)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                {review.text}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleReact(review.id, "likes")}
                  disabled={!!reacted[review.id]}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    reacted[review.id] === "like"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  } disabled:cursor-default`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{review.likes}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReact(review.id, "dislikes")}
                  disabled={!!reacted[review.id]}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    reacted[review.id] === "dislike"
                      ? "text-destructive"
                      : "text-muted-foreground hover:text-destructive"
                  } disabled:cursor-default`}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                  <span>{review.dislikes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
