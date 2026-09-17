"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating, PageHeader } from "@/components/widgets";
import { mockReviews } from "@/lib/mock-data";
import { Reply, Flag, Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function HOReviews() {
  const lang = useAppStore((s) => s.lang);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Record<string, string>>({});

  const hotelReviews = mockReviews.filter((r) => r.categories.cleanliness); // reviews with category breakdown
  const totalReviews = mockReviews.length;
  const avgRating = mockReviews.reduce((s, r) => s + r.rating, 0) / totalReviews;

  const categories = [
    { key: "cleanliness", label: t("cleanliness", lang) },
    { key: "comfort", label: t("comfort", lang) },
    { key: "location", label: t("location", lang) },
    { key: "facilities", label: t("facilities", lang) },
    { key: "staff", label: t("staff", lang) },
    { key: "value", label: t("value_for_money", lang) },
  ];

  const catAverages = categories.map((c) => {
    const validReviews = mockReviews.filter((r) => r.categories[c.key as keyof typeof r.categories]);
    const avg = validReviews.length > 0
      ? validReviews.reduce((s, r) => s + (r.categories[c.key as keyof typeof r.categories] as number), 0) / validReviews.length
      : 0;
    return { ...c, avg };
  });

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: mockReviews.filter(rv => Math.round(rv.rating) === r).length }));

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_reviews", lang)}
        subtitle={lang === "ar" ? "إدارة تقييمات الفندق والرد عليها" : "Manage and respond to hotel reviews"}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="border-border/70">
          <CardContent className="p-6 text-center">
            <p className="text-5xl font-bold text-primary">{avgRating.toFixed(1)}</p>
            <div className="flex justify-center mt-2">
              <StarRating rating={avgRating} size="lg" />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {totalReviews} {lang === "ar" ? "تقييم" : "reviews"}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{lang === "ar" ? "متوسط الفئات" : "Category Averages"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {catAverages.map((c) => (
              <div key={c.key} className="flex items-center gap-3">
                <span className="text-xs w-24 text-muted-foreground">{c.label}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.avg / 5) * 100}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full bg-gradient-to-r from-[oklch(0.55_0.12_175)] to-[oklch(0.55_0.13_30)]"
                  />
                </div>
                <span className="text-sm font-medium w-10 text-end">{c.avg.toFixed(1)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t("rating_breakdown", lang)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {ratingCounts.map(({ rating, count }) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" />
              </div>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / totalReviews) * 100}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full bg-gradient-to-r from-[oklch(0.55_0.12_175)] to-[oklch(0.55_0.13_30)]"
                />
              </div>
              <span className="text-sm text-muted-foreground w-8 text-end">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {mockReviews.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="border-border/70">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <img src={r.guestAvatar} alt="" className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{lang === "ar" ? r.guestNameAr : r.guestName}</p>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</span>
                      <div className="ms-auto flex items-center gap-1">
                        <StarRating rating={r.rating} />
                        <span className="text-xs font-medium">{r.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-primary mb-2">{lang === "ar" ? r.itemNameAr : r.itemName}</p>
                    <p className="text-sm leading-relaxed">{lang === "ar" ? r.commentAr : r.comment}</p>

                    {r.categories.cleanliness && (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3 p-2 rounded-md bg-muted/30">
                        {categories.map((c) => (
                          <div key={c.key} className="text-center">
                            <p className="text-[10px] text-muted-foreground">{c.label}</p>
                            <p className="text-sm font-semibold">{r.categories[c.key as keyof typeof r.categories]}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {r.replied && r.reply && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 border-s-2 border-primary/40">
                        <p className="text-xs font-medium mb-1 text-primary">{lang === "ar" ? "ردك" : "Your reply"}</p>
                        <p className="text-sm text-muted-foreground">{r.reply}</p>
                      </div>
                    )}

                    {replies[r.id] && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 border-s-2 border-primary/40">
                        <p className="text-xs font-medium mb-1 text-primary">{lang === "ar" ? "ردك" : "Your reply"}</p>
                        <p className="text-sm text-muted-foreground">{replies[r.id]}</p>
                      </div>
                    )}

                    {replyingTo === r.id && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          placeholder={lang === "ar" ? "اكتب ردك..." : "Write your reply..."}
                          dir={lang === "ar" ? "rtl" : "ltr"}
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => { setReplyingTo(null); setReplyText(""); }}>
                            {t("cancel", lang)}
                          </Button>
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => {
                              if (replyText.trim()) {
                                setReplies((p) => ({ ...p, [r.id]: replyText }));
                                setReplyingTo(null);
                                setReplyText("");
                              }
                            }}
                          >
                            {t("submit", lang)}
                          </Button>
                        </div>
                      </div>
                    )}

                    {replyingTo !== r.id && !r.replied && !replies[r.id] && (
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setReplyingTo(r.id)}>
                          <Reply className="h-3.5 w-3.5" />
                          {t("reply", lang)}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-destructive">
                          <Flag className="h-3.5 w-3.5" />
                          {t("flag_review", lang)}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
