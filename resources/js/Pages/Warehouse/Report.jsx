import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import anime from "animejs";
import Navigation from "@/Components/Warehouse/Navigation";
import * as XLSX from 'xlsx';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import faIR from "date-fns/locale/fa-IR";
import * as jalali from "date-fns-jalali";

// Register the Persian locale
registerLocale("fa", faIR);
setDefaultLocale("fa");

// Helper function for date conversion
const toGregorian = (year, month, day) => {
  return jalali.toGregorian(year, month, day);
};

// Persian date formatter
const formatPersianDate = (date) => {
  if (!date) return "";

  const persianMonths = [
    "حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله",
    "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"
  ];

  // Simple direct approach to avoid complexities
  try {
    let day = 1;
    let month = 0;
    let year = 1400;

    if (date instanceof Date) {
      day = date.getDate();
      month = date.getMonth();
      year = date.getFullYear();
    }

    return `${day} ${persianMonths[month]} ${year}`;
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
      className="w-full px-4 py-2.5 text-right bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-sm hover:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 flex items-center justify-between group"
    >
      <span className="text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
        {value ? formatPersianDate(value) : formatPersianDate(new Date())}
      </span>
      <svg className="w-5 h-5 text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    currency: 'USD'
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
      className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 z-50 flex flex-col items-center justify-center overflow-hidden"
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
            className="absolute bg-gradient-to-r from-emerald-400/10 via-teal-500/10 to-transparent h-[30vh] w-[100vw]"
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
            className="absolute w-64 h-64 rounded-full bg-emerald-600/5 filter blur-2xl"
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
            className="absolute w-72 h-72 rounded-full bg-teal-500/5 filter blur-2xl transform -translate-x-4 translate-y-4"
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
              className="absolute h-full w-full rounded-full border-4 border-emerald-300/10"
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
              className="absolute h-[85%] w-[85%] rounded-full border-4 border-teal-400/20"
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
              className="absolute h-[70%] w-[70%] rounded-full border-4 border-emerald-400/30"
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
              className="absolute h-full w-full rounded-full border-4 border-r-emerald-400 border-t-transparent border-l-transparent border-b-transparent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                ease: "linear",
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute h-full w-full rounded-full border-4 border-b-teal-400 border-t-transparent border-l-transparent border-r-transparent"
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
              className="relative z-10 bg-gradient-to-br from-emerald-500 to-teal-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
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
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("Warehouse Management System")}</h1>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Customer")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Amount")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Status")}</th>
                    </>
                  )}
                  {type === 'income' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Reference")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Date")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Source")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Amount")}</th>
                    </>
                  )}
                  {type === 'outcome' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Reference")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Date")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Destination")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Amount")}</th>
                    </>
                  )}
                  {type === 'products' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Name")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("SKU")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Category")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Stock")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Price")}</th>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.customer}</td>
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
                    {type === 'income' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reference}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.source}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.amount)}</td>
                      </>
                    )}
                    {type === 'outcome' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reference}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.destination}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.amount)}</td>
                      </>
                    )}
                    {type === 'products' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.price || 0)}</td>
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
                <p className="font-semibold">{t("Generated by Warehouse Management System")}</p>
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

