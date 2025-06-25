import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import anime from "animejs";
import * as XLSX from 'xlsx';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import faIR from "date-fns/locale/fa-IR";
import { getYear, getMonth, getDate } from "date-fns-jalali";
import { format as formatJalali } from "date-fns-jalali";
import CustomerNavbar from "@/Components/CustomerNavbar";

// Register the Persian locale
registerLocale("fa", faIR);
setDefaultLocale("fa");

// Persian days
const persianDays = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنج‌شنبه",
    "جمعه",
    "شنبه"
];

// Helper function for date conversion
const toGregorian = (jalaliDate) => {
  if (!jalaliDate || !(jalaliDate instanceof Date)) {
    return new Date();
  }

  try {
    // Extract year, month (0-based), and day from Jalali date
    const year = getYear(jalaliDate);
    const month = getMonth(jalaliDate);  // 0-based month
    const day = getDate(jalaliDate);

    // Create a gregorian date by using the JavaScript Date constructor
    // The jalali date is already in the JavaScript Date format internally
    return new Date(jalaliDate);
  } catch (error) {
    console.error("Error converting Jalali to Gregorian:", error);
    return new Date();
  }
};

// Persian date formatter
const formatPersianDate = (date) => {
    if (!date) return "";

    const persianMonths = [
        "حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله",
        "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"
    ];

    try {
        let day = 1;
        let month = 0;
        let year = 1400;
        let dayOfWeek = 0;

        if (date instanceof Date) {
            day = date.getDate();
            month = date.getMonth();
            year = date.getFullYear();
            dayOfWeek = date.getDay();
        }

        return `${persianDays[dayOfWeek]}، ${day} ${persianMonths[month]} ${year}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return "";
    }
};

// Custom input component for date picker
const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className="w-full px-4 py-2.5 text-right bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 border border-pink-200 dark:border-pink-800 rounded-lg shadow-sm hover:border-pink-500 focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all duration-200 flex items-center justify-between group"
    >
      <span className="text-slate-500 dark:text-slate-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200">
        {value ? formatPersianDate(value) : formatPersianDate(new Date())}
      </span>
      <svg className="w-5 h-5 text-pink-500 dark:text-pink-400 group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </button>
  );
});

// Add display name for better debugging
CustomDateInput.displayName = 'CustomDateInput';

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
                    currency: 'AFN'
  }).format(amount);
};

const exportToExcel = (data, filename) => {
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Generate Excel file
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

// Add PageLoader component
const PageLoader = ({ isVisible }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 z-50 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "all" : "none",
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

      {/* Animated light beams */}
      <div className="absolute w-full h-full overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-blue-400/10 via-indigo-500/10 to-transparent h-[30vh] w-[100vw]"
            style={{
              top: `${10 + i * 20}%`,
              left: "-100%",
              transformOrigin: "left center",
              rotate: `${-20 + i * 10}deg`,
            }}
            animate={{
              left: ["100%", "-100%"],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 3,
            }}
          />
        ))}
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: [null, `${-Math.random() * 100 - 50}%`],
              opacity: [null, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Main animated container */}
        <motion.div
          className="relative"
          animate={{
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Pulsing background circles */}
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-blue-600/5 filter blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-72 h-72 rounded-full bg-indigo-500/5 filter blur-2xl transform -translate-x-4 translate-y-4"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Animated logo/icon container */}
          <div className="relative flex items-center justify-center h-40 w-40">
            {/* Spinning rings */}
            <motion.div
              className="absolute h-full w-full rounded-full border-4 border-blue-300/10"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute h-[85%] w-[85%] rounded-full border-4 border-indigo-400/20"
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 15,
                ease: "linear",
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute h-[70%] w-[70%] rounded-full border-4 border-blue-400/30"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 10,
                ease: "linear",
                repeat: Infinity,
              }}
            />

            {/* Spinner arcs */}
            <motion.div
              className="absolute h-full w-full rounded-full border-4 border-r-blue-400 border-t-transparent border-l-transparent border-b-transparent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                ease: "linear",
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute h-full w-full rounded-full border-4 border-b-indigo-400 border-t-transparent border-l-transparent border-r-transparent"
              animate={{ rotate: -180 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            {/* Icon/logo in center */}
            <motion.div
              className="relative z-10 bg-gradient-to-br from-blue-500 to-indigo-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
              animate={{
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg className="h-10 w-10 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const PrintPreview = ({ data, type, dateRange, onClose }) => {
  const { t } = useLaravelReactI18n();

  // Format the date range for display
  const formattedDateRange = {
    start: formatPersianDate(dateRange.start),
    end: formatPersianDate(dateRange.end)
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print-preview">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("Customer Management System")}</h1>
            <h2 className="text-xl font-semibold text-gray-600 mb-4">{t("Official Report")}</h2>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <p>{t("Generated on")} {formatPersianDate(new Date())}</p>
              <p>{t("Period")}: {formattedDateRange.start} - {formattedDateRange.end}</p>
            </div>
          </div>

          {/* Report Type */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
              {t(type.charAt(0).toUpperCase() + type.slice(1))} {t("Report")}
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {type === 'sales' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Reference")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Date")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Product")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Quantity")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Amount")}</th>
                    </>
                  )}
                  {type === 'market_orders' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Reference")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Date")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Amount")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Status")}</th>
                    </>
                  )}
                  {type === 'incomes' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Reference")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Date")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Source")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Description")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Amount")}</th>
                    </>
                  )}
                  {type === 'outcomes' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Reference")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Date")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Destination")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Description")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Amount")}</th>
                    </>
                  )}
                  {type === 'accounts' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Reference")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Name")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Balance")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Created Date")}</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {type === 'sales' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reference}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.amount)}</td>
                      </>
                    )}
                    {type === 'market_orders' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reference}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </>
                    )}
                    {type === 'incomes' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reference}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.source}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.amount)}</td>
                      </>
                    )}
                    {type === 'outcomes' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reference}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.destination}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.amount)}</td>
                      </>
                    )}
                    {type === 'accounts' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reference}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.balance)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {t("Page")} 1 {t("of")} 1
              </div>
              <div className="text-sm text-gray-500">
                <p className="font-semibold">{t("Generated by Customer Management System")}</p>
                <p>{t("This is an official document")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-4 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {t("Close")}
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            {t("Print")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Reports({ auth, sales, marketOrders, accounts, incomes, outcomes, dateRange }) {
  const { t } = useLaravelReactI18n();
  const [activeTab, setActiveTab] = useState('sales');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date(dateRange.start));
  const [endDate, setEndDate] = useState(new Date(dateRange.end));
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Add state for report data
  const [reportData, setReportData] = useState({
    sales,
    marketOrders,
    accounts,
    incomes,
    outcomes
  });

  // Refs for animation
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const tableRef = useRef(null);

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      setLoading(true);

      // Use a different approach to format dates
      const formatDateForAPI = (date) => {
        if (!date || !(date instanceof Date)) {
          return '';
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
      };

      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      // Use Inertia.js to make the request
      router.post('/customer/reports/generate', {
        type: activeTab,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        search: searchTerm
      }, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (response) => {
          // Get the data from the response
          const responseData = response?.data || {};

          if (responseData.data) {
            setReportData(prev => ({
              ...prev,
              [activeTab]: responseData.data
            }));

            // Show different message based on whether it's a search or a full report
            if (searchTerm.trim().length > 0) {
              alert(`Found ${responseData.data.length} results matching "${searchTerm}"`);
            } else {
              alert('Report generated successfully');
            }
          }

          setIsLoading(false);
          setLoading(false);
        },
        onError: (errors) => {
          console.error('Error generating report:', errors);
          alert(errors.message || 'Failed to generate report');
          setIsLoading(false);
          setLoading(false);
        },
        onFinish: () => {
          setIsLoading(false);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error generating report:', error);
      alert(error.message || 'Failed to generate report');
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleExport = () => {
    const data = reportData[activeTab];
    exportToExcel(data, `${activeTab}-report-${new Date().toISOString().split('T')[0]}`);
  };

  const handlePrint = () => {
    setShowPrintPreview(true);
  };

  const filteredData = (data) => {
    if (!data) return [];

    return data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.reference?.toLowerCase().includes(searchLower) ||
        item.product?.toLowerCase().includes(searchLower) ||
        item.customer?.toLowerCase().includes(searchLower) ||
        item.source?.toLowerCase().includes(searchLower) ||
        item.destination?.toLowerCase().includes(searchLower) ||
        item.name?.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower))
      );
    });
  };

  // Initialize animations
  useEffect(() => {
    if (!isAnimated) {
      const timeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 800,
      });

      timeline
        .add({
          targets: headerRef.current,
          opacity: [0, 1],
          translateY: [-20, 0],
          duration: 600,
        })
        .add({
          targets: cardsRef.current,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 700,
        }, '-=400')
        .add({
          targets: tableRef.current,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
        }, '-=500');

      setIsAnimated(true);
    }
  }, [isAnimated]);

  // Add debounced search effect
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        handleGenerateReport();
      }
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchTerm]);

  return (
    <>
      <Head title="Customer Reports">
        <style>{`
          @keyframes shimmer {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
          }
          .animate-shimmer {
            animation: shimmer 3s infinite;
          }

          .bg-grid-pattern {
            background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
            background-size: 14px 14px;
          }

          .dark .bg-grid-pattern {
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          }

          .card-shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(
                to right,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.3) 50%,
                rgba(255, 255, 255, 0) 100%
            );
          }

          /* Fix for horizontal scroll */
          html, body {
            overflow-x: hidden;
            max-width: 100%;
          }

          .responsive-chart-container {
            max-width: 100%;
            overflow-x: hidden;
          }

          @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }

          @media print {
            @page {
              size: A4;
              margin: 2cm;
            }
            body * {
              visibility: hidden;
            }
            .print-preview, .print-preview * {
              visibility: visible;
            }
            .print-preview {
              position: absolute;
              left: 0;
              top: 0;
              width: 210mm;
              height: 297mm;
              background: white;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            .print-preview > div {
              box-shadow: none;
              border-radius: 0;
              width: 100%;
              max-width: none;
              height: 100%;
              display: flex;
              flex-direction: column;
            }
            .print-preview .no-print {
              display: none;
            }
            .print-preview table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 1rem;
            }
            .print-preview th,
            .print-preview td {
              border: 1px solid #e5e7eb;
              padding: 0.5rem;
              font-size: 10pt;
            }
            .print-preview th {
              background-color: #f9fafb;
              font-weight: 600;
            }
            .print-preview h1 {
              font-size: 20pt;
              margin-bottom: 0.5rem;
              color: #1f2937;
            }
            .print-preview h2 {
              font-size: 16pt;
              margin-bottom: 1rem;
              color: #374151;
            }
            .print-preview p {
              font-size: 10pt;
              margin-bottom: 0.25rem;
              color: #4b5563;
            }
          }
        `}</style>
      </Head>

      <PageLoader isVisible={loading} />

      {showPrintPreview && (
        <PrintPreview
          data={filteredData(reportData[activeTab])}
          type={activeTab}
          dateRange={{ start: startDate, end: endDate }}
          onClose={() => setShowPrintPreview(false)}
        />
      )}

      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-pink-950/50">
        <CustomerNavbar auth={auth} currentRoute="customer.reports" />

        <div className="flex-1 flex flex-col">
          <header
            ref={headerRef}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30"
          >
            <div className="flex items-center space-x-4">
              <div className="relative flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-0.5">
                  {t("Customer Management")}
                </span>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {t("Reports")}
                </h1>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'sales', label: t('sales'), icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', gradient: 'from-pink-500 to-purple-500' },
                  { id: 'marketOrders', label: t('market orders'), icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', gradient: 'from-purple-500 to-indigo-500' },
                  { id: 'accounts', label: t('accounts'), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', gradient: 'from-blue-500 to-cyan-500' },
                  { id: 'incomes', label: t('incomes'), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', gradient: 'from-emerald-500 to-teal-500' },
                  { id: 'outcomes', label: t('outcomes'), icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', gradient: 'from-amber-500 to-orange-500' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative group px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${
                        activeTab === tab.id
                          ? `bg-gradient-to-br ${tab.gradient}`
                          : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                      }`}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                        </svg>
                      </div>
                      <span className="capitalize">{tab.label}</span>
                    </div>
                    {activeTab === tab.id && (
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tab.gradient} rounded-full`} />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={t("Search...")}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="flex items-center space-x-2">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="d MMMM yyyy"
                    locale="fa"
                    className="text-right px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    customInput={<CustomDateInput placeholder={true} />}
                  />
                  <span className="text-slate-500 dark:text-slate-400">-</span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="d MMMM yyyy"
                    locale="fa"
                    className="text-right px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    customInput={<CustomDateInput placeholder={true} />}
                  />
                </div>

                <button
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                  {isLoading ? t("Generating...") : t("Generate Report")}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t("Export to Excel")}
                </button>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  {t("Print Preview")}
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div ref={tableRef} className="gradient-border bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-blue-900/30">
                    <tr>
                      {activeTab === 'sales' && (
                        <>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              </div>
                              {t("Reference")}
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              {t("Date")}
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                              {t("Product")}
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                              </div>
                              {t("Quantity")}
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              {t("Amount")}
                            </div>
                          </th>
                        </>
                      )}
                      {activeTab === 'marketOrders' && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Reference")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Date")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Amount")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Status")}</th>
                        </>
                      )}
                      {activeTab === 'incomes' && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Reference")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Date")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Source")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Description")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Amount")}</th>
                        </>
                      )}
                      {activeTab === 'outcomes' && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Reference")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Date")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Destination")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Description")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Amount")}</th>
                        </>
                      )}
                      {activeTab === 'accounts' && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Reference")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Name")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Balance")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Created Date")}</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredData(reportData[activeTab])?.map((item, index) => (
                      <tr
                        key={item.id || index}
                        className="group hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800/50 dark:hover:to-slate-900/50 transition-all duration-150"
                      >
                        {activeTab === 'sales' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-pink-500/20 group-hover:to-purple-500/20 transition-all duration-200">
                                  <span className="text-sm font-medium text-pink-600 dark:text-pink-400">{item.reference?.charAt(0) || 'R'}</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-slate-900 dark:text-white">{item.reference}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-slate-900 dark:text-white">{item.date}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-slate-900 dark:text-white">{item.product}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-slate-900 dark:text-white">{item.quantity}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-amber-600 dark:text-amber-400">{formatCurrency(item.amount)}</div>
                            </td>
                          </>
                        )}
                        {activeTab === 'marketOrders' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.reference}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{formatCurrency(item.amount)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.status === 'completed' ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </>
                        )}
                        {activeTab === 'incomes' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.reference}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.source}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{formatCurrency(item.amount)}</td>
                          </>
                        )}
                        {activeTab === 'outcomes' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.reference}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.destination}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{formatCurrency(item.amount)}</td>
                          </>
                        )}
                        {activeTab === 'accounts' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.reference}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{formatCurrency(item.balance)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.date}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
