@foreach($products as $product)
<div class="product-card bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div class="p-6">
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ $product->product->name }}</h3>
                <p class="text-sm text-gray-500">Warehouse: {{ $product->warehouse->name }}</p>
            </div>
            <div class="text-right">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $product->net_quantity > 10 ? 'bg-green-100 text-green-800' : ($product->net_quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800') }}">
                    Stock: {{ $product->net_quantity }}
                </span>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
                <p class="text-gray-500">Income</p>
                <p class="font-medium text-green-600">{{ $product->income_quantity }} units</p>
            </div>
            <div>
                <p class="text-gray-500">Outcome</p>
                <p class="font-medium text-red-600">{{ $product->outcome_quantity }} units</p>
            </div>
            <div>
                <p class="text-gray-500">Net Total</p>
                <p class="font-medium text-blue-600">${{ number_format($product->net_total, 2) }}</p>
            </div>
            <div>
                <p class="text-gray-500">Profit</p>
                <p class="font-medium text-green-600">${{ number_format($product->profit, 2) }}</p>
            </div>
        </div>
    </div>
</div>
@endforeach
