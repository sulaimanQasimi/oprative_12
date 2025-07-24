import { useState } from "react";
import ApiSelect from "../Components/ApiSelect";

// Example icon components (you can replace with your preferred icon library)
const ShoppingBagIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
    </svg>
);

const UserIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const WeightIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const TruckIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
);

const GlobeIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BuildingIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

export default function Test() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const handleProductChange = (value, option) => {
        setSelectedProduct(value);
        console.log('Selected product:', { value, option });
    };

    const handleUserChange = (value, option) => {
        setSelectedUser(value);
        console.log('Selected user:', { value, option });
    };

    const handleUnitChange = (value, option) => {
        setSelectedUnit(value);
        console.log('Selected unit:', { value, option });
    };

    const handleSupplierChange = (value, option) => {
        setSelectedSupplier(value);
        console.log('Selected supplier:', { value, option });
    };

    const handleCurrencyChange = (value, option) => {
        setSelectedCurrency(value);
        console.log('Selected currency:', { value, option });
    };

    const handleWarehouseChange = (value, option) => {
        setSelectedWarehouse(value);
        console.log('Selected warehouse:', { value, option });
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">API Select Component Demo</h1>
            
            <div className="space-y-8">
                {/* Product Select - LTR with Icon (Public Endpoint) */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Product Selection (CreateItem Style)</h2>
                    <div className="space-y-3">
                        <label className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                            <ShoppingBagIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
                            Product *
                        </label>
                        <ApiSelect
                            apiEndpoint="/api/products/select"
                            placeholder="Choose a product..."
                            searchPlaceholder="Search products..."
                            icon={ShoppingBagIcon}
                            direction="ltr"
                            value={selectedProduct}
                            onChange={(value, option) => {
                                handleProductChange(value, option);
                                console.log('Full product data:', option.product);
                            }}
                            className="w-full max-w-md"
                            searchParam="search"
                            requireAuth={false} // Public endpoint, no auth required
                        />
                        {selectedProduct && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected Product ID: <span className="font-medium">{selectedProduct}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Protected Endpoint Example */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Protected API Example</h2>
                    <ApiSelect
                        apiEndpoint="/api/products" // This would be a protected endpoint
                        placeholder="Choose from protected endpoint..."
                        searchPlaceholder="Search protected data..."
                        icon={ShoppingBagIcon}
                        direction="ltr"
                        className="w-full max-w-md"
                        searchParam="search"
                        requireAuth={true} // Protected endpoint, auth required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        This example shows how to use with protected endpoints (requires authentication)
                    </p>
                </div>

                {/* User Select - RTL Example */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">User Selection (RTL)</h2>
                    <ApiSelect
                        apiEndpoint="/api/products/select" // Using products as example, replace with actual user endpoint
                        placeholder="اختر مستخدم..."
                        searchPlaceholder="البحث عن المستخدمين..."
                        icon={UserIcon}
                        direction="rtl"
                        value={selectedUser}
                        onChange={handleUserChange}
                        className="w-full max-w-md"
                        searchParam="search"
                    />
                    {selectedUser && (
                        <p className="mt-2 text-sm text-gray-600" dir="rtl">
                            معرف المستخدم المحدد: <span className="font-medium">{selectedUser}</span>
                        </p>
                    )}
                </div>

                {/* Simple Select without Icon */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Simple Select (No Icon)</h2>
                    <ApiSelect
                        apiEndpoint="/api/products/select"
                        placeholder="Select an option..."
                        searchPlaceholder="Type to search..."
                        direction="ltr"
                        className="w-full max-w-md"
                        searchParam="search"
                    />
                </div>

                {/* Unit Select */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Unit Selection</h2>
                    <div className="space-y-3">
                        <label className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                            <WeightIcon className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                            Unit *
                        </label>
                        <ApiSelect
                            apiEndpoint="/api/units/select"
                            placeholder="Select unit..."
                            searchPlaceholder="Search units..."
                            icon={WeightIcon}
                            direction="ltr"
                            value={selectedUnit}
                            onChange={handleUnitChange}
                            className="w-full max-w-md"
                            searchParam="search"
                            requireAuth={false}
                        />
                        {selectedUnit && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected Unit ID: <span className="font-medium">{selectedUnit}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Supplier Select */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Supplier Selection</h2>
                    <div className="space-y-3">
                        <label className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                            <TruckIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
                            Supplier *
                        </label>
                        <ApiSelect
                            apiEndpoint="/api/suppliers/select"
                            placeholder="Select supplier..."
                            searchPlaceholder="Search suppliers..."
                            icon={TruckIcon}
                            direction="ltr"
                            value={selectedSupplier}
                            onChange={handleSupplierChange}
                            className="w-full max-w-md"
                            searchParam="search"
                            requireAuth={false}
                        />
                        {selectedSupplier && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected Supplier ID: <span className="font-medium">{selectedSupplier}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Currency Select */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Currency Selection</h2>
                    <div className="space-y-3">
                        <label className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                            <GlobeIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                            Currency *
                        </label>
                        <ApiSelect
                            apiEndpoint="/api/currencies/select"
                            placeholder="Select currency..."
                            searchPlaceholder="Search currencies..."
                            icon={GlobeIcon}
                            direction="ltr"
                            value={selectedCurrency}
                            onChange={handleCurrencyChange}
                            className="w-full max-w-md"
                            searchParam="search"
                            requireAuth={false}
                        />
                        {selectedCurrency && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected Currency ID: <span className="font-medium">{selectedCurrency}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Warehouse Select */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Warehouse Selection</h2>
                    <div className="space-y-3">
                        <label className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                            <BuildingIcon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                            Warehouse *
                        </label>
                        <ApiSelect
                            apiEndpoint="/api/warehouses/select"
                            placeholder="Select warehouse..."
                            searchPlaceholder="Search warehouses..."
                            icon={BuildingIcon}
                            direction="ltr"
                            value={selectedWarehouse}
                            onChange={handleWarehouseChange}
                            className="w-full max-w-md"
                            searchParam="search"
                            requireAuth={false}
                        />
                        {selectedWarehouse && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected Warehouse ID: <span className="font-medium">{selectedWarehouse}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Disabled Select */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Disabled Select</h2>
                    <ApiSelect
                        apiEndpoint="/api/products/select"
                        placeholder="This select is disabled"
                        icon={ShoppingBagIcon}
                        disabled={true}
                        className="w-full max-w-md"
                    />
                </div>
            </div>

            {/* Usage Instructions */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Component Features:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Reusable:</strong> Works with any API endpoint that returns value/label format</li>
                    <li><strong>Search:</strong> Built-in search functionality with debouncing (300ms)</li>
                    <li><strong>Icons:</strong> Support for custom icons with proper positioning</li>
                    <li><strong>RTL/LTR:</strong> Full support for both text directions</li>
                    <li><strong>Loading:</strong> Loading states and error handling</li>
                    <li><strong>Accessible:</strong> Keyboard navigation and click-outside-to-close</li>
                    <li><strong>Customizable:</strong> Configurable placeholders, search params, and styling</li>
                    <li><strong>Form Integration:</strong> Built-in error display and validation support</li>
                    <li><strong>Authentication:</strong> Support for both public and protected endpoints</li>
                    <li><strong>Animations:</strong> Smooth entrance/exit animations with framer-motion</li>
                </ul>

                <h3 className="text-lg font-semibold mt-6 mb-4">Available Endpoints:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded border">
                        <strong className="text-green-600">Products:</strong><br/>
                        <code className="text-gray-600">/api/products/select</code>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <strong className="text-orange-600">Units:</strong><br/>
                        <code className="text-gray-600">/api/units/select</code>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <strong className="text-green-600">Suppliers:</strong><br/>
                        <code className="text-gray-600">/api/suppliers/select</code>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <strong className="text-blue-600">Currencies:</strong><br/>
                        <code className="text-gray-600">/api/currencies/select</code>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <strong className="text-purple-600">Warehouses:</strong><br/>
                        <code className="text-gray-600">/api/warehouses/select</code>
                    </div>
                </div>

                <h3 className="text-lg font-semibold mt-6 mb-4">API Response Format:</h3>
                <p className="text-gray-700 mb-2">All endpoints return this enhanced format:</p>
                <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm">
{`[
  { 
    "value": 1, 
    "label": "Product Name",
    "subtitle": "Barcode: 123456 • ID: 1",
    "product": { /* full object data */ }
  }
]`}
                </pre>
            </div>
        </div>
    );
}