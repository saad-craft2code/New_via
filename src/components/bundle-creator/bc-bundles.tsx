"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PageHeader, EmptyState, formatCurrency,
} from "@/components/widgets";
import { bundleService } from "@/services/bundle.service";
import { useApi } from "@/hooks/use-api";
import {
  Plus, Search, MapPin, Trash2, AlertCircle, Package, Calendar,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api";
import type { Bundle } from "@via/shared-types";

export function BCBundles() {
  const lang = useAppStore((s) => s.lang);
  const setView = useAppStore((s) => s.setBcView);
  const [search, setSearch] = useState("");

  const { data, loading, error, refetch } = useApi<Bundle[]>(
    () => bundleService.list(),
    [],
  );

  const filtered = (data ?? []).filter(
    (b) =>
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.destinations.some((d) => d.toLowerCase().includes(search.toLowerCase())),
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(lang === "ar" ? `حذف "${title}"؟` : `Delete "${title}"?`)) return;
    try {
      await bundleService.remove(id);
      toast.success(lang === "ar" ? "تم حذف الباقة" : "Bundle deleted");
      refetch();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t("api_delete_failed", lang);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_bundles", lang)}
        subtitle={lang === "ar" ? "أدر باقاتك السياحية" : "Manage your travel bundles"}
        actions={
          <Button
            onClick={() => setView("bundle_wizard")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("create_new_bundle", lang)}
          </Button>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("search", lang)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ps-9"
        />
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && !loading && (
        <Card>
          <CardContent className="p-8 flex flex-col items-center text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-3" />
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm">
              {t("retry", lang)}
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && filtered.length === 0 && (
        <Card>
          <CardContent className="p-2">
            <EmptyState
              icon={Package}
              title={search ? (lang === "ar" ? "لا نتائج" : "No results") : t("no_bundles_yet", lang)}
              desc={search ? undefined : t("no_bundles_desc", lang)}
            />
            {!search && (
              <div className="flex justify-center pb-6">
                <Button
                  onClick={() => setView("bundle_wizard")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t("create_first_bundle", lang)}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="overflow-hidden border-border/70 hover:shadow-md transition-shadow group card-hover">
                <div className="relative h-40 overflow-hidden bg-muted">
                  {b.images?.[0] ? (
                    <img
                      src={b.images[0]}
                      alt={b.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                      <Package className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-base line-clamp-1">{b.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {b.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {b.destinations.slice(0, 3).map((d) => (
                      <span key={d} className="px-2 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground flex items-center gap-0.5">
                        <MapPin className="h-2.5 w-2.5" />
                        {d}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <Calendar className="h-3 w-3" />
                        {lang === "ar" ? "أيام" : "Days"}
                      </p>
                      <p className="text-sm font-semibold">{b.durationDays}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("starting_price", lang)}
                      </p>
                      <p className="text-sm font-semibold">{formatCurrency(Number(b.price), lang)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1">
                      {t("view", lang)}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(b.id, b.title)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
