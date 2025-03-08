@php
    $account = config('account.model')::find($getState());
    $tenent = \Filament\Facades\Filament::getTenant()?->id;
    $panel = \Filament\Facades\Filament::getCurrentPanel()->getId() ?? null;
@endphp

@if($account)
    <a  href="{{ $tenent ? route('filament.'.$panel.'.resources.accounts.edit', ['tenant' => $tenent, 'record' => $account->id]) : route('filament.'.$panel.'.resources.accounts.edit', ['record' => $account->id]) }}" class="flex justify-start gap-2 py-4">
        <div class="flex flex-col items-center justify-center">
            <x-filament::avatar
                :src="$account->getFilamentAvatarUrl()?: 'https://ui-avatars.com/api/?name='.$account->name.'&color=FFFFFF&background=020617'"
                :alt="$account->name"
            />
        </div>
        <div class="flex flex-col">
            <div class="font-meduim text-md">
                {{ $account->name }}
            </div>
            <div class="text-xs text-gray-400">
                {{ $account->loginBy === 'email' ? $account->email : $account->phone }}
            </div>
        </div>
    </a>
@endif
