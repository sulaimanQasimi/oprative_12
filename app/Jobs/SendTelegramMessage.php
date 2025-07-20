<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendTelegramMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3; // Number of retry attempts
    public $timeout = 30; // Timeout in seconds
    public $backoff = [10, 30, 60]; // Retry delays in seconds

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $message,
        public string|int $chatId,
        public ?string $parseMode = 'Markdown',
        public ?array $keyboard = null,
        public ?string $botToken = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Get bot token from config or use provided one
            $botToken = $this->botToken ?? config('services.telegram-bot-api.token');
            
            if (!$botToken || $botToken === 'YOUR BOT TOKEN HERE') {
                throw new \Exception('Telegram bot token not configured');
            }

            // Prepare the request data
            $data = [
                'chat_id' => $this->chatId,
                'text' => $this->message,
                'parse_mode' => $this->parseMode,
            ];

            // Add keyboard if provided
            if ($this->keyboard) {
                $data['reply_markup'] = json_encode($this->keyboard);
            }

            // Send the message
            $response = Http::timeout($this->timeout)
                ->post("https://api.telegram.org/bot{$botToken}/sendMessage", $data);

            if (!$response->successful()) {
                $errorData = $response->json();
                throw new \Exception("Telegram API error: " . ($errorData['description'] ?? $response->body()));
            }

            // Log successful message
            Log::info('Telegram message sent successfully', [
                'chat_id' => $this->chatId,
                'message_length' => strlen($this->message),
                'response' => $response->json()
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send Telegram message', [
                'chat_id' => $this->chatId,
                'message' => $this->message,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts()
            ]);

            // Re-throw the exception to trigger retry
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Telegram message job failed permanently', [
            'chat_id' => $this->chatId,
            'message' => $this->message,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts()
        ]);
    }

    /**
     * Get the tags that should be assigned to the job.
     */
    public function tags(): array
    {
        return ['telegram', 'message', 'chat_id:' . $this->chatId];
    }
}
