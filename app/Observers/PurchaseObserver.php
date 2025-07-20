<?php

namespace App\Observers;

use App\Models\Purchase;
use App\Services\TelegramService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PurchaseObserver
{
    /**
     * Handle the Purchase "created" event.
     */
    public function created(Purchase $purchase): void
    {
        $this->sendTelegramNotification($purchase, 'created');
    }

    /**
     * Handle the Purchase "updated" event.
     */
    public function updated(Purchase $purchase): void
    {
        $this->sendTelegramNotification($purchase, 'updated');
    }

    /**
     * Handle the Purchase "deleted" event.
     */
    public function deleted(Purchase $purchase): void
    {
        $this->sendTelegramNotification($purchase, 'deleted');
    }

    /**
     * Handle the Purchase "restored" event.
     */
    public function restored(Purchase $purchase): void
    {
        $this->sendTelegramNotification($purchase, 'restored');
    }

    /**
     * Handle the Purchase "force deleted" event.
     */
    public function forceDeleted(Purchase $purchase): void
    {
        $this->sendTelegramNotification($purchase, 'force_deleted');
    }

    /**
     * Send Telegram notification for purchase events
     */
    private function sendTelegramNotification(Purchase $purchase, string $event): void
    {
        try {
            $telegramService = app(TelegramService::class);
            
            // Get the authenticated user's chat ID
            $user = Auth::user();
            if (!$user || !$user->chat_id) {
                return; // No chat ID configured, skip notification
            }

            // Create message based on event type
            $message = $this->createMessage($purchase, $event);
            
            // Queue the Telegram message
            $telegramService->queueMessage(
                $message,
                $user->chat_id,
                'Markdown'
            );

        } catch (\Exception $e) {
            // Log error but don't throw to avoid breaking the main operation
            Log::error('Failed to send Telegram notification for purchase', [
                'purchase_id' => $purchase->id,
                'event' => $event,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Create message content based on event type
     */
    private function createMessage(Purchase $purchase, string $event): string
    {
        $eventMessages = [
            'created' => '🆕 خرید جدید اضافه شد',
            'updated' => '✏️ خرید بروزرسانی شد',
            'deleted' => '🗑️ خرید حذف شد',
            'restored' => '🔄 خرید بازیابی شد',
            'force_deleted' => '💥 خرید به طور کامل حذف شد'
        ];

        $eventText = $eventMessages[$event] ?? 'تغییر در خرید';
        
        $message = "*{$eventText}*\n\n";
        $message .= "📋 شماره فاکتور: `{$purchase->invoice_number}`\n";
        $message .= "📅 تاریخ فاکتور: `{$purchase->invoice_date->format('Y-m-d')}`\n";
        $message .= "💰 ارزش فاکتور: `{$purchase->currency_rate} {$purchase->currency?->name}`\n";
        $message .= "📦 انبار: `{$purchase->warehouse?->name}`\n";
        $message .= "👤 تامین کننده: `{$purchase->supplier?->name}`\n";
        $message .= "📊 وضعیت: `{$purchase->status}`\n";
        $message .= "💵 مبلغ کل: `{$purchase->total_amount}`\n";
        $message .= "💳 مبلغ پرداخت شده: `{$purchase->paid_amount}`\n";
        $message .= "⚖️ مبلغ باقی مانده: `{$purchase->due_amount}`\n\n";
        $message .= "🕐 زمان: " . now()->format('Y-m-d H:i:s');

        return $message;
    }
}
