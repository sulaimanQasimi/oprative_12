<?php

use App\Models\Warehouse;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\SecuGenFingerprintController;
use App\Http\Controllers\PublicAttendanceRequestController;
use App\Repositories\Customer\CustomerRepository;
use App\Repositories\Warehouse\WarehouseRepository;
use App\Http\Controllers\Warehouse\ReportController;
use NotificationChannels\Telegram\TelegramContact;
use NotificationChannels\Telegram\TelegramMessage;
use NotificationChannels\Telegram\TelegramUpdates;

// Landing page route
Route::get('/', HomeController::class);

// Public Attendance Request Routes (No Authentication Required)
Route::prefix('attendance-request')->group(function () {
    Route::get('/', [PublicAttendanceRequestController::class, 'create'])->name('public.attendance-request.create');
    Route::post('/', [PublicAttendanceRequestController::class, 'store'])->name('public.attendance-request.store');
    Route::get('/success/{track_number}', [PublicAttendanceRequestController::class, 'success'])->name('public.attendance-request.success');
    Route::get('/track', [PublicAttendanceRequestController::class, 'track'])->name('public.attendance-request.track');
    Route::post('/track', [PublicAttendanceRequestController::class, 'getTrackingInfo'])->name('public.attendance-request.tracking-info');
    Route::post('/employee-info', [PublicAttendanceRequestController::class, 'getEmployeeInfo'])->name('public.attendance-request.employee-info');
});

// Inventory Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/inventory/dashboard/{warehouse}', \App\Livewire\Inventory\Dashboard::class)->name('inventory.dashboard');

    // Employee Management Routes
    Route::resource('employees', EmployeeController::class);

    // Fingerprint Management Routes
    Route::resource('fingerprints', SecuGenFingerprintController::class);
    Route::get('employees/{employee}/fingerprints', [SecuGenFingerprintController::class, 'byEmployee'])
        ->name('employees.fingerprints');
});

// Register repository routes
CustomerRepository::registerRoutes();
WarehouseRepository::registerRoutes();
require __DIR__ . '/purchase.php';
Route::redirect('/login', '/')->name('login');

// Include admin routes
Route::prefix('adminpanel')
    ->group(function () {
        require __DIR__ . '/admin.php';
    });

