import React, { useState, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Check,
    X,
    Image as ImageIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import Chart from "react-apexcharts";
import TodoModal from "@/components/TodoModal";
import { Input } from "@/components/ui/input";

export default function TodoPage() {
    const { todos, statistics, filters, flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editTodo, setEditTodo] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "");

    // Chart configuration
    const chartOptions = {
        chart: {
            type: "donut",
        },
        labels: ["Selesai", "Belum Selesai"],
        colors: ["#10b981", "#f59e0b"],
        legend: {
            position: "bottom",
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };

    const chartSeries = [statistics.completed, statistics.pending];

    // Show success/error messages
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: flash.success,
                timer: 3000,
                showConfirmButton: false,
            });
        }
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/todos",
            { search: searchTerm, status: statusFilter },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (status) => {
        setStatusFilter(status);
        router.get(
            "/todos",
            { search: searchTerm, status: status },
            { preserveState: true, replace: true }
        );
    };

    const handleEdit = (todo) => {
        setEditTodo(todo);
        setShowModal(true);
    };

    const handleDelete = (todo) => {
        Swal.fire({
            title: "Hapus Todo?",
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/todos/${todo.id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            icon: "success",
                            title: "Terhapus!",
                            text: "Todo berhasil dihapus.",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    };

    const handleToggleStatus = (todo) => {
        router.post(`/todos/${todo.id}/toggle`, {}, {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: `Todo ditandai sebagai ${!todo.is_finished ? "selesai" : "belum selesai"}.`,
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
        });
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">Daftar Todo</h1>
                            <p className="text-muted-foreground mt-1">
                                Kelola aktivitas Anda
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                setEditTodo(null);
                                setShowModal(true);
                            }}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Todo
                        </Button>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistik Todo</CardTitle>
                                <CardDescription>
                                    Ringkasan aktivitas Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">
                                            {statistics.total}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Total
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">
                                            {statistics.completed}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Selesai
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-amber-600">
                                            {statistics.pending}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Pending
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Grafik Status</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                {statistics.total > 0 ? (
                                    <Chart
                                        options={chartOptions}
                                        series={chartSeries}
                                        type="donut"
                                        width="100%"
                                        height="250"
                                    />
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">
                                        Belum ada data untuk ditampilkan
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Filter */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                            <Input
                                                type="text"
                                                placeholder="Cari todo..."
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(e.target.value)
                                                }
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" variant="outline">
                                        <Search className="w-4 h-4 mr-2" />
                                        Cari
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        variant={
                                            statusFilter === ""
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() => handleFilterChange("")}
                                    >
                                        Semua
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={
                                            statusFilter === "pending"
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            handleFilterChange("pending")
                                        }
                                    >
                                        Belum Selesai
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={
                                            statusFilter === "completed"
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            handleFilterChange("completed")
                                        }
                                    >
                                        Selesai
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Todo List */}
                    <div className="space-y-4">
                        {todos.data.length > 0 ? (
                            todos.data.map((todo) => (
                                <Card key={todo.id}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {/* Cover Image */}
                                            {todo.cover && (
                                                <div className="w-full md:w-48 h-32 flex-shrink-0">
                                                    <img
                                                        src={`/storage/${todo.cover}`}
                                                        alt={todo.title}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3
                                                                className={`text-lg font-semibold ${
                                                                    todo.is_finished
                                                                        ? "line-through text-muted-foreground"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {todo.title}
                                                            </h3>
                                                            <span
                                                                className={`px-2 py-1 text-xs rounded-full ${
                                                                    todo.is_finished
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-amber-100 text-amber-800"
                                                                }`}
                                                            >
                                                                {todo.is_finished
                                                                    ? "Selesai"
                                                                    : "Pending"}
                                                            </span>
                                                        </div>
                                                        {todo.description && (
                                                            <p className="text-muted-foreground text-sm mb-2">
                                                                {todo.description}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            Dibuat:{" "}
                                                            {new Date(
                                                                todo.created_at
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                                {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon-sm"
                                                            onClick={() =>
                                                                handleToggleStatus(
                                                                    todo
                                                                )
                                                            }
                                                            title={
                                                                todo.is_finished
                                                                    ? "Tandai belum selesai"
                                                                    : "Tandai selesai"
                                                            }
                                                        >
                                                            {todo.is_finished ? (
                                                                <X className="w-4 h-4" />
                                                            ) : (
                                                                <Check className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon-sm"
                                                            onClick={() =>
                                                                handleEdit(todo)
                                                            }
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon-sm"
                                                            onClick={() =>
                                                                handleDelete(todo)
                                                            }
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">
                                        Belum ada todo. Klik tombol "Tambah Todo"
                                        untuk membuat todo baru.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Pagination */}
                    {todos.last_page > 1 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="flex gap-2">
                                {todos.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={`px-4 py-2 border rounded-md ${
                                            link.active
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-background hover:bg-accent"
                                        } ${
                                            !link.url
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                        preserveState
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <TodoModal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditTodo(null);
                }}
                todo={editTodo}
            />
        </AppLayout>
    );
}