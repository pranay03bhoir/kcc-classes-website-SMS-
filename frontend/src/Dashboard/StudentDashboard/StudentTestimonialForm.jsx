"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getMyTestimonial, saveTestimonial } from "@/api/studentTestimonial";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StudentTestimonialForm = () => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyTestimonial();
        if (cancelled) return;
        if (res?.testimonial) {
          setRating(res.testimonial.rating ?? 5);
          setText(res.testimonial.text ?? "");
        }
      } catch {
        /* not logged in or network — parent layout usually guards */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim().length < 20) {
      toast.error("Please write at least 20 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await saveTestimonial({ rating, text: text.trim() });
      toast.success(res?.message || "Testimonial saved.");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Could not save your testimonial. Try again.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 xl:max-w-4xl">
      <Card className="w-full border border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="space-y-1 px-4 pt-5 pb-2 sm:px-6 sm:pt-6">
          <CardTitle className="text-base sm:text-lg leading-snug">
            Share your experience
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your testimonial may appear on our website to help new students. You
            can update it anytime.
          </p>
        </CardHeader>
        <CardContent className="px-4 pb-5 sm:px-6 sm:pb-6">
          {loading ? (
            <p className="text-sm text-gray-500 py-2">Loading…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <Label className="mb-2 block text-sm">Rating</Label>
                <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="p-1.5 sm:p-2 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      aria-label={`${n} stars`}
                    >
                      <Star
                        className={cn(
                          "w-7 h-7 sm:w-8 sm:h-8",
                          n <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-300",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="min-w-0">
                <Label htmlFor="testimonial-text" className="text-sm">
                  Your testimonial
                </Label>
                <Textarea
                  id="testimonial-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tell others what you like about your classes, teachers, or how you’ve improved (at least 20 characters)."
                  className="mt-2 min-h-[120px] sm:min-h-[140px] resize-y w-full max-w-full text-base"
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground mt-1.5 break-words">
                  {text.trim().length}/2000 · minimum 20 characters
                </p>
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto min-h-[44px] bg-red-600 hover:bg-red-700 text-white"
              >
                {saving ? "Saving…" : "Save testimonial"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentTestimonialForm;
