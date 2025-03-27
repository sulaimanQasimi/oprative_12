<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CustomerResource\Pages;
use App\Models\Customer;
use App\Filament\Resources\CustomerResource\Forms\CustomerResourceForm;
use App\Filament\Resources\CustomerResource\Tables\CustomerResourceTable;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Pages\SubNavigationPosition;
use Filament\Tables\Table;

/**
 * Class CustomerResource
 *
 * @package App\Filament\Resources
 */
class CustomerResource extends Resource
{
    /**
     * The model class associated with this resource.
     *
     * @var string|null
     */
    protected static ?string $model = Customer::class;

    /**
     * The position of the sub-navigation.
     *
     * @var SubNavigationPosition
     */
    protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::Top;

    /**
     * The navigation icon for this resource.
     *
     * @var string|null
     */
    protected static ?string $navigationIcon = 'heroicon-o-users';

    /**
     * The navigation group for this resource.
     *
     * @var string|null
     */
    protected static ?string $navigationGroup = 'Sales';

    /**
     * The navigation sort order for this resource.
     *
     * @var int|null
     */
    protected static ?int $navigationSort = 1;

    /**
     * Get the plural label for this resource.
     *
     * @return string
     */
    public static function getPluralModelLabel(): string
    {
        return __('Customers');
    }

    /**
     * Get the singular label for this resource.
     *
     * @return string
     */
    public static function getModelLabel(): string
    {
        return __('Customer');
    }

    /**
     * Define the form schema for this resource.
     *
     * @param Form $form
     * @return Form
     */
    public static function form(Form $form): Form
    {
        return CustomerResourceForm::form($form);
    }

    /**
     * Define the table schema for this resource.
     *
     * @param Table $table
     * @return Table
     */
    public static function table(Table $table): Table
    {
        return CustomerResourceTable::table($table);
    }

    /**
     * Define the relationships for this resource.
     *
     * @return array
     */
    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    /**
     * Define the pages for this resource.
     *
     * @return array
     */
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCustomers::route('/'),
            'create' => Pages\CreateCustomer::route('/create'),
            'view' => Pages\ViewCustomer::route('/{record}'),
            'edit' => Pages\EditCustomer::route('/{record}/edit'),
            'income' => Pages\CustomerIncome::route('/{record}/income'),
            'outcome' => Pages\CustomerOutcome::route('/{record}/outcome'),
            'users' => Pages\ListCustomerUsers::route('/{record}/users'),
        ];
    }

    /**
     * Define the sub-navigation items for this resource.
     *
     * @param \Filament\Resources\Pages\Page $page
     * @return array
     */
    public static function getRecordSubNavigation(\Filament\Resources\Pages\Page $page): array
    {
        return $page->generateNavigationItems([
            Pages\ViewCustomer::class,
            Pages\EditCustomer::class,
            Pages\CustomerIncome::class,
            Pages\CustomerOutcome::class,
            Pages\ListCustomerUsers::class,
        ]);
    }
}
