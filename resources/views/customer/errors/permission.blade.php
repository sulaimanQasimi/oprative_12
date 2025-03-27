@extends('customer.layouts.app')

@section('content')
<div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div class="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>

        <h1 class="text-2xl font-bold text-gray-800 mb-3">@lang('Access Denied')</h1>

        <p class="text-gray-600 mb-6">
            @lang('Sorry, you do not have permission to access this page. Please contact your administrator if you believe this is an error.')
        </p>

        <div class="flex justify-center space-x-4">
            <a href="{{ route('customer.dashboard') }}" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                @lang('Back to Dashboard')
            </a>
        </div>
    </div>
</div>
@endsection
