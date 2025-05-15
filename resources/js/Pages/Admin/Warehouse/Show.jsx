import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Building2, ArrowLeft, UserPlus, X, Shield, Users, Key, Plus } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Show({ auth, warehouse, roles, permissions }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("details");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        role: "",
        permissions: [],
    });

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // Initialize data from props
    useEffect(() => {
        if (!warehouse) {
            console.error("Warehouse data is missing");
        } else {
            console.log("Warehouse data:", warehouse);
            if (!warehouse.users) {
                console.error("Warehouse users are missing");
            } else {
                console.log("Warehouse users:", warehouse.users);
            }
        }
        if (!roles) {
            console.error("Roles data is missing");
        }
        if (!permissions) {
            console.error("Permissions data is missing");
        }
    }, [warehouse, roles, permissions]);

    const openAddUserDialog = () => {
        reset();
        setSelectedUser(null);
        setDialogOpen(true);
    };

    const openEditUserDialog = (user) => {
        if (!user) return;

        setData({
            name: user.name || "",
            email: user.email || "",
            password: "",
            role: user.roles && user.roles[0]?.name || "",
            permissions: user.roles && user.roles[0]?.permissions?.map(p => p.name) || [],
        });
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedUser) {
            // Edit user
            put(route("admin.warehouses.users.update", [warehouse.id, selectedUser.id]), {
                onSuccess: () => {
                    setDialogOpen(false);
                    reset();
                }
            });
        } else {
            // Add new user
            post(route("admin.warehouses.users.add", warehouse.id), {
                onSuccess: () => {
                    setDialogOpen(false);
                    reset();
                }
            });
        }
    };

    const togglePermission = (permission) => {
        const currentPermissions = [...data.permissions];
        if (currentPermissions.includes(permission)) {
            setData("permissions", currentPermissions.filter(p => p !== permission));
        } else {
            setData("permissions", [...currentPermissions, permission]);
        }
    };

    return (
        <>
            <Head title={t("Warehouse Details")}>
                <style>{`
                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.warehouses" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                                    {t("Admin Panel")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Building2 className="h-6 w-6 text-indigo-500" />
                                    {warehouse?.name || t("Warehouse Details")}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link href={route("admin.warehouses.index")}>
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    {t("Back to List")}
                                </Button>
                            </Link>
                            {warehouse && (
                                <Link href={route("admin.warehouses.edit", warehouse.id)}>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                        {t("Edit Warehouse")}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1">
                                    <TabsTrigger value="details" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
                                        {t("Details")}
                                    </TabsTrigger>
                                    <TabsTrigger value="users" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
                                        {t("Users")}
                                    </TabsTrigger>
                                    <TabsTrigger value="permissions" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
                                        {t("Permissions")}
                                    </TabsTrigger>
                                </TabsList>

                                {/* Details Tab */}
                                <TabsContent value="details" className="space-y-6">
                                    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <CardTitle className="text-slate-800 dark:text-slate-200">
                                                {t("Warehouse Information")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t("Name")}</h3>
                                                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{warehouse?.name || "-"}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t("Code")}</h3>
                                                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{warehouse?.code || "-"}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t("Status")}</h3>
                                                    <Badge className={warehouse?.is_active ? "bg-green-500" : "bg-red-500"}>
                                                        {warehouse?.is_active ? t("Active") : t("Inactive")}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t("Created At")}</h3>
                                                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                                        {warehouse?.created_at ? new Date(warehouse.created_at).toLocaleDateString() : "-"}
                                                    </p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t("Description")}</h3>
                                                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                                        {warehouse?.description || t("No description provided")}
                                                    </p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t("Address")}</h3>
                                                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                                        {warehouse?.address || t("No address provided")}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Users Tab */}
                                <TabsContent value="users" className="space-y-6">
                                    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                    <Users className="h-5 w-5 text-indigo-500" />
                                                    {t("Warehouse Users")}
                                                </CardTitle>
                                                <Button
                                                    onClick={openAddUserDialog}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                                                >
                                                    <UserPlus className="h-4 w-4" />
                                                    {t("Add User")}
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>{t("Name")}</TableHead>
                                                        <TableHead>{t("Email")}</TableHead>
                                                        <TableHead>{t("Role")}</TableHead>
                                                        <TableHead className="text-right">{t("Actions")}</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {warehouse && warehouse.users && warehouse.users.length > 0 ? (
                                                        warehouse.users.map((user) => (
                                                            <TableRow key={user.id}>
                                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                                <TableCell>{user.email}</TableCell>
                                                                <TableCell>
                                                                    {user.roles && user.roles.map(role => (
                                                                        <Badge key={role.id} className="bg-indigo-500 mr-1">
                                                                            {role.name}
                                                                        </Badge>
                                                                    ))}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openEditUserDialog(user)}
                                                                    >
                                                                        {t("Edit")}
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="text-center py-6 text-slate-500 dark:text-slate-400">
                                                                {t("No users found for this warehouse")}
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Permissions Tab */}
                                <TabsContent value="permissions" className="space-y-6">
                                    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                <Shield className="h-5 w-5 text-indigo-500" />
                                                {t("Roles & Permissions")}
                                            </CardTitle>
                                            <CardDescription>
                                                {t("Manage roles and permissions for warehouse users")}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-6">
                                                {roles && roles.map((role) => (
                                                    <div key={role.id} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                                                <Key className="h-4 w-4 text-indigo-500" />
                                                                {role.name}
                                                            </h3>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                            {role.permissions && role.permissions.map((permission) => (
                                                                <Badge key={permission.id} className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                                                                    {permission.name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </main>
                </div>
            </div>

            {/* User Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUser ? t("Edit User") : t("Add New User")}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedUser
                                ? t("Update user details and permissions")
                                : t("Add a new user to this warehouse")}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                {t("Name")} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                {t("Email")} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {t("Password")} {!selectedUser && <span className="text-red-500">*</span>}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                placeholder={selectedUser ? t("Leave blank to keep current password") : ""}
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <Label htmlFor="role">
                                {t("Role")} <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.role}
                                onValueChange={(value) => setData("role", value)}
                            >
                                <SelectTrigger id="role" className={errors.role ? "border-red-500" : ""}>
                                    <SelectValue placeholder={t("Select a role")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles && roles.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <p className="text-sm text-red-500">{errors.role}</p>
                            )}
                        </div>

                        {/* Custom Permissions */}
                        <div className="space-y-2">
                            <Label>{t("Additional Permissions")}</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {permissions && permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`permission-${permission.id}`}
                                            checked={data.permissions.includes(permission.name)}
                                            onChange={() => togglePermission(permission.name)}
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <Label htmlFor={`permission-${permission.id}`} className="text-sm">
                                            {permission.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                {t("Cancel")}
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {processing
                                    ? selectedUser
                                        ? t("Updating...")
                                        : t("Adding...")
                                    : selectedUser
                                        ? t("Update User")
                                        : t("Add User")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
