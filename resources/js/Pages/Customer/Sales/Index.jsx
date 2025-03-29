import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { 
    Package, 
    Search, 
    RefreshCw, 
    Eye, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Calendar,
    DollarSign,
    Building2,
    ShoppingBag,
    FileText,
    Filter,
    ChevronDown,
    Mail,
    User
} from 'lucide-react';
// Import the lottie player package
import '@lottiefiles/lottie-player';

// Create a React wrapper component for the lottie-player web component
const LottiePlayer = ({ src, background = "transparent", speed = "1", style, loop = true, autoplay = true }) => {
    useEffect(() => {
        // Ensure the web component is properly defined
        if (typeof document !== 'undefined') {
            import('@lottiefiles/lottie-player');
        }
    }, []);
    
    return React.createElement('lottie-player', {
        src,
        background,
        speed,
        style,
        loop: loop ? '' : null,
        autoplay: autoplay ? '' : null
    });
};

export default function SalesIndex({ sales, filters }) {
    const { t } = useLaravelReactI18n();
    const [isSaleDetailsModalOpen, setIsSaleDetailsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saleDetails, setSaleDetails] = useState(null);

    const { data, setData, get, processing, errors } = useForm({
        search: filters.search || '',
        status: filters.status || '',
        confirmedByWarehouse: filters.confirmedByWarehouse || '',
        confirmedByShop: filters.confirmedByShop || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        get(route('customer.sales.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
            status: '',
            confirmedByWarehouse: '',
            confirmedByShop: '',
        });
        get(route('customer.sales.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const showSaleDetails = async (saleId) => {
        setLoading(true);
        try {
            const response = await fetch(`/customer/sales/${saleId}`);
            const data = await response.json();
            setSaleDetails(data);
            setIsSaleDetailsModalOpen(true);
        } catch (error) {
            console.error('Error fetching sale details:', error);
        } finally {
            setLoading(false);
        }
    };

    const closeSaleDetailsModal = () => {
        setIsSaleDetailsModalOpen(false);
        setSaleDetails(null);
    };

    const showPaymentModal = (sale) => {
        setSelectedSale(sale);
        setIsPaymentModalOpen(true);
    };

    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedSale(null);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSale) return;

        try {
            const response = await fetch(`/customer/sales/${selectedSale.id}/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    paymentAmount: e.target.paymentAmount.value,
                    paymentDate: e.target.paymentDate.value,
                    paymentNotes: e.target.paymentNotes.value,
                }),
            });

            if (response.ok) {
                closePaymentModal();
                // Refresh the page or update the UI
                window.location.reload();
            }
        } catch (error) {
            console.error('Error adding payment:', error);
        }
    };

    return (
        <>
            <Head title={t('My Sales')} />
            <CustomerNavbar />

            <div className="container px-6 mx-auto">
                {/* Header with gradient background */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-8 mb-8 overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white">{t('My Sales')}</h2>
                            <p className="mt-2 text-indigo-100 max-w-2xl">
                                {t('Manage and track your sales transactions securely in one place.')}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:block">
                                <LottiePlayer 
                                    src="/animations/sales-animation.json" 
                                    background="transparent" 
                                    speed="1" 
                                    style={{ width: '120px', height: '120px' }} 
                                    loop
                                    autoplay
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="p-3 rounded-full bg-purple-100 mb-4">
                                <Package className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('Total Sales')}</h3>
                            <p className="text-2xl font-bold text-purple-600">{sales.total}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="p-3 rounded-full bg-green-100 mb-4">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('Completed Sales')}</h3>
                            <p className="text-2xl font-bold text-green-600">
                                {sales.data.filter(sale => sale.status === 'completed').length}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="p-3 rounded-full bg-amber-100 mb-4">
                                <Clock className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('Pending Sales')}</h3>
                            <p className="text-2xl font-bold text-amber-600">
                                {sales.data.filter(sale => sale.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 mb-8">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <Filter className="h-5 w-5 mr-2 text-pink-500" />
                            {t('Quick Filters')}
                        </h3>
                        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Reference')}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="search"
                                        value={data.search}
                                        onChange={e => setData('search', e.target.value)}
                                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        placeholder={t('Search by reference')}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Status')}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="status"
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">{t('All Statuses')}</option>
                                        <option value="completed">{t('Completed')}</option>
                                        <option value="pending">{t('Pending')}</option>
                                        <option value="cancelled">{t('Cancelled')}</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Warehouse Confirmation')}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building2 className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="confirmedByWarehouse"
                                        value={data.confirmedByWarehouse}
                                        onChange={e => setData('confirmedByWarehouse', e.target.value)}
                                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">{t('All')}</option>
                                        <option value="1">{t('Yes')}</option>
                                        <option value="0">{t('No')}</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Shop Confirmation')}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ShoppingBag className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="confirmedByShop"
                                        value={data.confirmedByShop}
                                        onChange={e => setData('confirmedByShop', e.target.value)}
                                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">{t('All')}</option>
                                        <option value="1">{t('Yes')}</option>
                                        <option value="0">{t('No')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full px-4 py-2 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white text-sm font-medium rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 relative overflow-hidden group"
                                >
                                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                    <span className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                                    <span className="relative flex items-center justify-center">
                                        <Search className="h-5 w-5 mr-2 text-white" />
                                        {t('Search')}
                                    </span>
                                </button>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
                                >
                                    <span className="flex items-center justify-center">
                                        <RefreshCw className="h-5 w-5 mr-2" />
                                        {t('Reset')}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sales Table */}
                <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-xl overflow-hidden mb-8">
                    <div className="px-8 py-5 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <ShoppingBag className="h-6 w-6 mr-2 text-indigo-600" />
                            {t('Your Sales')}
                        </h3>
                    </div>

                    <div className="overflow-x-auto bg-white relative">
                        <div className="absolute inset-0 bg-pattern opacity-[0.02] pointer-events-none"></div>
                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Reference')}
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Date')}
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Total Amount')}
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Status')}
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider pr-8">
                                        {t('Actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {sales.data.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-indigo-50/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="mx-6 flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                                                    <ShoppingBag className="h-6 w-6" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-base font-medium text-gray-900">{sale.reference}</div>
                                                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                                                        <User className="h-4 w-4 mr-1 text-gray-400" />
                                                        {sale.customer?.name || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <div className="text-sm text-gray-900 bg-gray-50 py-1.5 px-3 rounded-md inline-flex items-center float-right">
                                                <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                                                {new Date(sale.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <div className="text-sm font-mono bg-indigo-50 text-indigo-800 py-1.5 px-3 rounded-md border border-indigo-100 shadow-sm inline-flex items-center float-right">
                                                <DollarSign className="h-4 w-4 mr-1.5 text-indigo-500" />
                                                {sale.total}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <div className="flex justify-end">
                                                {sale.status === 'completed' ? (
                                                    <span className="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-sm">
                                                        <span className="flex items-center justify-center h-5 w-5 bg-green-500 rounded-full mr-1.5 shadow-inner">
                                                            <CheckCircle className="h-3 w-3 text-white" />
                                                        </span>
                                                        Completed
                                                    </span>
                                                ) : sale.status === 'cancelled' ? (
                                                    <span className="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200 shadow-sm">
                                                        <span className="flex items-center justify-center h-5 w-5 bg-red-500 rounded-full mr-1.5 shadow-inner">
                                                            <XCircle className="h-3 w-3 text-white" />
                                                        </span>
                                                        Cancelled
                                                    </span>
                                                ) : (
                                                    <span className="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200 shadow-sm">
                                                        <span className="flex items-center justify-center h-5 w-5 bg-amber-500 rounded-full mr-1.5 shadow-inner">
                                                            <Clock className="h-3 w-3 text-white" />
                                                        </span>
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-right">
                                            <button
                                                onClick={() => showSaleDetails(sale.id)}
                                                className="group relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg overflow-hidden"
                                            >
                                                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                <span className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                                                <span className="absolute left-0 inset-y-0 flex items-center pl-3 relative">
                                                    <Eye className="h-4 w-4 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                                </span>
                                                <span className="pl-6 relative">{t('View Details')}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-6 border-t border-indigo-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                        {/* RTL Pagination */}
                        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 rtl:flex-row-reverse">
                            {/* Records Info */}
                            <div className="text-sm text-gray-600 rtl:text-right">
                                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                                    <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md rtl:font-semibold">
                                        RTL {t('Support')}
                                    </span>
                                    {sales.total > 0 ? (
                                        <p>
                                            {t('Showing')} <span className="font-medium text-indigo-600">{sales.from}</span> {t('to')}{' '}
                                            <span className="font-medium text-indigo-600">{sales.to}</span> {t('of')}{' '}
                                            <span className="font-medium text-indigo-600">{sales.total}</span> {t('records')}
                                        </p>
                                    ) : (
                                        <p>{t('No records found')}</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Pagination Controls */}
                            {sales.links && sales.links.length > 3 && (
                                <div className="flex items-center justify-center rtl:flex-row-reverse">
                                    <nav 
                                        className="relative z-0 inline-flex rounded-xl shadow-md -space-x-px rtl:space-x-reverse overflow-hidden" 
                                        aria-label="Pagination"
                                        style={{ boxShadow: '0 4px 20px -2px rgba(103, 58, 183, 0.15)' }}
                                    >
                                        {/* First Page Button */}
                                        <Link
                                            href={sales.first_page_url}
                                            className={`relative inline-flex items-center px-3.5 py-2.5 text-sm font-medium ${
                                                sales.current_page === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                                            } transition-colors duration-200 ease-in-out rtl:rotate-180 border-r border-indigo-100 rtl:border-r-0 rtl:border-l`}
                                            disabled={sales.current_page === 1}
                                        >
                                            <span className="sr-only">{t('First Page')}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                        </Link>
                                        
                                        {/* Previous Page Button */}
                                        <Link
                                            href={sales.prev_page_url}
                                            className={`relative inline-flex items-center px-3.5 py-2.5 text-sm font-medium ${
                                                sales.prev_page_url === null
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                                            } transition-colors duration-200 ease-in-out rtl:rotate-180 border-r border-indigo-100 rtl:border-r-0 rtl:border-l`}
                                            disabled={sales.prev_page_url === null}
                                        >
                                            <span className="sr-only">{t('Previous')}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </Link>
                                        
                                        {/* Page Numbers */}
                                        {sales.links.slice(1, -1).map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`relative inline-flex items-center px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-in-out border-r border-indigo-100 rtl:border-r-0 rtl:border-l ${
                                                    link.active
                                                        ? 'z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md transform scale-105'
                                                        : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                                }`}
                                            >
                                                {link.label.replace(/&laquo;|&raquo;/g, '')}
                                                {link.active && (
                                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full transform translate-y-1/2 opacity-60"></span>
                                                )}
                                            </Link>
                                        ))}
                                        
                                        {/* Next Page Button */}
                                        <Link
                                            href={sales.next_page_url}
                                            className={`relative inline-flex items-center px-3.5 py-2.5 text-sm font-medium ${
                                                sales.next_page_url === null
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                                            } transition-colors duration-200 ease-in-out rtl:rotate-180 border-r border-indigo-100 rtl:border-r-0 rtl:border-l`}
                                            disabled={sales.next_page_url === null}
                                        >
                                            <span className="sr-only">{t('Next')}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </Link>
                                        
                                        {/* Last Page Button */}
                                        <Link
                                            href={sales.last_page_url}
                                            className={`relative inline-flex items-center px-3.5 py-2.5 text-sm font-medium ${
                                                sales.current_page === sales.last_page
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                                            } transition-colors duration-200 ease-in-out rtl:rotate-180`}
                                            disabled={sales.current_page === sales.last_page}
                                        >
                                            <span className="sr-only">{t('Last Page')}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </Link>
                                    </nav>
                                </div>
                            )}
                        </div>
                        
                        {/* Page Selection Dropdown - For Mobile */}
                        {sales.last_page > 1 && (
                            <div className="mt-4 sm:hidden">
                                <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
                                    <div className="text-sm text-gray-600">{t('Go to page')}:</div>
                                    <select
                                        value={sales.current_page}
                                        onChange={(e) => {
                                            const page = parseInt(e.target.value);
                                            window.location.href = route('customer.sales.index', {
                                                ...filters,
                                                page,
                                            });
                                        }}
                                        className="form-select block w-full md:w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        {[...Array(sales.last_page)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 