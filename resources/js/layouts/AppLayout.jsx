import React from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ListTodo, Home } from "lucide-react";

export default function AppLayout({ children }) {
    const onLogout = () => {
        router.get("/auth/logout");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b bg-card">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="text-lg font-bold">
                                DelTodos
                            </Link>
                            <div className="hidden md:flex items-center space-x-1">
                                <Link href="/">
                                    <Button variant="ghost" size="sm">
                                        <Home className="w-4 h-4 mr-2" />
                                        Home
                                    </Button>
                                </Link>
                                <Link href="/todos">
                                    <Button variant="ghost" size="sm">
                                        <ListTodo className="w-4 h-4 mr-2" />
                                        Todos
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={onLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t bg-card py-6">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    &copy; 2025 Delcom Labs. All rights reserved.
                </div>
            </footer>
        </div>
    );
}