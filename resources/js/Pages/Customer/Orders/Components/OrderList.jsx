import React from "react";
import moment from "moment-jalaali";
import { useLaravelReactI18n } from "laravel-react-i18n";

const getOrderStatusBadge = (status) => {
    const styles =
        {
            pending: {
                bg: "bg-amber-100",
                text: "text-amber-800",
                border: "border-amber-200",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                ),
            },
            processing: {
                bg: "bg-blue-100",
                text: "text-blue-800",
                border: "border-blue-200",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                ),
            },
            completed: {
                bg: "bg-emerald-100",
                text: "text-emerald-800",
                border: "border-emerald-200",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                ),
            },
            default: {
                bg: "bg-gray-100",
                text: "text-gray-800",
                border: "border-gray-200",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                ),
            },
        }[status] || styles.default;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text} ${styles.border}`}
        >
            {styles.icon}
            {status
                ? status.charAt(0).toUpperCase() + status.slice(1)
                : "Unknown"}
        </span>
    );
};

export default function OrderList({
    orders,
    onOrderSelect,
    loading,
    pagination,
    onPageChange,
    view,
    filters,
    onFilterChange,
}) {
    const { t } = useLaravelReactI18n();

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const momentDate = moment(dateString);
        return momentDate.format("jYYYY/jMM/jDD HH:mm");
    };

    const isToday = (dateString) => {
        if (!dateString) return false;
        const momentDate = moment(dateString);
        const today = moment();
        return (
            momentDate.format("jYYYY/jMM/jDD") === today.format("jYYYY/jMM/jDD")
        );
    };

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <>
            {/* Orders Table */}
            <div className="overflow-x-auto rounded-xl shadow-sm">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed border-gray-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-lg">
                            No orders found matching your criteria.
                        </p>
                        <p className="text-sm mt-2">
                            Try changing your filters or search parameters.
                        </p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-xl overflow-hidden border-collapse">
                        <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    <div className="flex items-center justify-end">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                            />
                                        </svg>
                                        Order #
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    <div className="flex items-center justify-end">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        Order Number
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    <div className="flex items-center justify-end">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Date
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    <div className="flex items-center justify-end">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Amount
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    <div className="flex items-center justify-end">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                            />
                                        </svg>
                                        Items
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    <div className="flex items-center justify-end">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Status
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    <div className="flex items-center justify-end">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        Actions
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-indigo-50/30 transition-colors duration-150 group"
                                    style={{
                                        animation: `fadeIn 0.5s ease-out ${
                                            index * 0.1
                                        }s both`,
                                    }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                                            <span className="bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors duration-150 py-1 px-2.5 rounded-lg">
                                                #{order.id}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center justify-end">
                                            <span className="bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors duration-150 py-1 px-2.5 rounded-lg">
                                                {order.order_number ||
                                                    `#${String(
                                                        order.id
                                                    ).padStart(6, "0")}`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center justify-end">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0 text-indigo-400 group-hover:text-indigo-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span
                                                className={
                                                    isToday(order.created_at)
                                                        ? "text-green-600 font-medium"
                                                        : ""
                                                }
                                            >
                                                {formatDate(order.created_at)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center justify-end">
                                            <span className="bg-green-100 text-green-700 py-1 px-2.5 rounded-lg group-hover:bg-green-200 transition-colors duration-150">
                                                {Number(
                                                    order.total_amount
                                                ).toFixed(2)} ؋
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center justify-end">
                                            <span className="bg-purple-100 text-purple-600 py-1 px-2.5 rounded-lg group-hover:bg-purple-200 transition-colors duration-150">
                                                <span className="font-semibold">
                                                    {order.items
                                                        ? order.items.length
                                                        : 0}
                                                </span>{" "}
                                                items
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex justify-end">
                                            {getOrderStatusBadge(
                                                order.order_status
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() =>
                                                    onOrderSelect(order.id)
                                                }
                                                className="flex items-center text-indigo-600 hover:text-indigo-900 font-medium bg-indigo-50 hover:bg-indigo-100 transition-colors duration-150 px-3 py-1.5 rounded-lg group-hover:scale-105 transform"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                                {t('View Details')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `,
                }}
            />
        </>
    );
}
