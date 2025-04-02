<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $stats = [
            'products_count' => $warehouse->products()->count(),
            'incoming_transfers_count' => $warehouse->transfersTo()->count(),
            'outgoing_transfers_count' => $warehouse->transfersFrom()->count(),
            'recent_activities' => $this->getRecentActivities($warehouse),
        ];

        return Inertia::render('Warehouse/Dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * Get recent activities for the warehouse.
     */
    private function getRecentActivities($warehouse)
    {
        $activities = [];

        // Add recent income records
        $recentIncome = $warehouse->warehouseIncome()
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($income) {
                return [
                    'title' => 'New income: ' . $income->reference,
                    'time' => $income->created_at->diffForHumans(),
                ];
            });

        // Add recent outcome records
        $recentOutcome = $warehouse->warehouseOutcome()
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($outcome) {
                return [
                    'title' => 'New outcome: ' . $outcome->reference,
                    'time' => $outcome->created_at->diffForHumans(),
                ];
            });

        // Merge and sort by time
        return $recentIncome->concat($recentOutcome)
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->all();
    }
}
