import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
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

export default function SalesIndex({ sales, filters }) {
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
            <Head title="My Sales" />
            <CustomerNavbar />

            <div className="container px-6 mx-auto">
                {/* Header with gradient background */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-8 mb-8 overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white">My Sales</h2>
                            <p className="mt-2 text-indigo-100 max-w-2xl">
                                Manage and track your sales transactions securely in one place.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <lottie-player 
                                src="https://assets5.lottiefiles.com/packages/lf20_ystsffqy.json" 
                                background="transparent" 
                                speed="1" 
                                style={{ width: '120px', height: '120px' }} 
                                loop 
                                autoplay
                            />
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
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Sales</h3>
                            <p className="text-2xl font-bold text-purple-600">{sales.total}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="p-3 rounded-full bg-green-100 mb-4">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Completed Sales</h3>
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
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Sales</h3>
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
                            Quick Filters
                        </h3>
                        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
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
                                        placeholder="Search by reference"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
                                        <option value="">All Statuses</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Confirmation</label>
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
                                        <option value="">All</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Confirmation</label>
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
                                        <option value="">All</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
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
                                        Search
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
                                        Reset
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
                            Your Sales
                        </h3>
                    </div>

                    <div className="overflow-x-auto bg-white relative">
                        <div className="absolute inset-0 bg-pattern opacity-[0.02] pointer-events-none"></div>
                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Reference
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Total Amount
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider pr-8">
                                        Actions
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
                                                <span className="pl-6 relative">View Details</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-4 border-t border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                        {/* Pagination will be handled by Inertia */}
                    </div>
                </div>
            </div>

            {/* Sale Details Modal */}
            {isSaleDetailsModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-opacity duration-300">
                    <div className="relative top-20 mx-auto p-0 border-0 max-w-5xl shadow-2xl rounded-xl bg-white overflow-hidden transform transition-all duration-300">
                        {loading ? (
                            <div className="py-20">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-4"></div>
                                    <p className="text-gray-500 text-lg">Loading sale details...</p>
                                </div>
                            </div>
                        ) : saleDetails ? (
                            <div>
                                {/* Header with gradient background */}
                                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-6 px-8 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4 backdrop-blur-sm">
                                            <ShoppingBag className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Sale #{saleDetails.reference}</h3>
                                            <p className="text-indigo-100 flex items-center mt-1">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {new Date(saleDetails.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                if (saleDetails.status === 'pending') {
                                                    showPaymentModal(saleDetails);
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium mr-2 ${
                                                saleDetails.status === 'pending'
                                                    ? 'bg-white text-indigo-700 hover:bg-indigo-50 transition-colors duration-200'
                                                    : 'bg-white bg-opacity-20 text-white cursor-not-allowed'
                                            }`}
                                            disabled={saleDetails.status !== 'pending'}
                                        >
                                            <DollarSign className="h-4 w-4 mr-1" />
                                            Add Payment
                                        </button>
                                        <button
                                            onClick={closeSaleDetailsModal}
                                            className="bg-transparent text-white hover:bg-white hover:bg-opacity-10 rounded-full p-2 transition-colors duration-200"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="px-8 py-6">
                                    {/* Status Bar */}
                                    <div className="mb-6 flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-2 ${
                                                saleDetails.status === 'completed' ? 'bg-green-500' :
                                                saleDetails.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                                            }`}></div>
                                            <span className="text-sm font-medium capitalize">
                                                Status: {saleDetails.status}
                                            </span>
                                        </div>
                                        <div className="flex space-x-6">
                                            <div className="flex items-center">
                                                <Building2 className="h-5 w-5 mr-2 text-gray-400" />
                                                <span className={`text-sm font-medium ${saleDetails.confirmed_by_warehouse ? 'text-green-600' : 'text-amber-600'}`}>
                                                    Warehouse: {saleDetails.confirmed_by_warehouse ? 'Confirmed' : 'Pending'}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <ShoppingBag className="h-5 w-5 mr-2 text-gray-400" />
                                                <span className={`text-sm font-medium ${saleDetails.confirmed_by_shop ? 'text-green-600' : 'text-amber-600'}`}>
                                                    Shop: {saleDetails.confirmed_by_shop ? 'Confirmed' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Total Amount</h4>
                                                <div className="bg-indigo-100 rounded-full p-1.5">
                                                    <DollarSign className="h-4 w-4 text-indigo-600" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                                {saleDetails.total} {saleDetails.currency?.symbol}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-xs font-semibold text-green-600 uppercase tracking-wider">Paid Amount</h4>
                                                <div className="bg-green-100 rounded-full p-1.5">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                                {saleDetails.paid_amount} {saleDetails.currency?.symbol}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Due Amount</h4>
                                                <div className="bg-amber-100 rounded-full p-1.5">
                                                    <Clock className="h-4 w-4 text-amber-600" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                                {saleDetails.due_amount} {saleDetails.currency?.symbol}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Sale Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                                                <h4 className="text-sm font-medium text-gray-700">Customer Information</h4>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <div className="flex">
                                                    <span className="text-sm text-gray-500 w-1/3">Name:</span>
                                                    <span className="text-sm font-medium text-gray-900">{saleDetails.customer?.name || 'N/A'}</span>
                                                </div>
                                                <div className="flex">
                                                    <span className="text-sm text-gray-500 w-1/3">Email:</span>
                                                    <span className="text-sm font-medium text-gray-900">{saleDetails.customer?.email || 'N/A'}</span>
                                                </div>
                                                <div className="flex">
                                                    <span className="text-sm text-gray-500 w-1/3">Phone:</span>
                                                    <span className="text-sm font-medium text-gray-900">{saleDetails.customer?.phone || 'N/A'}</span>
                                                </div>
                                                <div className="flex">
                                                    <span className="text-sm text-gray-500 w-1/3">Currency:</span>
                                                    <span className="text-sm font-medium text-gray-900">{saleDetails.currency?.name || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                                                <h4 className="text-sm font-medium text-gray-700">Additional Information</h4>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <div className="flex">
                                                    <span className="text-sm text-gray-500 w-1/3">Warehouse:</span>
                                                    <span className="text-sm font-medium text-gray-900">{saleDetails.warehouse?.name || 'N/A'}</span>
                                                </div>
                                                <div className="flex">
                                                    <span className="text-sm text-gray-500 w-1/3">Shop:</span>
                                                    <span className="text-sm font-medium text-gray-900">{saleDetails.shop?.name || 'N/A'}</span>
                                                </div>
                                                <div className="flex">
                                                    <span className="text-sm text-gray-500 w-1/3">Created By:</span>
                                                    <span className="text-sm font-medium text-gray-900">{saleDetails.created_by?.name || 'N/A'}</span>
                                                </div>
                                                <div className="flex">
                                                    <span className="text-sm text-gray-500 w-1/3">Created At:</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {saleDetails.created_at ? new Date(saleDetails.created_at).toLocaleString() : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes if any */}
                                    {saleDetails.notes && (
                                        <div className="mb-6 bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                                            <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                                                <FileText className="h-4 w-4 mr-2" />
                                                Notes
                                            </h4>
                                            <p className="text-sm text-yellow-700">{saleDetails.notes}</p>
                                        </div>
                                    )}

                                    {/* Sale Items */}
                                    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
                                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center">
                                            <Package className="h-5 w-5 mr-2 text-gray-500" />
                                            <h4 className="text-base font-medium text-gray-700">Products</h4>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Product
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Quantity
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Unit Price
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Discount
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Tax
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Total
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {saleDetails.sale_items?.map((item, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-indigo-100 text-indigo-500">
                                                                        <Package className="h-6 w-6" />
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900">{item.product?.name}</div>
                                                                        <div className="text-sm text-gray-500">{item.product?.code}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <span className="px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full bg-indigo-100 text-indigo-800">
                                                                    {item.quantity}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                {item.unit_price} {saleDetails.currency?.symbol}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                {item.discount || '0.00'} {saleDetails.currency?.symbol}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                {item.tax || '0.00'} {saleDetails.currency?.symbol}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-indigo-700">
                                                                {item.total} {saleDetails.currency?.symbol}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50">
                                                    <tr>
                                                        <th scope="row" colSpan="5" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                                            Subtotal
                                                        </th>
                                                        <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                                            {saleDetails.subtotal || saleDetails.total} {saleDetails.currency?.symbol}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row" colSpan="5" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                                            Tax
                                                        </th>
                                                        <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                                            {saleDetails.tax_amount || '0.00'} {saleDetails.currency?.symbol}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row" colSpan="5" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                                            Discount
                                                        </th>
                                                        <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                                            {saleDetails.discount_amount || '0.00'} {saleDetails.currency?.symbol}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row" colSpan="5" className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                                                            Total
                                                        </th>
                                                        <td className="px-6 py-3 text-right text-sm font-bold text-indigo-700">
                                                            {saleDetails.total} {saleDetails.currency?.symbol}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Payment History */}
                                    {saleDetails.payments && saleDetails.payments.length > 0 && (
                                        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
                                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center">
                                                <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
                                                <h4 className="text-base font-medium text-gray-700">Payment History</h4>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Date
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Reference
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Method
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Amount
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {saleDetails.payments.map((payment, index) => (
                                                            <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {new Date(payment.date).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {payment.reference || '-'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {payment.method || '-'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                                                                    {payment.amount} {saleDetails.currency?.symbol}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer with actions */}
                                    <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
                                        <button
                                            onClick={closeSaleDetailsModal}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {isPaymentModalOpen && selectedSale && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-6 border w-1/2 shadow-xl rounded-lg bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Add Payment</h3>
                            <button
                                onClick={closePaymentModal}
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            <input type="hidden" name="saleId" value={selectedSale.id} />
                            <div>
                                <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="paymentAmount"
                                    name="paymentAmount"
                                    required
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="paymentDate"
                                    name="paymentDate"
                                    required
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="paymentNotes" className="block text-sm font-medium text-gray-700">
                                    Notes
                                </label>
                                <textarea
                                    id="paymentNotes"
                                    name="paymentNotes"
                                    rows="3"
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closePaymentModal}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
} 