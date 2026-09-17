"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/widgets";
import { kycService, type KycStatus, type KycDocTypeInput } from "@/services/kyc.service";
import { useApi } from "@/hooks/use-api";
import {
  Loader2, AlertCircle, ShieldCheck, Clock, CheckCircle2, XCircle,
  Upload, FileText, Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api";

const DOC_TYPES: { value: KycDocTypeInput; key: "kyc_doc_business_license" | "kyc_doc_id_proof" | "kyc_doc_tax_certificate" | "kyc_doc_hotel_license" | "kyc_doc_property_ownership" | "kyc_doc_tour_guide_license" }[] = [
  { value: "business_license", key: "kyc_doc_business_license" },
  { value: "id_proof", key: "kyc_doc_id_proof" },
  { value: "tax_certificate", key: "kyc_doc_tax_certificate" },
  { value: "hotel_license", key: "kyc_doc_hotel_license" },
  { value: "property_ownership", key: "kyc_doc_property_ownership" },
  { value: "tour_guide_license", key: "kyc_doc_tour_guide_license" },
];

const STATUS_STYLES: Record<
  KycStatus["kycStatus"],
  { color: string; icon: typeof ShieldCheck; key: "kyc_status_not_submitted" | "kyc_status_pending" | "kyc_status_approved" | "kyc_status_rejected" }
> = {
  NotSubmitted: { color: "text-muted-foreground", icon: AlertCircle, key: "kyc_status_not_submitted" },
  Pending: { color: "text-yellow-600", icon: Clock, key: "kyc_status_pending" },
  Approved: { color: "text-emerald-600", icon: CheckCircle2, key: "kyc_status_approved" },
  Rejected: { color: "text-red-600", icon: XCircle, key: "kyc_status_rejected" },
};

export function HOKyc() {
  const lang = useAppStore((s) => s.lang);
  const { data, loading, error, refetch } = useApi<KycStatus>(() => kycService.status(), []);

  const [selectedType, setSelectedType] = useState<KycDocTypeInput>("business_license");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      toast.error(t("kyc_no_file", lang));
      return;
    }
    setUploading(true);
    try {
      await kycService.upload(selectedType, file);
      toast.success(lang === "ar" ? "تم رفع المستند" : "Document uploaded");
      if (fileRef.current) fileRef.current.value = "";
      refetch();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t("api_save_failed", lang);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await kycService.submit();
      toast.success(lang === "ar" ? "تم الإرسال للمراجعة" : "Submitted for review");
      refetch();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t("api_save_failed", lang);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const status = data?.kycStatus ?? "NotSubmitted";
  const StatusIcon = STATUS_STYLES[status].icon;

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("kyc_title", lang)}
        subtitle={lang === "ar" ? "ارفع المستندات لتوثيق حسابك" : "Upload documents to verify your account"}
      />

      {loading && (
        <Card>
          <CardContent className="p-8 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
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

      {data && !loading && (
        <>
          {/* Status card */}
          <Card>
            <CardContent className="p-5 flex items-start gap-4">
              <div className={`h-12 w-12 rounded-full bg-muted flex items-center justify-center ${STATUS_STYLES[status].color}`}>
                <StatusIcon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{t("nav_kyc", lang)}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-muted ${STATUS_STYLES[status].color}`}>
                    {t(STATUS_STYLES[status].key, lang)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {status === "NotSubmitted" && t("kyc_upload_docs", lang)}
                  {status === "Pending" && t("kyc_pending_msg", lang)}
                  {status === "Approved" && t("kyc_approved_msg", lang)}
                  {status === "Rejected" && t("kyc_rejected_msg", lang)}
                </p>
                {status === "Rejected" && data.kycRejectionReason && (
                  <div className="mt-2 rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
                    <span className="font-medium">{t("kyc_rejection_reason", lang)}: </span>
                    {data.kycRejectionReason}
                  </div>
                )}
                {data.kycSubmittedAt && status !== "NotSubmitted" && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {lang === "ar" ? "تاريخ الإرسال: " : "Submitted: "}
                    {new Date(data.kycSubmittedAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upload form — only when not_submitted or rejected */}
          {(status === "NotSubmitted" || status === "Rejected") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("kyc_upload_docs", lang)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="docType">{lang === "ar" ? "نوع المستند" : "Document type"}</Label>
                  <select
                    id="docType"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as KycDocTypeInput)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {DOC_TYPES.map((d) => (
                      <option key={d.value} value={d.value}>
                        {t(d.key, lang)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>{t("kyc_select_file", lang)}</Label>
                  <div className="flex gap-2">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*,application/pdf"
                      className="flex-1 text-sm file:me-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer file:hover:bg-primary/90"
                    />
                    <Button
                      type="button"
                      onClick={handleUpload}
                      disabled={uploading}
                      className="gap-1.5"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {t("kyc_upload", lang)}
                    </Button>
                  </div>
                </div>

                {/* Uploaded docs */}
                <div className="pt-3 border-t border-border">
                  <h4 className="text-sm font-semibold mb-2">{t("kyc_uploaded_docs", lang)}</h4>
                  {data.documents.length === 0 ? (
                    <p className="text-xs text-muted-foreground">{t("kyc_no_docs", lang)}</p>
                  ) : (
                    <div className="space-y-2">
                      {data.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-3 p-2 rounded-md border border-border bg-muted/30"
                        >
                          <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {DOC_TYPES.find((d) => d.value === mapPrismaTypeToInput(doc.type))
                                ? t(DOC_TYPES.find((d) => d.value === mapPrismaTypeToInput(doc.type))!.key, lang)
                                : doc.type}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(doc.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {data.documents.length > 0 && (
                  <div className="flex justify-end pt-3">
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                      {t("kyc_submit_for_review", lang)}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pending state — show docs read-only */}
          {(status === "Pending" || status === "Approved") && data.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("kyc_uploaded_docs", lang)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-2 rounded-md border border-border bg-muted/30"
                  >
                    <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {DOC_TYPES.find((d) => d.value === mapPrismaTypeToInput(doc.type))
                          ? t(DOC_TYPES.find((d) => d.value === mapPrismaTypeToInput(doc.type))!.key, lang)
                          : doc.type}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function mapPrismaTypeToInput(prismaType: string): KycDocTypeInput {
  switch (prismaType) {
    case "BusinessLicense": return "business_license";
    case "IdProof": return "id_proof";
    case "TaxCertificate": return "tax_certificate";
    case "HotelLicense": return "hotel_license";
    case "PropertyOwnership": return "property_ownership";
    case "TourGuideLicense": return "tour_guide_license";
    default: return "business_license";
  }
}
