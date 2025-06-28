import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import axios from 'axios';
import {
    Package,
    ArrowLeft,
    SaveIcon,
    DollarSign,
    Hash,
    ShoppingBag,
    FileText,
    ClipboardList,
    Search,
    Weight,
    Calculator,
    CheckCircle,
    AlertCircle,
    Package2
} from 'lucide-react';

export default function CreateStockIncome({ auth, products, reference }) {
    const { t } = useLaravelReactI18n();
    const [calculatedTotal, setCalculatedTotal] = useState(0);
    const [calculatedQuantity, setCalculatedQuantity] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        reference_number: reference || '',
        unit_type: '',
        quantity: 1,
        price: '',
        notes: '',
    });

    // Update selected product when product_id changes
    useEffect(() => {
        if (data.product_id) {
            const product = products.find(p => p.id === parseInt(data.product_id));
            setSelectedProduct(product);
        } else {
            setSelectedProduct(null);
        }
    }, [data.product_id, products]);

    // Calculate actual quantity and total (similar to warehouse logic)
    useEffect(() => {
        if (selectedProduct && data.unit_type && data.quantity && data.price) {
            let actualQuantity = parseFloat(data.quantity) || 0;

            if (data.unit_type === 'wholesale' && selectedProduct.whole_sale_unit_amount) {
                actualQuantity = (parseFloat(data.quantity) || 0) * selectedProduct.whole_sale_unit_amount;
            }

            const total = actualQuantity * (parseFloat(data.price) || 0);

            setCalculatedQuantity(actualQuantity);
            setCalculatedTotal(total);
        } else {
            setCalculatedQuantity(0);
            setCalculatedTotal(0);
        }
    }, [selectedProduct, data.unit_type, data.quantity, data.price]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getUnitPrice = (product, unitType) => {
        if (!product) return 0;

        switch (unitType) {
            case 'wholesale':
                return product.wholesale_price || 0;
            case 'retail':
                return product.retail_price || 0;
            default:
                return 0;
        }
    };

    const handleUnitTypeChange = (unitType) => {
        setData('unit_type', unitType);

        // Auto-fill price based on unit type
        if (selectedProduct) {
            const price = getUnitPrice(selectedProduct, unitType);
            setData('price', price.toString());
        }
    };

    const getAvailableUnits = (product) => {
        const units = [];

        if (product?.wholesaleUnit && product.whole_sale_unit_amount) {
            units.push({
                type: 'wholesale',
                label: `${product.wholesaleUnit.name} (${product.wholesaleUnit.symbol})`,
                amount: product.whole_sale_unit_amount,
                price: product.wholesale_price
            });
        }

        if (product?.retailUnit) {
            units.push({
                type: 'retail',
                label: `${product.retailUnit.name} (${product.retailUnit.symbol})`,
                amount: 1,
                price: product.retail_price
            });
        }

        return units;
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);

        // Update total when price or quantity changes
        if (name === 'price' || name === 'quantity') {
            const quantity = name === 'quantity' ? value : data.quantity;
            const price = name === 'price' ? value : data.price;
            setCalculatedTotal(quantity * price);
        }
    };

    // Handle product search
    const handleProductSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length < 2) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        setIsSearching(true);
        setShowDropdown(true);

        try {
            const response = await axios.get(route('customer.stock-incomes.search-products', {
                search: value
            }));

            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching products:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle product selection from dropdown
    const handleProductSelect = (product) => {
        setData('product_id', product.id);
        setSearchTerm(product.name);
        setShowDropdown(false);
    };

    // Handle product selection
    const handleProductChange = (e) => {
        const productId = e.target.value;
        setData('product_id', productId);

        // Auto-fill price if available
        if (productId) {
            const selectedProduct = products.find(p => p.id == productId);
            if (selectedProduct && selectedProduct.retail_price) {
                setData('price', selectedProduct.retail_price);
                setCalculatedTotal(selectedProduct.retail_price * data.quantity);
            } else if (selectedProduct && selectedProduct.purchase_price) {
                // Fallback to purchase price if retail price is not available
                setData('price', selectedProduct.purchase_price);
                setCalculatedTotal(selectedProduct.purchase_price * data.quantity);
            }
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer.stock-incomes.store'));
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowDropdown(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <>
            <Head title={t('Add Stock Income')} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || {user: {name: 'Customer'}}}
                    currentRoute="customer.stock-incomes.index"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('customer.stock-incomes.index')}
                                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </Link>
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Customer Portal")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    {t("Add Stock Income")}
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <div className="max-w-4xl mx-auto">
                                {/* Form Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden mb-8">
                                    <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                            <ClipboardList className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                                            {t('Stock Income Details')}
                                        </h3>
                                    </div>

                                    <div className="p-8">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* Reference Number */}
                                            <div>
                                                <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {t('Reference Number')} *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Hash className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="reference_number"
                                                        name="reference_number"
                                                        value={data.reference_number}
                                                        onChange={handleChange}
                                                        className={`pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.reference_number ? 'border-red-500 dark:border-red-700' : ''}`}
                                                        placeholder={t('Auto-generated reference number')}
                                                        readOnly
                                                    />
                                                </div>
                                                {errors.reference_number && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reference_number}</p>}
                                            </div>

                                            {/* Product Search - NEW */}
                                            <div>
                                                <label htmlFor="product_search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {t('Search Product')} *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Search className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="product_search"
                                                        value={searchTerm}
                                                        onChange={handleProductSearch}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (searchResults.length > 0) {
                                                                setShowDropdown(true);
                                                            }
                                                        }}
                                                        className={`pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.product_id ? 'border-red-500 dark:border-red-700' : ''}`}
                                                        placeholder={t('Search by product name or barcode')}
                                                    />

                                                    {showDropdown && (
                                                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                                                            {isSearching ? (
                                                                <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                                                                    {t('Searching...')}
                                                                </div>
                                                            ) : searchResults.length > 0 ? (
                                                                <ul className="py-1">
                                                                    {searchResults.map(product => (
                                                                        <li
                                                                            key={product.id}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleProductSelect(product);
                                                                            }}
                                                                            className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer"
                                                                        >
                                                                            <div className="flex justify-between">
                                                                                <div>
                                                                                    <span className="font-medium text-gray-800 dark:text-white">{product.name}</span>
                                                                                    {product.barcode && (
                                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                                            {t('Barcode')}: {product.barcode}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                                {product.retail_price ? (
                                                                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                                                        ${product.retail_price}
                                                                                    </span>
                                                                                ) : product.purchase_price && (
                                                                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                                                        ${product.purchase_price}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : searchTerm.length >= 2 ? (
                                                                <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                                                                    {t('No products found')}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    )}
                                                </div>

                                                <input
                                                    type="hidden"
                                                    name="product_id"
                                                    value={data.product_id}
                                                />

                                                {errors.product_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.product_id}</p>}
                                            </div>

                                            {/* Unit Type Selection */}
                                            <div>
                                                <label htmlFor="unit_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {t('Unit Type')} *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Weight className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <select
                                                        id="unit_type"
                                                        name="unit_type"
                                                        value={data.unit_type}
                                                        onChange={(e) => handleUnitTypeChange(e.target.value)}
                                                        disabled={!selectedProduct}
                                                        className={`pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.unit_type ? 'border-red-500 dark:border-red-700' : ''} ${!selectedProduct ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <option value="">{selectedProduct ? t("Select unit type") : t("Select product first")}</option>
                                                        {selectedProduct && getAvailableUnits(selectedProduct).map((unit) => (
                                                            <option key={unit.type} value={unit.type}>
                                                                {unit.label} - {formatCurrency(unit.price)} per unit
                                                                {unit.amount > 1 && ` (${unit.amount} pieces)`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.unit_type && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.unit_type}</p>}
                                            </div>

                                            {/* Quantity and Price */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        {t('Quantity')} *
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <ShoppingBag className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="number"
                                                            id="quantity"
                                                            name="quantity"
                                                            min="1"
                                                            value={data.quantity}
                                                            onChange={handleChange}
                                                            className={`pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.quantity ? 'border-red-500 dark:border-red-700' : ''}`}
                                                            placeholder={t('Enter quantity')}
                                                        />
                                                    </div>
                                                    {errors.quantity && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        {t('Unit Price')} *
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="number"
                                                            id="price"
                                                            name="price"
                                                            step="0.01"
                                                            min="0"
                                                            value={data.price}
                                                            onChange={handleChange}
                                                            className={`pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.price ? 'border-red-500 dark:border-red-700' : ''} bg-gray-100 dark:bg-slate-700`}
                                                            placeholder={t('Product price')}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        {t('Price is automatically set based on the product\'s retail price')}
                                                    </p>
                                                    {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            <div>
                                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {t('Notes')}
                                                    <span className="text-xs text-gray-500 ml-2">({t('Optional')})</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                                                        <Package2 className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <textarea
                                                        id="notes"
                                                        name="notes"
                                                        rows={4}
                                                        value={data.notes}
                                                        onChange={handleChange}
                                                        className={`pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 resize-none ${errors.notes ? 'border-red-500 dark:border-red-700' : ''}`}
                                                        placeholder={t('Enter any additional notes about this stock income...')}
                                                    />
                                                </div>
                                                {errors.notes && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>}
                                            </div>

                                            {/* Enhanced Total Amount Calculation */}
                                            {selectedProduct && data.unit_type && data.quantity && data.price && (
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-700">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                            <Calculator className="h-5 w-5 text-white" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                            {t('Stock Income Summary')}
                                                        </h3>
                                                        <div className="ml-auto flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                                                            <CheckCircle className="w-3 h-3" />
                                                            {t('Valid')}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="text-center p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center justify-center gap-2">
                                                                <Hash className="w-4 h-4" />
                                                                {t("Actual Quantity")}
                                                            </p>
                                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                {data.quantity}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">{t("units")}</p>
                                                        </div>
                                                        
                                                        <div className="text-center p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center justify-center gap-2">
                                                                <DollarSign className="w-4 h-4" />
                                                                {t("Price per Unit")}
                                                            </p>
                                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                {formatCurrency(parseFloat(data.price) || 0)}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="text-center p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border-2 border-green-300 dark:border-green-700">
                                                            <p className="text-sm text-green-700 dark:text-green-400 mb-2 flex items-center justify-center gap-2">
                                                                <Calculator className="w-4 h-4" />
                                                                {t("Total Value")}
                                                            </p>
                                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                                {formatCurrency(data.price * data.quantity)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {data.unit_type === 'wholesale' && selectedProduct.whole_sale_unit_amount > 1 && (
                                                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                                                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                                                <Package2 className="h-5 w-5" />
                                                                <span className="font-medium">
                                                                    <strong>{t("Wholesale unit multiplier applied")}:</strong> {data.quantity} × {selectedProduct.whole_sale_unit_amount} = {calculatedQuantity} {t("units")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Total Amount (Simplified for when calculation summary is not shown) */}
                                            {(!selectedProduct || !data.unit_type || !data.quantity || !data.price) && (
                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{t('Total Amount:')}</span>
                                                        <span className="text-xl text-blue-700 dark:text-blue-400 font-bold">{formatCurrency(calculatedTotal)}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Submit Button */}
                                            <div className="flex justify-end space-x-4 mt-8">
                                                <Link
                                                    href={route('customer.stock-incomes.index')}
                                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                                                >
                                                    {t('Cancel')}
                                                </Link>

                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
                                                >
                                                    <SaveIcon className="h-5 w-5" />
                                                    <span>{t('Save Stock Income')}</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
