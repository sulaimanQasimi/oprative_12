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
    public function render()
    {
        return view('livewire.inventory.dashboard');
    }
}
