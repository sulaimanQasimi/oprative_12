<?php

namespace App\Observers;

use App\Models\Unit;
use App\Services\TelegramService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UnitObserver
{
    /**
     * Handle the Unit "created" event.
     */
    public function created(Unit $unit): void
    {
        $this->sendTelegramNotification($unit, 'created');
    }

    /**
     * Handle the Unit "updated" event.
     */
    public function updated(Unit $unit): void
    {
        $this->sendTelegramNotification($unit, 'updated');
    }

    /**
     * Handle the Unit "deleted" event.
     */
    public function deleted(Unit $unit): void
    {
        $this->sendTelegramNotification($unit, 'deleted');
    }

    /**
     * Handle the Unit "restored" event.
     */
    public function restored(Unit $unit): void
    {
        $this->sendTelegramNotification($unit, 'restored');
    }

    /**
     * Handle the Unit "force deleted" event.
     */
    public function forceDeleted(Unit $unit): void
    {
        $this->sendTelegramNotification($unit, 'force_deleted');
    }

    /**
     * Send Telegram notification for unit events
     */
    private function sendTelegramNotification(Unit $unit, string $event): void
    {
        try {
            $telegramService = app(TelegramService::class);
            
            // Get the authenticated user's chat ID
            $user = Auth::user();
            if (!$user || !$user->chat_id) {
                return; // No chat ID configured, skip notification
            }

            // Create message based on event type
            $message = $this->createMessage($unit, $event);
            
            // Queue the Telegram message
            $telegramService->queueMessage(
                $message,
                $user->chat_id,
                'Markdown'
            );

        } catch (\Exception $e) {
            // Log error but don't throw to avoid breaking the main operation
            Log::error('Failed to send Telegram notification for unit', [
                'unit_id' => $unit->id,
                'unit_name' => $unit->name,
                'event' => $event,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Create message content based on event type
     */
    private function createMessage(Unit $unit, string $event): string
    {
        $eventMessages = [
            'created' => '🆕 واحد اندازه گیری جدید اضافه شد',
            'updated' => '✏️ واحد اندازه گیری بروزرسانی شد',
            'deleted' => '🗑️ واحد اندازه گیری حذف شد',
            'restored' => '🔄 واحد اندازه گیری بازیابی شد',
            'force_deleted' => '💥 واحد اندازه گیری به طور کامل حذف شد'
        ];

        $eventText = $eventMessages[$event] ?? 'تغییر در واحد اندازه گیری';
        
        $message = "*{$eventText}*\n\n";
        $message .= "📏 نام واحد: `{$unit->name}`\n";
        $message .= "🏷️ کد واحد: `{$unit->code}`\n";
        $message .= "🆔 شناسه: `{$unit->id}`\n";
        $message .= "📅 تاریخ ایجاد: `" . $unit->created_at->format('Y-m-d H:i:s') . "`\n";
        
        if ($unit->updated_at && $unit->updated_at != $unit->created_at) {
            $message .= "🔄 آخرین بروزرسانی: `" . $unit->updated_at->format('Y-m-d H:i:s') . "`\n";
        }
        
        $message .= "\n🕐 زمان رویداد: " . now()->format('Y-m-d H:i:s');

        return $message;
    }
}
