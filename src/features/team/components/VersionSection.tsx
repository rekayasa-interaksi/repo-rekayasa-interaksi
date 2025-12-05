import { useVersions } from "../queries";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Loader2, Edit, Trash2, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Feature, Version } from "../types";
import { FeatureSection } from "./FeatureSection";

interface VersionSectionProps {
  generationFilter: string | null;
  onEdit: (version: Version) => void;
  onDelete: (version: Version) => void;
  onEditFeature: (feature: Feature) => void;
  onDeleteFeature: (feature: Feature) => void;
}

export function VersionSection({ generationFilter, onEdit, onDelete, onEditFeature, onDeleteFeature }: VersionSectionProps) {
    const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { data, isLoading } = useVersions({ generation: generationFilter });

    return (
        <div className="border rounded-md p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Versi Sistem</h2>

        {isLoading ? (
            <div className="flex items-center gap-2 p-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Memuat versi sistem...</span>
            </div>
        ) : !data || data.length === 0 ? (
            <p className="text-muted-foreground text-sm">Belum ada versi untuk angkatan ini.</p>
        ) : (
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                    <TableHead>Version</TableHead>
                    <TableHead>Generation</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="text-center">Tindakan</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {data.map((v) => (
                    <>
                    {/* ROW UTAMA VERSION */}
                    <TableRow key={v.id} className="bg-muted/20 hover:bg-muted/30 transition">
                        <TableCell className="font-semibold">{v.version}</TableCell>
                        <TableCell>{v.generation}</TableCell>
                        <TableCell>{new Date(v.created_at).toLocaleDateString()}</TableCell>

                        <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => onEdit(v)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                            </Button>

                            <Button size="sm" variant="outline" onClick={() => onDelete(v)}>
                            <Trash2 className="w-4 h-4 text-destructive mr-1" />
                            Hapus
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>

                    {/* ROW NESTED FEATURE SECTION */}
                    <TableRow className="bg-muted/10">
                        <TableCell colSpan={4} className="p-0">
                        <div className="p-4 pl-8 border-l-2 border-muted-foreground/20">
                            <FeatureSection
                            versionId={v.id}
                            onEdit={onEditFeature}
                            onDelete={onDeleteFeature}
                            />
                        </div>
                        </TableCell>
                    </TableRow>
                    </>
                ))}
                </TableBody>
            </Table>
        )}
        </div>
    );
}