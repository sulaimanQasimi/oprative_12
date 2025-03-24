<form method="post" action="{{ route('customer.profile.notifications') }}" class="space-y-6">
    @csrf
    @method('patch')

    <!-- Email Notifications -->
    <div class="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-6 hover:from-violet-100 hover:to-indigo-100 transition-all duration-300">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="bg-gradient-to-br from-violet-100 to-indigo-100 p-3 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <div class="text-right">
                    <h4 class="text-lg font-medium text-gray-900">@lang('Email Notifications')</h4>
                    <p class="text-gray-500">@lang('Receive notifications about your orders and account updates.')</p>
                </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="email_notifications" value="1" class="sr-only peer" {{ old('email_notifications', auth()->user()->email_notifications) ? 'checked' : '' }}>
                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
        </div>
    </div>

    <!-- SMS Notifications -->
    <div class="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-6 hover:from-violet-100 hover:to-indigo-100 transition-all duration-300">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="bg-gradient-to-br from-violet-100 to-indigo-100 p-3 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
                <div class="text-right">
                    <h4 class="text-lg font-medium text-gray-900">@lang('SMS Notifications')</h4>
                    <p class="text-gray-500">@lang('Receive order updates and promotions via SMS.')</p>
                </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="sms_notifications" value="1" class="sr-only peer" {{ old('sms_notifications', auth()->user()->sms_notifications) ? 'checked' : '' }}>
                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
        </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end">
        <button type="submit" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300 transform hover:scale-[1.02]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            @lang('Save Changes')
        </button>
    </div>
</form> 