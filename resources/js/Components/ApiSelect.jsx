import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, AlertCircle } from "lucide-react";

export default function ApiSelect({ 
    apiEndpoint, 
    placeholder = "Select an option...", 
    searchPlaceholder = "Search...",
    icon: Icon = null,
    direction = "ltr", // "ltr" or "rtl"
    onChange = () => {},
    value = null,
    className = "",
    disabled = false,
    searchParam = "search", // parameter name for search query
    requireAuth = false, // whether this endpoint requires authentication
    error = null // error message to display
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const selectRef = useRef(null);
    const searchRef = useRef(null);

    // Configure axios defaults for authentication
    useEffect(() => {
        if (requireAuth) {
            // Get CSRF token from meta tag
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (token) {
                axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
            }
            
            // Set authentication header if available
            const authToken = localStorage.getItem('auth_token') || document.querySelector('meta[name="auth-token"]')?.getAttribute('content');
            if (authToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            }
        }
    }, [requireAuth]);

    // Load initial options
    useEffect(() => {
        fetchOptions('');
    }, [apiEndpoint]);

    // Set selected option based on value prop
    useEffect(() => {
        if (value && options.length > 0) {
            const option = options.find(opt => opt.value == value);
            setSelectedOption(option || null);
        } else {
            setSelectedOption(null);
        }
    }, [value, options]);

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchOptions(search);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchOptions = async (searchValue) => {
        if (!apiEndpoint || disabled) return;
        
        setLoading(true);
        try {
            const params = {};
            if (searchValue) {
                params[searchParam] = searchValue;
            }
            
            // Configure request headers for authentication
            const config = { params };
            
            if (requireAuth) {
                // Ensure we have the latest CSRF token
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                const authToken = localStorage.getItem('auth_token') || document.querySelector('meta[name="auth-token"]')?.getAttribute('content');
                
                config.headers = {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                };
                
                if (authToken) {
                    config.headers['Authorization'] = `Bearer ${authToken}`;
                }
                
                // For Inertia.js apps, include X-Requested-With header
                config.headers['X-Requested-With'] = 'XMLHttpRequest';
            }
            
            const response = await axios.get(apiEndpoint, config);
            setOptions(response.data || []);
        } catch (error) {
            console.error('Error fetching options:', error);
            
            // Handle specific authentication errors
            if (error.response?.status === 401) {
                console.error('Authentication required for this endpoint. Set requireAuth=true or make the endpoint public.');
            } else if (error.response?.status === 419) {
                console.error('CSRF token mismatch. Please refresh the page.');
            }
            
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
        if (!isOpen && searchRef.current) {
            setTimeout(() => searchRef.current?.focus(), 100);
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        setSearch('');
        onChange(option.value, option);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const directionClass = direction === 'rtl' ? 'text-right' : 'text-left';

    return (
        <div className={`relative ${className}`} ref={selectRef}>
            {/* Select Button - Matching CreateItem.jsx styling */}
            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={`
                    w-full h-14 px-4 text-lg border-2 transition-all duration-200 
                    rounded-md flex items-center justify-between
                    ${directionClass}
                    ${error ? 'border-red-500 ring-2 ring-red-200 dark:ring-red-800' : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-400 focus:border-green-500 dark:focus:border-green-400'}
                    ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'}
                    ${isOpen ? 'ring-2 ring-green-200 dark:ring-green-800 border-green-500 dark:border-green-400' : ''}
                    focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800
                `}
            >
                <span className="flex items-center gap-3">
                    {Icon && <Icon className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />}
                    <span className={selectedOption ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </span>
                
                <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Error Message */}
            {error && (
                <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-sm text-red-600 font-medium flex items-center gap-1 mt-2"
                >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </motion.p>
            )}

            {/* Dropdown - Matching CreateItem.jsx styling */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`
                            absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 
                            border border-gray-200 dark:border-gray-700 rounded-md shadow-xl 
                            max-h-80 overflow-hidden
                            ${direction === 'rtl' ? 'right-0' : 'left-0'}
                        `}
                    >
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="relative">
                                <Search 
                                    className={`w-4 h-4 text-gray-400 absolute top-1/2 transform -translate-y-1/2 ${direction === 'rtl' ? 'right-3' : 'left-3'}`}
                                />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={search}
                                    onChange={handleSearchChange}
                                    placeholder={searchPlaceholder}
                                    className={`
                                        w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md 
                                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                        focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 
                                        focus:border-green-500 dark:focus:border-green-400
                                        ${direction === 'rtl' ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'}
                                    `}
                                    dir={direction}
                                />
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="max-h-64 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-6">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent"></div>
                                    <span className="ml-3 text-gray-500 dark:text-gray-400">Loading...</span>
                                </div>
                            ) : options.length > 0 ? (
                                options.map((option) => (
                                    <motion.button
                                        key={option.value}
                                        whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                                        onClick={() => handleOptionSelect(option)}
                                        className={`
                                            w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-700 
                                            focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700
                                            transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0
                                            ${directionClass}
                                            ${selectedOption?.value == option.value ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}
                                        `}
                                    >
                                        <div className="flex items-center space-x-4">
                                            {Icon && (
                                                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex-shrink-0">
                                                    <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-gray-900 dark:text-white truncate">
                                                    {option.label}
                                                </div>
                                                {option.subtitle && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                        {option.subtitle}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                    {search ? 'No results found' : 'No options available'}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 