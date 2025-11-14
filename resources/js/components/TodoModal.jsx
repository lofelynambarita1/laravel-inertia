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
import { X, Upload, Image as ImageIcon } from "lucide-react";

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
                // Handle image URL properly
                const imageUrl = todo.cover.startsWith('/storage') 
                    ? todo.cover 
                    : `/storage/${todo.cover}`;
                setCoverPreview(imageUrl);
            } else {
                setCoverPreview(null);
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
            onError: (errors) => {
                console.error("Upload error:", errors);
            },
        });
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran file maksimal 2MB");
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert("Format file harus JPEG, PNG, JPG, atau GIF");
                return;
            }

            setData("cover", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeCover = () => {
        setData("cover", null);
        setCoverPreview(null);
        // Reset file input
        const fileInput = document.getElementById("cover");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeInUp">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-200">
                <div className="sticky top-0 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        {todo ? "✏️ Edit Todo" : "➕ Tambah Todo"}
                    </h2>
                    <Button 
                        variant="ghost" 
                        size="icon-sm" 
                        onClick={onClose}
                        className="hover:bg-pink-100 rounded-full"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title" className="text-gray-700 font-semibold">
                                📝 Judul *
                            </FieldLabel>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Masukkan judul todo"
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                                required
                                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.title}
                                </p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description" className="text-gray-700 font-semibold">
                                📄 Deskripsi
                            </FieldLabel>
                            <textarea
                                id="description"
                                placeholder="Masukkan deskripsi (opsional)"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                rows="4"
                                className="w-full rounded-xl border border-pink-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:border-pink-400"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="cover" className="text-gray-700 font-semibold">
                                🖼️ Cover Image
                            </FieldLabel>
                            <div className="space-y-4">
                                {coverPreview && (
                                    <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-pink-200 shadow-lg">
                                        <img
                                            src={coverPreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error("Image load error:", e);
                                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23fce7f3' width='400' height='300'/%3E%3Ctext fill='%23ec4899' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EGambar tidak dapat dimuat%3C/text%3E%3C/svg%3E";
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={removeCover}
                                            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                <div>
                                    <Input
                                        id="cover"
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/gif"
                                        onChange={handleCoverChange}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById("cover").click()}
                                        className="w-full border-2 border-dashed border-pink-300 hover:bg-pink-50 hover:border-pink-400 text-pink-600 py-6 rounded-xl transition-all"
                                    >
                                        {coverPreview ? (
                                            <>
                                                <Upload className="w-5 h-5 mr-2" />
                                                Ubah Cover
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-5 h-5 mr-2" />
                                                Upload Cover
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {errors.cover && (
                                    <p className="text-sm text-red-600">
                                        {errors.cover}
                                    </p>
                                )}

                                <FieldDescription className="text-gray-600">
                                    ℹ️ Format: JPEG, PNG, JPG, GIF. Maksimal 2MB
                                </FieldDescription>
                            </div>
                        </Field>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 py-6 rounded-xl"
                                disabled={processing}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6 rounded-xl shadow-lg btn-pink-glow transform hover:scale-[1.02] transition-all"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </span>
                                ) : (
                                    todo ? "💾 Perbarui" : "✨ Simpan"
                                )}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </div>
        </div>
    );
}