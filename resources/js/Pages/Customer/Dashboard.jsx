import React from 'react';
import { Head } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import {
    ShoppingCart,
    Package,
    FileText,
    DollarSign,
    BarChart
} from 'lucide-react';

export default function CustomerDashboard({ auth }) {
    return (
        <>
            <Head title="Customer Dashboard" />
            <CustomerNavbar />
        </>
    );
}