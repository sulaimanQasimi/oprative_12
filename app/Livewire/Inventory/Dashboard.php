<?php

namespace App\Livewire\Inventory;

use App\Models\Warehouse;
use Livewire\Component;

class Dashboard extends Component
{
    public Warehouse $warehouse;

    public function mount(Warehouse $warehouse)
    {
        $this->warehouse = $warehouse;
    }

    public function getStatusClassWithoutBg($status)
    {
        return match (strtolower($status)) {
            'active' => 'bg-white/80',
            'inactive' => 'bg-gray-100/80',
            'low_stock' => 'bg-red-50/80',
            default => 'bg-white/80',
        };
    }

    public function render()
    {
        return view('livewire.inventory.dashboard');
    }
}
