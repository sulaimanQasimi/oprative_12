<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- Profile Card -->
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold mb-4">Profile Information</h3>
                            <div class="space-y-2">
                                <p><span class="font-medium">Name:</span> {{ Auth::guard('customer')->user()->name }}</p>
                                <p><span class="font-medium">Email:</span> {{ Auth::guard('customer')->user()->email }}</p>
                                <p><span class="font-medium">Phone:</span> {{ Auth::guard('customer')->user()->phone ?? 'Not set' }}</p>
                                <p><span class="font-medium">Address:</span> {{ Auth::guard('customer')->user()->address ?? 'Not set' }}</p>
                            </div>
                            <div class="mt-4">
                                <a href="{{ route('customer.profile.show') }}" class="text-indigo-600 hover:text-indigo-900">Edit Profile</a>
                            </div>
                        </div>

                        <!-- Orders Card -->
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold mb-4">Recent Orders</h3>
                            <div class="space-y-2">
                                @php
                                    $recentOrders = Auth::guard('customer')->user()->sales()->latest()->take(5)->get();
                                @endphp
                                @if($recentOrders->count() > 0)
                                    @foreach($recentOrders as $order)
                                        <div class="border-b pb-2">
                                            <p><span class="font-medium">Order #:</span> {{ $order->reference }}</p>
                                            <p><span class="font-medium">Date:</span> {{ $order->date->format('M d, Y') }}</p>
                                            <p><span class="font-medium">Status:</span> {{ ucfirst($order->status) }}</p>
                                        </div>
                                    @endforeach
                                @else
                                    <p>No recent orders</p>
                                @endif
                            </div>
                        </div>

                        <!-- Account Status Card -->
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold mb-4">Account Status</h3>
                            <div class="space-y-2">
                                <p><span class="font-medium">Status:</span>
                                    <span class="px-2 py-1 rounded-full text-sm {{ Auth::guard('customer')->user()->status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                                        {{ Auth::guard('customer')->user()->status ? 'Active' : 'Inactive' }}
                                    </span>
                                </p>
                                <p><span class="font-medium">Member Since:</span> {{ Auth::guard('customer')->user()->created_at->format('M d, Y') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
