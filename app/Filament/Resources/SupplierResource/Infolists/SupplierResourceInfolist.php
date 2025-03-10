<?php

namespace App\Filament\Resources\SupplierResource\Infolists;

use Filament\Infolists\Infolist;

class SupplierResourceInfolist
{
    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                \Filament\Infolists\Components\Section::make('Supplier Details')
                    ->schema([
                        \Filament\Infolists\Components\Grid::make(2)
                            ->schema([
                                \Filament\Infolists\Components\ImageEntry::make('image')
                                    ->label('Image')
                                    ->translateLabel(),
                                \Filament\Infolists\Components\TextEntry::make('name')
                                    ->label('Company Name')
                                    ->translateLabel()
                                    ->icon('heroicon-o-user')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('contact_name')
                                    ->label('Contact Name')
                                    ->translateLabel()
                                    ->icon('heroicon-o-user')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('phone')
                                    ->label('Phone')
                                    ->translateLabel()
                                    ->icon('heroicon-o-phone')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('email')
                                    ->label('Email')
                                    ->translateLabel()
                                    ->icon('heroicon-o-envelope')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('address')
                                    ->label('Address')
                                    ->translateLabel()
                                    ->icon('heroicon-o-map')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('city')
                                    ->label('City')
                                    ->translateLabel()
                                    ->icon('heroicon-o-building-office')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('state')
                                    ->label('State')
                                    ->translateLabel()
                                    ->icon('heroicon-o-building-office')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('country')
                                    ->label('Country')
                                    ->translateLabel()
                                    ->icon('heroicon-o-globe-alt')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('postal_code')
                                    ->label('Postal Code')
                                    ->translateLabel()
                                    ->icon('heroicon-o-envelope')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('id_number')
                                    ->label('ID Number')
                                    ->translateLabel()
                                    ->icon('heroicon-o-identification')
                                    ->iconPosition('before'),
                            ]),
                    ]),
            ]);
    }
}