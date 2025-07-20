<?php

namespace App\Observers;

use App\Models\PurchaseItem;
use App\Services\TelegramService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PurchaseItemObserver
{
    /**
     * Handle the PurchaseItem "created" event.
     */
    public function created(PurchaseItem $purchaseItem): void
    {
        $this->sendTelegramNotification($purchaseItem, 'created');
    }

    /**
     * Handle the PurchaseItem "updated" event.
     */
    public function updated(PurchaseItem $purchaseItem): void
    {
        $this->sendTelegramNotification($purchaseItem, 'updated');
    }

    /**
     * Handle the PurchaseItem "deleted" event.
     */
    public function deleted(PurchaseItem $purchaseItem): void
    {
        $this->sendTelegramNotification($purchaseItem, 'deleted');
    }

    /**
     * Handle the PurchaseItem "restored" event.
     */
    public function restored(PurchaseItem $purchaseItem): void
    {
        $this->sendTelegramNotification($purchaseItem, 'restored');
    }

    /**
     * Handle the PurchaseItem "force deleted" event.
     */
    public function forceDeleted(PurchaseItem $purchaseItem): void
    {
        $this->sendTelegramNotification($purchaseItem, 'force_deleted');
    }

    /**
     * Send Telegram notification for purchase item events
     */
    private function sendTelegramNotification(PurchaseItem $purchaseItem, string $event): void
    {
        try {
            $telegramService = app(TelegramService::class);
            
            // Get the authenticated user's chat ID
            $user = Auth::user();
            if (!$user || !$user->chat_id) {
                return; // No chat ID configured, skip notification
            }

            // Create message based on event type
            $message = $this->createMessage($purchaseItem, $event);
            
            // Queue the Telegram message
            $telegramService->queueMessage(
                $message,
                $user->chat_id,
                'Markdown'
            );

        } catch (\Exception $e) {
            // Log error but don't throw to avoid breaking the main operation
            Log::error('Failed to send Telegram notification for purchase item', [
                'purchase_item_id' => $purchaseItem->id,
                'purchase_id' => $purchaseItem->purchase_id,
                'event' => $event,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Create message content based on event type
     */
    private function createMessage(PurchaseItem $purchaseItem, string $event): string
    {
        $eventMessages = [
            'created' => '🆕 آیتم خرید جدید اضافه شد',
            'updated' => '✏️ آیتم خرید بروزرسانی شد',
            'deleted' => '🗑️ آیتم خرید حذف شد',
            'restored' => '🔄 آیتم خرید بازیابی شد',
            'force_deleted' => '💥 آیتم خرید به طور کامل حذف شد'
        ];

        $eventText = $eventMessages[$event] ?? 'تغییر در آیتم خرید';
        
        // Load relationships to avoid N+1 queries
        $purchaseItem->load(['purchase.supplier', 'purchase.currency', 'purchase.warehouse', 'product.unit']);
        
        $message = "*{$eventText}*\n\n";
        $message .= "🛍️ محصول: `" . ($purchaseItem->product?->name ?? 'نامشخص') . "`\n";
        $message .= "📦 کد محصول: `" . ($purchaseItem->product?->barcode ?? 'نامشخص') . "`\n";
        $message .= "📊 تعداد: `" . ($purchaseItem?->quantity / $purchaseItem?->unit_amount) . "`\n";
        $message .= "💰 قیمت واحد: `{$purchaseItem->price}`\n";
        $message .= "💵 قیمت کل: `{$purchaseItem->total_price}`\n";
        
        // Purchase information
        $message .= "*اطلاعات فاکتور:*\n";
        $message .= "📋 شماره فاکتور: `" . ($purchaseItem->purchase?->invoice_number ?? 'نامشخص') . "`\n";
        $message .= "👤 تامین کننده: `" . ($purchaseItem->purchase?->supplier?->name ?? 'نامشخص') . "`\n";
        $message .= "📦 انبار: `" . ($purchaseItem->purchase?->warehouse?->name ?? 'نامشخص') . "`\n";
        $message .= "💱 ارز: `" . ($purchaseItem->purchase?->currency?->name ?? 'نامشخص') . "`\n";
        $message .= "📊 وضعیت فاکتور: `" . ($purchaseItem->purchase?->status ?? 'نامشخص') . "`\n\n";
        
        $message .= "🕐 زمان: " . now()->format('Y-m-d H:i:s');

        return $message;
    }
}
