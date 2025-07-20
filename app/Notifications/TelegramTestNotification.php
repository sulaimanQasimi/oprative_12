<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\Telegram\TelegramMessage;
use NotificationChannels\Telegram\TelegramChannel;
use App\Services\TelegramService;
    
class TelegramTestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $message = "Hello there!",
        public ?int $chatId = null
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [TelegramChannel::class];
    }

    /**
     * Get the telegram representation of the notification.
     */
    public function toTelegram(object $notifiable): TelegramMessage
    {
        $message = TelegramMessage::create()
            ->content($this->message)
            ->line("Your invoice has been *PAID*")
            ->line("Sent at: " . now()->format('Y-m-d H:i:s'));

        // If chat ID is provided, use it, otherwise use the notifiable's telegram chat ID
        if ($this->chatId) {
            $message->to($this->chatId);
        }

        return $message;
    }

    /**
     * Send the notification using the queue system.
     */
    public function sendNow(object $notifiable): void
    {
        $telegramService = app(TelegramService::class);
        $chatId = $this->chatId ?? $notifiable->routeNotificationForTelegram();
        
        if ($chatId) {
            $telegramService->queueMessage(
                $this->message . "\n\nYour invoice has been *PAID*\nSent at: " . now()->format('Y-m-d H:i:s'),
                $chatId,
                'Markdown'
            );
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => $this->message,
            'chat_id' => $this->chatId,
        ];
    }
} 