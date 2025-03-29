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
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border max-w-5xl shadow-xl rounded-lg bg-white">
                        {/* Modal content will be rendered here */}
                        {loading ? (
                            <div className="py-12">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                                    <p className="text-gray-500">Loading sale details...</p>
                                </div>
                            </div>
                        ) : saleDetails ? (
                            <div className="space-y-6">
                                {/* Sale details content */}
                                {/* ... */}
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