Route::get('/test', function () {
    try {

        // Response is an array of updates.
        $updates = TelegramUpdates::create()

            // (Optional). Get's the latest update.
            // NOTE: All previous updates will be forgotten using this method.
            // ->latest()

            // (Optional). Limit to 2 updates (By default, updates starting with the earliest unconfirmed update are returned).
            ->limit(2)

            // (Optional). Add more params to the request.
            ->options([
                'timeout' => 0,
            ])
            ->get();

        if ($updates['ok']) {
            // Chat ID
            $chatId = $updates['result'][0]['message']['chat']['id'];
        }
dump($updates);
        // Method 1: Using TelegramMessage directly (requires proper configuration)
        $message = TelegramMessage::create()
            ->to(auth()->user()->chat_id)
            ->content("Hello there!")
            ->line("Your invoice has been *PAID*")
            // ->button('View Invoice', 'https://www.google.com')
            ->keyboard('test', 2,true,true)
            ;

        // Send the message
        $message->send();

        return response()->json(['success' => true, 'message' => 'Telegram message sent successfully']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

// Alternative method using HTTP client directly
Route::get('/test-telegram-direct', function () {
    try {
        $botToken = "7360745986:AAEb0CbWFwAwEARikccBFGPeEScmELf1A14";
        // You need to replace this with your actual user chat ID, not the bot ID
        // The bot ID (7360745986) cannot receive messages from other bots
        $chatId = 7360745986; // This should be YOUR user chat ID, not the bot ID
        $message = "Hello there!\nYour invoice has been *PAID*";

        if ($botToken === 'YOUR BOT TOKEN HERE') {
            return response()->json(['success' => false, 'error' => 'Telegram bot token not configured'], 400);
        }

        $response = Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
            'chat_id' => $chatId,
            'text' => $message,
            'parse_mode' => 'Markdown'
        ]);

        if ($response->successful()) {
            return response()->json(['success' => true, 'message' => 'Telegram message sent successfully']);
        } else {
            return response()->json(['success' => false, 'error' => $response->body()], 500);
        }
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

// Test using Laravel notification system
Route::get('/test-telegram-notification', function () {
    try {
        // Create a dummy notifiable object
        $notifiable = new class {
            use \Illuminate\Notifications\Notifiable;

            public function routeNotificationForTelegram()
            {
                return 7360745986; // Your chat ID
            }
        };

        // Send the notification
        $notifiable->notify(new \App\Notifications\TelegramTestNotification(
            message: "Test notification from Laravel!",
            chatId: 7360745986
        ));

        return response()->json(['success' => true, 'message' => 'Telegram notification sent successfully']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

// Route to get your chat ID
Route::get('/get-telegram-chat-id', function () {
    try {
        $botToken = "7360745986:AAEb0CbWFwAwEARikccBFGPeEScmELf1A14";

        // Get updates from Telegram API
        $response = Http::get("https://api.telegram.org/bot{$botToken}/getUpdates");

        if ($response->successful()) {
            $data = $response->json();

            if ($data['ok'] && !empty($data['result'])) {
                $updates = $data['result'];
                $chatIds = [];

                foreach ($updates as $update) {
                    if (isset($update['message']['chat']['id'])) {
                        $chatId = $update['message']['chat']['id'];
                        $chatType = $update['message']['chat']['type'];
                        $firstName = $update['message']['chat']['first_name'] ?? 'Unknown';
                        $lastName = $update['message']['chat']['last_name'] ?? '';
                        $username = $update['message']['chat']['username'] ?? 'No username';

                        $chatIds[] = [
                            'chat_id' => $chatId,
                            'type' => $chatType,
                            'name' => trim($firstName . ' ' . $lastName),
                            'username' => $username,
                            'is_bot' => $update['message']['chat']['is_bot'] ?? false
                        ];
                    }
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Found chat IDs',
                    'chat_ids' => $chatIds,
                    'instructions' => 'Use the chat_id from a user (not a bot) to send messages'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No messages found. Send a message to your bot first.',
                    'instructions' => [
                        '1. Open Telegram and search for your bot',
                        '2. Start a conversation with your bot',
                        '3. Send any message to the bot',
                        '4. Visit this route again to get your chat ID'
                    ]
                ]);
            }
        } else {
            return response()->json([
                'success' => false,
                'error' => 'Failed to get updates from Telegram',
                'response' => $response->body()
            ], 500);
        }
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

// Test sending Telegram notification to a specific user
Route::get('/test-user-telegram/{userId}', function ($userId) {
    try {
        $user = \App\Models\User::findOrFail($userId);
        
        if (!$user->hasTelegramChatId()) {
            return response()->json([
                'success' => false,
                'error' => 'User does not have a Telegram chat ID configured'
            ], 400);
        }
        
        // Send notification to the user
        $user->notify(new \App\Notifications\TelegramTestNotification(
            message: "Hello {$user->name}! This is a test notification from your Laravel application.",
            chatId: $user->chat_id
        ));
        
        return response()->json([
            'success' => true,
            'message' => "Telegram notification sent to {$user->name}",
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'chat_id' => $user->chat_id
            ]
        ]);
        
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

// Test sending Telegram notification to all users with chat IDs
Route::get('/test-all-users-telegram', function () {
    try {
        $users = \App\Models\User::whereNotNull('chat_id')->get();
        
        if ($users->isEmpty()) {
            return response()->json([
                'success' => false,
                'error' => 'No users found with Telegram chat IDs configured'
            ], 400);
        }
        
        $sentCount = 0;
        $errors = [];
        
        foreach ($users as $user) {
            try {
                $user->notify(new \App\Notifications\TelegramTestNotification(
                    message: "Hello {$user->name}! This is a bulk test notification from your Laravel application.",
                    chatId: $user->chat_id
                ));
                $sentCount++;
            } catch (\Exception $e) {
                $errors[] = "Failed to send to {$user->name}: " . $e->getMessage();
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => "Sent notifications to {$sentCount} users",
            'total_users' => $users->count(),
            'sent_count' => $sentCount,
            'errors' => $errors
        ]);
        
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});
