<?php

namespace App\Pos\Account\Filament\Resources;

use Filament\Notifications\Notification;
use App\Pos\Account\Facades\FilamentAccounts;
use App\Pos\Account\Filament\Resources\AccountResource\Forms\AccountsForm;
use App\Pos\Account\Filament\Resources\AccountResource\Pages;
use App\Pos\Account\Filament\Resources\AccountResource\RelationManagers;
use App\Pos\Account\Filament\Resources\AccountResource\Releations\AccountReleations;
use App\Pos\Account\Filament\Resources\AccountResource\Tables\AccountsTable;
use App\Pos\Account\Models\Account;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use TomatoPHP\FilamentAlerts\Models\NotificationsTemplate;
use TomatoPHP\FilamentAlerts\Services\SendNotification;
use TomatoPHP\FilamentIcons\Components\IconPicker;
use TomatoPHP\FilamentTypes\Components\TypeColumn;
use TomatoPHP\FilamentTypes\Models\Type;
use function Laravel\Prompts\confirm;

class AccountResource extends Resource
{
    protected static ?string $navigationIcon = 'heroicon-o-user-circle';

    protected static bool $softDelete = true;

    protected static ?int $navigationSort = 1;

    /**
     * @return string|null
     */
    public static function getModel(): string
    {
        return config('account.model');
    }

    public static function getNavigationGroup(): ?string
    {
        return trans('account::messages.group');
    }

    public static function getNavigationLabel(): string
    {
        return trans('account::messages.accounts.label');
    }

    public static function getPluralLabel(): ?string
    {
        return trans('account::messages.accounts.label');
    }

    public static function getLabel(): ?string
    {
        return trans('account::messages.accounts.single');
    }

    public static function form(Form $form): Form
    {
        return config('account.accounts.form') ? config('account.accounts.form')::make($form) : AccountsForm::make($form);
    }

    public static function table(Table $table): Table
    {
        return config('account.accounts.table') ? config('account.accounts.table')::make($table) : AccountsTable::make($table);
    }

    public static function getRelations(): array
    {
        return config('account.relations') ? config('account.relations')::get() :  AccountReleations::get();
    }

    public static function getPages(): array
    {
        return config('account.accounts.pages') ? config('account.accounts.pages')::routes() : [
            'index' => \App\Pos\Account\Filament\Resources\AccountResource\Pages\ListAccounts::route('/'),
            'edit' => \App\Pos\Account\Filament\Resources\AccountResource\Pages\EditAccount::route('/{record}/edit')
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
