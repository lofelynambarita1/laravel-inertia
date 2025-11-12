import React from "react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { usePage, Link } from "@inertiajs/react";
import { ListTodo, Target, TrendingUp } from "lucide-react";

export default function HomePage() {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: "&#128075;",
                                }}
                            />{" "}
                            Hai! {auth.name}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-6">
                            Apa yang ingin kamu lakukan hari ini?
                        </p>
                        <Link href="/todos">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <ListTodo className="w-4 h-4 mr-2" />
                                Kelola Todo
                            </Button>
                        </Link>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 border rounded-lg bg-card text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ListTodo className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold mb-2">
                                Kelola Aktivitas
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Atur semua aktivitas Anda dengan mudah
                            </p>
                        </div>
                        <div className="p-6 border rounded-lg bg-card text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold mb-2">
                                Capai Target
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Lacak progress dan selesaikan tugas
                            </p>
                        </div>
                        <div className="p-6 border rounded-lg bg-card text-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="font-semibold mb-2">
                                Tingkatkan Produktivitas
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Analisis aktivitas dengan statistik
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}