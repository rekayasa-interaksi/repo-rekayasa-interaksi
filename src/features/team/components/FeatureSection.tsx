import { Button } from "@/components/ui/button";
import { useFeatures } from "../queries";
import type { Feature } from "../types";

interface FeatureSectionProps {
  versionId: string;
  onEdit: (feature: Feature) => void;
  onDelete: (feature: Feature) => void;
}

export function FeatureSection({ versionId, onEdit, onDelete }: FeatureSectionProps) {
  const { data: features, isLoading } = useFeatures(versionId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground ml-4">Memuat fitur...</p>;
  }

  if (!features || features.length === 0) {
    return (
      <p className="text-sm text-muted-foreground ml-4">
        Tidak ada fitur untuk versi ini
      </p>
    );
  }

  return (
    <div className="mt-3 ml-4 space-y-3 border-l-2 border-muted pl-4">
      {features.map((f) => (
        <div
          key={f.id}
          className="group rounded-lg border bg-muted/30 p-3 hover:bg-muted/40 transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              
              <h4 className="font-medium text-sm mb-1">{f.name}</h4>

              {f.content && (
                <div
                  className="text-xs text-muted-foreground leading-relaxed max-w-full
                             overflow-hidden line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: f.content }}
                />
              )}
            </div>

            <div className="flex items-center gap-1 ml-3">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 opacity-70 group-hover:opacity-100"
                onClick={() => onEdit(f)}
              >
                ✏️
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-red-500 opacity-70 group-hover:opacity-100"
                onClick={() => onDelete(f)}
              >
                🗑️
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}