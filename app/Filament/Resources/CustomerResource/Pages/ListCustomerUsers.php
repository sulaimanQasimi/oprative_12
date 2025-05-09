<?php

namespace App\Filament\Resources\CustomerResource\Pages;

use App\Filament\Resources\CustomerResource;
use App\Models\CustomerUser;
use Filament\Forms\Form;
use Filament\Forms;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Eloquent\Model;
use Filament\Notifications\Notification;

class ListCustomerUsers extends ManageRelatedRecords
{
    protected static string $resource = CustomerResource::class;

    protected static string $relationship = 'users';

    protected static ?string $navigationIcon = 'heroicon-o-arrow-trending-up';

    protected static ?string $modelLabel = 'User';

    protected static ?string $pluralModelLabel = 'Users';

    public function getTitle(): string
    {
        return trans("User");
    }

    public static function getNavigationLabel(): string
    {
        return __("User");
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255)
                    ->unique(table: CustomerUser::class, ignoreRecord: true),
                Forms\Components\TextInput::make('password')
                    ->password()
                    ->required()
                    ->maxLength(255)
                    ->dehydrateStateUsing(fn($state) => Hash::make($state)),
                Forms\Components\CheckboxList::make('permissions')
                    ->relationship('permissions', 'name', fn($query) => $query->where('guard_name', 'customer_user'))
                    ->columns(2)
                    ->searchable()
                    ->required()
                    ->getOptionLabelFromRecordUsing(fn($record) => __(Str::after($record->name, 'customer.')))
                    ->label(__('Permissions')),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(CustomerUser::query())
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('customer.name')
                    ->label('Customer')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('permissions.name')
                    ->label(__('Permissions'))
                    ->formatStateUsing(fn ($state) => __(Str::after($state, 'customer.')))
                    ->badge()
                    ->color('success')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email_verified_at')
                    ->dateTime()
                    ->sortable()
                    ->label(__('Verified At')),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label('Add User')
                    ->modalHeading('Add New User'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\Action::make('verify')
                    ->label(__('Verify'))
                    ->icon('heroicon-o-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (CustomerUser $record) => $record->email_verified_at === null)
                    ->action(function (CustomerUser $record) {
                        $record->email_verified_at = now();
                        $record->save();

                        Notification::make()
                            ->title(__('User verified successfully'))
                            ->success()
                            ->send();
                    }),
                Tables\Actions\Action::make('unverify')
                    ->label(__('Unverify'))
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn (CustomerUser $record) => $record->email_verified_at !== null)
                    ->action(function (CustomerUser $record) {
                        $record->email_verified_at = null;
                        $record->save();

                        Notification::make()
                            ->title(__('User unverified successfully'))
                            ->success()
                            ->send();
                    }),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('verifySelected')
                        ->label(__('Verify Selected'))
                        ->icon('heroicon-o-check-badge')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            $count = 0;
                            foreach ($records as $record) {
                                if ($record->email_verified_at === null) {
                                    $record->email_verified_at = now();
                                    $record->save();
                                    $count++;
                                }
                            }

                            Notification::make()
                                ->title(__(':count users verified successfully', ['count' => $count]))
                                ->success()
                                ->send();
                        }),
                ]),
            ]);
    }
}