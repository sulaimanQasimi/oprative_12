<?php

namespace App\Services;

use App\Jobs\SendTelegramMessage;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    /**
     * Send a Telegram message immediately (synchronous)
     */
    public function sendMessage(
        string $message,
        string|int $chatId,
        ?string $parseMode = 'Markdown',
        ?array $keyboard = null,
        ?string $botToken = null
    ): bool {
        try {
            $job = new SendTelegramMessage($message, $chatId, $parseMode, $keyboard, $botToken);
            $job->handle();
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send Telegram message synchronously', [
                'chat_id' => $chatId,
                'message' => $message,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Queue a Telegram message for later sending (asynchronous)
     */
    public function queueMessage(
        string $message,
        string|int $chatId,
        ?string $parseMode = 'Markdown',
        ?array $keyboard = null,
        ?string $botToken = null,
        ?string $queue = 'telegram'
    ): void {
        SendTelegramMessage::dispatch($message, $chatId, $parseMode, $keyboard, $botToken)
            ->onQueue($queue);
    }

    /**
     * Send message to multiple chat IDs
     */
    public function sendToMultiple(
        string $message,
        array $chatIds,
        ?string $parseMode = 'Markdown',
        ?array $keyboard = null,
        ?string $botToken = null,
        bool $useQueue = true,
        ?string $queue = 'telegram'
    ): array {
        $results = [];
        
        foreach ($chatIds as $chatId) {
            try {
                if ($useQueue) {
                    $this->queueMessage($message, $chatId, $parseMode, $keyboard, $botToken, $queue);
                    $results[$chatId] = ['status' => 'queued', 'message' => 'Message queued successfully'];
                } else {
                    $success = $this->sendMessage($message, $chatId, $parseMode, $keyboard, $botToken);
                    $results[$chatId] = [
                        'status' => $success ? 'sent' : 'failed',
                        'message' => $success ? 'Message sent successfully' : 'Failed to send message'
                    ];
                }
            } catch (\Exception $e) {
                $results[$chatId] = [
                    'status' => 'error',
                    'message' => $e->getMessage()
                ];
            }
        }
        
        return $results;
    }

    /**
     * Send message to all users with chat IDs
     */
    public function sendToAllUsers(
        string $message,
        ?string $parseMode = 'Markdown',
        ?array $keyboard = null,
        ?string $botToken = null,
        bool $useQueue = true,
        ?string $queue = 'telegram'
    ): array {
        $users = \App\Models\User::whereNotNull('chat_id')->get();
        $chatIds = $users->pluck('chat_id')->toArray();
        
        return $this->sendToMultiple($message, $chatIds, $parseMode, $keyboard, $botToken, $useQueue, $queue);
    }

    /**
     * Create a keyboard markup
     */
    public function createKeyboard(array $buttons, bool $resize = true, bool $oneTime = false): array
    {
        return [
            'keyboard' => $buttons,
            'resize_keyboard' => $resize,
            'one_time_keyboard' => $oneTime
        ];
    }

    /**
     * Create an inline keyboard
     */
    public function createInlineKeyboard(array $buttons): array
    {
        return [
            'inline_keyboard' => $buttons
        ];
    }

    /**
     * Validate chat ID format
     */
    public function isValidChatId(string|int $chatId): bool
    {
        // Telegram chat IDs are typically 9-10 digits for users
        // and can be negative for groups/channels
        return is_numeric($chatId) && strlen((string)$chatId) >= 9;
    }

    /**
     * Get queue status for a specific job
     */
    public function getQueueStatus(): array
    {
        // This would require additional implementation to check queue status
        // For now, return basic info
        return [
            'queue_driver' => config('queue.default'),
            'queue_connection' => config('queue.connections.' . config('queue.default') . '.driver'),
        ];
    }
} 