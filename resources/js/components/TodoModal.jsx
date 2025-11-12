import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field";
import { X, Upload } from "lucide-react";

export default function TodoModal({ show, onClose, todo }) {
    const [coverPreview, setCoverPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        cover: null,
        _method: todo ? "PUT" : "POST",
    });

    useEffect(() => {
        if (todo) {
            setData({
                title: todo.title,
                description: todo.description || "",
                cover: null,
                _method: "PUT",
            });
            if (todo.cover) {
                setCoverPreview(`/storage/${todo.cover}`);
            }
        } else {
            reset();
            setCoverPreview(null);
        }
    }, [todo, show]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = todo ? `/todos/${todo.id}` : "/todos";

        post(url, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setCoverPreview(null);
                onClose();
            },
        });
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("cover", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-background border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        {todo ? "Edit Todo" : "Tambah Todo"}
                    </h2>
                    <Button variant="ghost" size="icon-sm" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">Judul *</FieldLabel>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Masukkan judul todo"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">
                                Deskripsi
                            </FieldLabel>
                            <textarea
                                id="description"
                                placeholder="Masukkan deskripsi (opsional)"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows="4"
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="cover">Cover</FieldLabel>
                            <div className="space-y-4">
                                {coverPreview && (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                        <img
                                            src={coverPreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData("cover", null);
                                                setCoverPreview(null);
                                            }}
                                            className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full hover:bg-destructive/90"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div>
                                    <Input
                                        id="cover"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverChange}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            document
                                                .getElementById("cover")
                                                .click()
                                        }
                                        className="w-full"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {coverPreview
                                            ? "Ubah Cover"
                                            : "Upload Cover"}
                                    </Button>
                                </div>

                                {errors.cover && (
                                    <p className="text-sm text-destructive">
                                        {errors.cover}
                                    </p>
                                )}

                                <FieldDescription>
                                    Format: JPEG, PNG, JPG, GIF. Maksimal 2MB
                                </FieldDescription>
                            </div>
                        </Field>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={processing}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={processing}
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : todo
                                    ? "Perbarui"
                                    : "Simpan"}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </div>
        </div>
    );
}