export default function Report({ auth, sales, income, outcome, products, dateRange }) {
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
    income,
    outcome,
    products
  });

  // Refs for animation
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const tableRef = useRef(null);

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      setLoading(true);

      // Convert Jalali dates to Gregorian
      const gregorianStartDate = toGregorian(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate()
      );
      const gregorianEndDate = toGregorian(
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate()
      );

      const formattedStartDate = `${gregorianStartDate.gy}-${String(gregorianStartDate.gm).padStart(2, '0')}-${String(gregorianStartDate.gd).padStart(2, '0')}`;
      const formattedEndDate = `${gregorianEndDate.gy}-${String(gregorianEndDate.gm).padStart(2, '0')}-${String(gregorianEndDate.gd).padStart(2, '0')}`;

      const response = await fetch('/warehouse/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          type: activeTab,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate report');
      }

      const data = await response.json();

      if (data.data) {
        setReportData(prev => ({
          ...prev,
          [activeTab]: data.data
        }));
        alert('Report generated successfully');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert(error.message || 'Failed to generate report');
    } finally {
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
    return data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.reference?.toLowerCase().includes(searchLower) ||
        item.customer?.toLowerCase().includes(searchLower) ||
        item.source?.toLowerCase().includes(searchLower) ||
        item.destination?.toLowerCase().includes(searchLower) ||
        item.name?.toLowerCase().includes(searchLower) ||
        item.sku?.toLowerCase().includes(searchLower)
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

  return (
    <>
      <Head title="Warehouse Reports">
        <style>{`
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
            .print-preview .text-center {
              text-align: center;
            }
            .print-preview .mb-8 {
              margin-bottom: 2rem;
            }
            .print-preview .mt-8 {
              margin-top: 2rem;
            }
            .print-preview .p-6 {
              padding: 1.5rem;
            }
            .print-preview .border-b-2 {
              border-bottom-width: 2px;
            }
            .print-preview .border-t-2 {
              border-top-width: 2px;
            }
            .print-preview .bg-gradient-to-r {
              background-image: linear-gradient(to right, #f9fafb, #f3f4f6);
            }
            .print-preview .rounded-lg {
              border-radius: 0.5rem;
            }
            .print-preview .shadow-lg {
              box-shadow: none;
            }
          }

          /* Persian Calendar Styles */
          .react-datepicker {
            font-family: 'Tahoma', 'Arial', sans-serif !important;
            direction: rtl;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            background: white;
            overflow: hidden;
          }

          .react-datepicker__header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-bottom: none;
            border-top-left-radius: 0.75rem;
            border-top-right-radius: 0.75rem;
            padding: 1rem;
          }

          .react-datepicker__current-month,
          .react-datepicker__day-name {
            color: white;
            font-weight: 600;
          }

          .react-datepicker__day-name {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.875rem;
          }

          .react-datepicker__day {
            color: #1f2937;
            font-size: 0.875rem;
            width: 2.5rem;
            line-height: 2.5rem;
            margin: 0.166rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease-in-out;
          }

          .react-datepicker__day:hover {
            background-color: #10b981;
            color: white;
            transform: scale(1.1);
          }

          .react-datepicker__day--selected,
          .react-datepicker__day--in-selecting-range,
          .react-datepicker__day--in-range {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border-radius: 0.5rem;
            transform: scale(1.1);
          }

          .react-datepicker__day--keyboard-selected {
            background-color: rgba(16, 185, 129, 0.2);
            color: #1f2937;
          }

          .react-datepicker__day--today {
            font-weight: bold;
            color: #10b981;
            position: relative;
          }

          .react-datepicker__day--today::after {
            content: '';
            position: absolute;
            bottom: 0.25rem;
            left: 50%;
            transform: translateX(-50%);
            width: 0.5rem;
            height: 0.5rem;
            background-color: #10b981;
            border-radius: 50%;
          }

          .react-datepicker__navigation {
            top: 1rem;
            border: none;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 0.375rem;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease-in-out;
          }

          .react-datepicker__navigation:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          .react-datepicker__navigation--previous {
            left: 1rem;
          }

          .react-datepicker__navigation--next {
            right: 1rem;
          }

          .react-datepicker__navigation-icon::before {
            border-color: white;
            border-width: 2px;
          }

          .rtl {
            direction: rtl !important;
            text-align: right !important;
          }

          .react-datepicker-popper {
            z-index: 50;
          }

          .react-datepicker__triangle {
            display: none;
          }

          .react-datepicker__month-container {
            float: right;
          }

          .react-datepicker__month {
            margin: 0.5rem;
            padding: 0.5rem;
          }

          .react-datepicker__week {
            display: flex;
            justify-content: space-between;
            margin: 0.25rem 0;
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

      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/50 overflow-hidden">
        <Navigation auth={auth} currentRoute="warehouse.reports" />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header
            ref={headerRef}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30"
          >
            <div className="flex items-center space-x-4">
              <div className="relative flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
                  {t("Warehouse Management")}
                </span>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {t("Reports")}
                </h1>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <div className="p-6">
              {/* Enhanced Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  {
                    title: t("Total Sales"),
                    value: reportData.sales?.reduce((sum, item) => sum + item.amount, 0) || 0,
                    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                    color: "emerald",
                    gradient: "from-emerald-400 to-teal-500",
                    trend: reportData.sales?.length || 0,
                    trendLabel: t("Transactions")
                  },
                  {
                    title: t("Total Income"),
                    value: reportData.income?.reduce((sum, item) => sum + item.amount, 0) || 0,
                    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                    color: "blue",
                    gradient: "from-blue-400 to-indigo-500",
                    trend: reportData.income?.length || 0,
                    trendLabel: t("Records")
                  },
                  {
                    title: t("Total Outcome"),
                    value: reportData.outcome?.reduce((sum, item) => sum + item.amount, 0) || 0,
                    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
                    color: "purple",
                    gradient: "from-purple-400 to-pink-500",
                    trend: reportData.outcome?.length || 0,
                    trendLabel: t("Records")
                  },
                  {
                    title: t("Total Products"),
                    value: reportData.products?.length || 0,
                    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
                    color: "amber",
                    gradient: "from-amber-400 to-orange-500",
                    trend: reportData.products?.filter(p => p.stock > 0)?.length || 0,
                    trendLabel: t("In Stock")
                  }
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="gradient-border bg-white dark:bg-slate-900 rounded-xl p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300"
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300`}></div>

                    {/* Decorative elements */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>

                    {/* Card content */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</h3>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {typeof card.value === 'number' ? formatCurrency(card.value) : card.value}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {card.trend} {card.trendLabel}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full md:w-96 relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={t("Search reports...")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t("Start Date")}
                      </label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="d MMMM yyyy"
                        locale="fa"
                        className="text-right"
                        calendarClassName="font-sans rtl"
                        customInput={<CustomDateInput placeholder={true} />}
                        renderCustomHeader={({
                          date,
                          decreaseMonth,
                          increaseMonth,
                          prevMonthButtonDisabled,
                          nextMonthButtonDisabled,
                        }) => (
                          <div className="flex justify-between items-center px-2 py-2">
                            <button
                              onClick={decreaseMonth}
                              disabled={prevMonthButtonDisabled}
                              type="button"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
                            >
                              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {formatPersianDate(date)}
                            </div>
                            <button
                              onClick={increaseMonth}
                              disabled={nextMonthButtonDisabled}
                              type="button"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
                            >
                              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t("End Date")}
                      </label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="d MMMM yyyy"
                        locale="fa"
                        className="text-right"
                        calendarClassName="font-sans rtl"
                        customInput={<CustomDateInput placeholder={true} />}
                        renderCustomHeader={({
                          date,
                          decreaseMonth,
                          increaseMonth,
                          prevMonthButtonDisabled,
                          nextMonthButtonDisabled,
                        }) => (
                          <div className="flex justify-between items-center px-2 py-2">
                            <button
                              onClick={decreaseMonth}
                              disabled={prevMonthButtonDisabled}
                              type="button"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
                            >
                              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {formatPersianDate(date)}
                            </div>
                            <button
                              onClick={increaseMonth}
                              disabled={nextMonthButtonDisabled}
                              type="button"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
                            >
                              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateReport}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/20"
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
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-500/20"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t("Export to Excel")}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-purple-500/20"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    {t("Print Preview")}
                  </button>
                </motion.div>
              </div>

              <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'sales', label: t('sales'), icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', gradient: 'from-emerald-500 to-teal-500' },
                    { id: 'income', label: t('income'), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', gradient: 'from-blue-500 to-indigo-500' },
                    { id: 'outcome', label: t('outcome'), icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', gradient: 'from-purple-500 to-pink-500' },
                    { id: 'products', label: t('products'), icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', gradient: 'from-amber-500 to-orange-500' }
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

              <div ref={tableRef} className="gradient-border bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                    <thead className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 dark:from-emerald-900/30 dark:via-blue-900/30 dark:to-purple-900/30">
                      <tr>
                        {activeTab === 'sales' && (
                          <>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2" />
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                                {t("Customer")}
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
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                {t("Status")}
                              </div>
                            </th>
                          </>
                        )}
                        {activeTab === 'income' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Reference")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Date")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Source")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Amount")}</th>
                          </>
                        )}
                        {activeTab === 'outcome' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Reference")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Date")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Destination")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Amount")}</th>
                          </>
                        )}
                        {activeTab === 'products' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Name")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("SKU")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Category")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Stock")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("Price")}</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                      {filteredData(reportData[activeTab]).map((item, index) => (
                        <tr
                          key={item.id}
                          className="group hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800/50 dark:hover:to-slate-900/50 transition-all duration-150"
                        >
                          {activeTab === 'sales' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center group-hover:from-emerald-500/20 group-hover:to-teal-500/20 transition-all duration-200">
                                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{item.reference?.charAt(0) || 'R'}</span>
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
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-200">
                                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{item.customer?.charAt(0) || 'C'}</span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{item.customer}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-amber-600 dark:text-amber-400">{formatCurrency(item.amount)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.status === 'completed'
                                    ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </>
                          )}
                          {activeTab === 'income' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.reference}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.source}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{formatCurrency(item.amount)}</td>
                            </>
                          )}
                          {activeTab === 'outcome' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.reference}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.destination}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{formatCurrency(item.amount)}</td>
                            </>
                          )}
                          {activeTab === 'products' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.sku}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{item.stock}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">{formatCurrency(item.price || 0)}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
