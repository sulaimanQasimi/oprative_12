import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Download,
    Calendar,
    DollarSign,
    TrendingUp,
    TrendingDown,
    FileText,
    RefreshCw,
    Printer,
    Eye,
    EyeOff,
    Filter,
    Search,
    BarChart3,
    PieChart,
    Activity,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Info,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    QrCode,
    Copy,
    Share2
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Separator } from '@/Components/ui/separator';
import { Progress } from '@/Components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';

export default function AccountStatement({ auth, account, statementData }) {
    const { t } = useLaravelReactI18n();
    const [isLoading, setIsLoading] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [dateRange, setDateRange] = useState({
        start_date: statementData?.dateRange?.start || '',
        end_date: statementData?.dateRange?.end || ''
    });

    const { post, processing } = useForm();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fa-AF', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fa-AF', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Handle PDF download
    const handleDownloadPDF = () => {
        setIsLoading(true);
        post(route('customer.reports.account-statement.pdf', account.id), {
            data: dateRange,
            onSuccess: () => setIsLoading(false),
            onError: () => setIsLoading(false)
        });
    };

    // Handle print
    const handlePrint = () => {
        setIsPrinting(true);
        window.print();
        setTimeout(() => setIsPrinting(false), 1000);
    };

    // Copy account link
    const copyAccountLink = async () => {
        const link = route('customer.accounts.show', account.id);
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    // Calculate summary stats
    const summaryStats = {
        totalIncome: statementData?.summary?.totalIncome || 0,
        totalOutcome: statementData?.summary?.totalOutcome || 0,
        netChange: statementData?.summary?.netChange || 0,
        openingBalance: statementData?.summary?.openingBalance || 0,
        closingBalance: statementData?.summary?.closingBalance || 0,
        transactionCount: (statementData?.transactions?.incomes?.length || 0) + 
                         (statementData?.transactions?.outcomes?.length || 0)
    };

    // Get status badge component
    const getStatusBadge = (status) => {
        const statusConfig = {
            approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
            rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {t(status)}
            </Badge>
        );
    };

    return (
        <CustomerLayout auth={auth}>
            <Head title={`${t('Account Statement')} - ${account.name}`} />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-6 space-y-6"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('customer.accounts.index')}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('Account Statement')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {account.name} • {account.account_number}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setShowQRCode(!showQRCode)}
                                    >
                                        <QrCode className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Show QR Code')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={copyAccountLink}
                                        className={copied ? 'bg-green-50 border-green-200' : ''}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{copied ? t('Copied!') : t('Copy Link')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            disabled={isPrinting}
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            {isPrinting ? t('Printing...') : t('Print')}
                        </Button>

                        <Button
                            onClick={handleDownloadPDF}
                            disabled={processing || isLoading}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {isLoading ? t('Generating...') : t('Download PDF')}
                        </Button>
                    </div>
                </motion.div>

                {/* QR Code Modal */}
                {showQRCode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setShowQRCode(false)}
                    >
                        <div className="bg-white p-6 rounded-lg" onClick={e => e.stopPropagation()}>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold mb-4">{t('Account QR Code')}</h3>
                                <div className="bg-gray-100 p-4 rounded-lg inline-block">
                                    {/* QR Code would be generated here */}
                                    <div className="w-32 h-32 bg-gray-300 rounded flex items-center justify-center">
                                        <QrCode className="h-16 w-16 text-gray-500" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {t('Scan to view account online')}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Summary Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                {t('Total Income')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-800">
                                {formatCurrency(summaryStats.totalIncome)}
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                                {statementData?.transactions?.incomes?.length || 0} {t('transactions')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                                <TrendingDown className="h-4 w-4" />
                                {t('Total Outcome')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-800">
                                {formatCurrency(summaryStats.totalOutcome)}
                            </div>
                            <p className="text-xs text-red-600 mt-1">
                                {statementData?.transactions?.outcomes?.length || 0} {t('transactions')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                {t('Net Change')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${summaryStats.netChange >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
                                {formatCurrency(summaryStats.netChange)}
                            </div>
                            <p className="text-xs text-blue-600 mt-1">
                                {t('Opening Balance')}: {formatCurrency(summaryStats.openingBalance)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                {t('Closing Balance')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-800">
                                {formatCurrency(summaryStats.closingBalance)}
                            </div>
                            <p className="text-xs text-purple-600 mt-1">
                                {summaryStats.transactionCount} {t('total transactions')}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Date Range Filter */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                {t('Filter by Date Range')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="start_date">{t('Start Date')}</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={dateRange.start_date}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="end_date">{t('End Date')}</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={dateRange.end_date}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value }))}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        onClick={() => window.location.reload()}
                                        className="w-full"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        {t('Refresh')}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Transactions Tabs */}
                <motion.div variants={itemVariants}>
                    <Tabs defaultValue="incomes" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="incomes" className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                {t('Income Transactions')}
                            </TabsTrigger>
                            <TabsTrigger value="outcomes" className="flex items-center gap-2">
                                <TrendingDown className="h-4 w-4" />
                                {t('Outcome Transactions')}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="incomes" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                        {t('Income Transactions')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('All incoming transactions for this account')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('Date')}</TableHead>
                                                <TableHead>{t('Source')}</TableHead>
                                                <TableHead>{t('Amount')}</TableHead>
                                                <TableHead>{t('Status')}</TableHead>
                                                <TableHead>{t('Description')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {statementData?.transactions?.incomes?.map((income, index) => (
                                                <TableRow key={income.id || index}>
                                                    <TableCell>{formatDate(income.date)}</TableCell>
                                                    <TableCell>{income.source}</TableCell>
                                                    <TableCell className="font-mono text-green-600">
                                                        +{formatCurrency(income.amount)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(income.status)}
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {income.description || '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {(!statementData?.transactions?.incomes || statementData.transactions.incomes.length === 0) && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                                        {t('No income transactions found')}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="outcomes" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingDown className="h-5 w-5 text-red-600" />
                                        {t('Outcome Transactions')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('All outgoing transactions for this account')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('Date')}</TableHead>
                                                <TableHead>{t('Reference')}</TableHead>
                                                <TableHead>{t('Amount')}</TableHead>
                                                <TableHead>{t('Status')}</TableHead>
                                                <TableHead>{t('Description')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {statementData?.transactions?.outcomes?.map((outcome, index) => (
                                                <TableRow key={outcome.id || index}>
                                                    <TableCell>{formatDate(outcome.date)}</TableCell>
                                                    <TableCell>{outcome.reference_number || '-'}</TableCell>
                                                    <TableCell className="font-mono text-red-600">
                                                        -{formatCurrency(outcome.amount)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(outcome.status)}
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {outcome.description || '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {(!statementData?.transactions?.outcomes || statementData.transactions.outcomes.length === 0) && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                                        {t('No outcome transactions found')}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>

                {/* Report Footer */}
                <motion.div variants={itemVariants}>
                    <Card className="bg-gray-50 dark:bg-gray-800">
                        <CardContent className="pt-6">
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                <p>{t('This report was automatically generated')}</p>
                                <p className="mt-1">
                                    {t('Generated on')}: {new Date().toLocaleString('fa-AF')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        margin: 0;
                        padding: 20px;
                    }
                    .print-break {
                        page-break-before: always;
                    }
                }
            `}</style>
        </CustomerLayout>
    );
} 