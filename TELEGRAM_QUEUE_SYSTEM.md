# Telegram Queue System Implementation

This document explains the implementation of a queue-based Telegram messaging system in the Laravel application.

## Overview

The system provides a robust, queue-based approach to sending Telegram messages with automatic retry mechanisms, error handling, and support for bulk messaging.

## Components

### 1. SendTelegramMessage Job (`app/Jobs/SendTelegramMessage.php`)

A Laravel job that handles the actual sending of Telegram messages.

**Features:**
- Automatic retry with exponential backoff (3 attempts)
- Timeout handling (30 seconds)
- Error logging and failure handling
- Support for custom keyboards and parse modes
- Job tagging for better monitoring

**Usage:**
```php
SendTelegramMessage::dispatch(
    message: "Hello World!",
    chatId: "123456789",
    parseMode: "Markdown",
    keyboard: null,
    botToken: null
)->onQueue('telegram');
```

### 2. TelegramService (`app/Services/TelegramService.php`)

A service class that provides high-level methods for Telegram operations.

**Methods:**
- `sendMessage()` - Send message immediately (synchronous)
- `queueMessage()` - Queue message for later sending (asynchronous)
- `sendToMultiple()` - Send to multiple chat IDs
- `sendToAllUsers()` - Send to all users with chat IDs
- `createKeyboard()` - Create custom keyboards
- `createInlineKeyboard()` - Create inline keyboards
- `isValidChatId()` - Validate chat ID format

**Usage:**
```php
$telegramService = app(TelegramService::class);

// Queue a message
$telegramService->queueMessage(
    "Hello from Laravel!",
    "123456789",
    "Markdown"
);

// Send to all users
$telegramService->sendToAllUsers(
    "Bulk message to all users",
    "Markdown",
    null,
    null,
    true, // Use queue
    'telegram'
);
```

### 3. PurchaseObserver (`app/Observers/PurchaseObserver.php`)

An observer that automatically sends Telegram notifications when purchase events occur.

**Events Handled:**
- `created` - New purchase created
- `updated` - Purchase updated
- `deleted` - Purchase deleted
- `restored` - Purchase restored
- `forceDeleted` - Purchase force deleted

**Features:**
- Automatic notification sending
- Rich message formatting with emojis
- Error handling (doesn't break main operations)
- Uses authenticated user's chat ID

### 4. PurchaseItemObserver (`app/Observers/PurchaseItemObserver.php`)

An observer that automatically sends Telegram notifications when purchase item events occur.

**Events Handled:**
- `created` - New purchase item created
- `updated` - Purchase item updated
- `deleted` - Purchase item deleted
- `restored` - Purchase item restored
- `forceDeleted` - Purchase item force deleted

**Features:**
- Automatic notification sending for individual items
- Detailed product information in messages
- Purchase context information
- Rich message formatting with emojis
- Error handling (doesn't break main operations)
- Uses authenticated user's chat ID

### 5. Updated TelegramTestNotification

Enhanced notification class that implements `ShouldQueue` for queue support.

## Configuration

### Queue Configuration

The system uses Laravel's queue system. Configure in `config/queue.php`:

```php
'default' => env('QUEUE_CONNECTION', 'database'),
```

### Environment Variables

Add to your `.env` file:
```env
QUEUE_CONNECTION=database
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

## Usage Examples

### 1. Basic Message Sending

```php
use App\Services\TelegramService;

$telegramService = app(TelegramService::class);

// Queue a simple message
$telegramService->queueMessage(
    "Hello! This is a test message.",
    "123456789"
);
```

### 2. Message with Keyboard

```php
// Create a keyboard
$keyboard = $telegramService->createKeyboard([
    ['Button 1', 'Button 2'],
    ['Button 3', 'Button 4']
], true, false);

// Send message with keyboard
$telegramService->queueMessage(
    "Choose an option:",
    "123456789",
    "Markdown",
    $keyboard
);
```

### 3. Bulk Messaging

```php
// Send to multiple users
$chatIds = ['123456789', '987654321'];
$results = $telegramService->sendToMultiple(
    "Bulk notification message",
    $chatIds,
    "Markdown",
    null,
    null,
    true, // Use queue
    'telegram'
);
```

### 4. Automatic Purchase Notifications

The PurchaseObserver automatically sends notifications when purchases are created, updated, or deleted. No additional code needed.

### 5. Automatic Purchase Item Notifications

The PurchaseItemObserver automatically sends notifications when purchase items are created, updated, or deleted. This provides detailed information about individual products in purchases.

## Test Routes

The following test routes are available:

- `/test` - Test basic queue messaging
- `/test-purchase-observer` - Test purchase observer
- `/test-purchase-item-observer` - Test purchase item observer
- `/test-queue-telegram` - Test queue-based messaging
- `/test-queue-all-users` - Test bulk messaging to all users
- `/test-direct-telegram` - Test direct (synchronous) messaging
- `/test-telegram-keyboard` - Test keyboard functionality

## Queue Processing

To process queued messages, run:

```bash
# Process all queues
php artisan queue:work

# Process only telegram queue
php artisan queue:work --queue=telegram

# Process with specific connection
php artisan queue:work --connection=database
```

## Error Handling

The system includes comprehensive error handling:

1. **Job Retries**: Failed jobs are retried up to 3 times with exponential backoff
2. **Error Logging**: All errors are logged with context
3. **Graceful Degradation**: Observer errors don't break main operations
4. **Queue Monitoring**: Failed jobs are stored for later inspection

## Monitoring

### Check Queue Status

```php
$telegramService = app(TelegramService::class);
$status = $telegramService->getQueueStatus();
```

### View Failed Jobs

```bash
php artisan queue:failed
```

### Retry Failed Jobs

```bash
php artisan queue:retry all
```

## Best Practices

1. **Always use queues** for Telegram messages to avoid blocking user operations
2. **Set appropriate timeouts** for your use case
3. **Monitor failed jobs** regularly
4. **Use meaningful job tags** for better monitoring
5. **Handle errors gracefully** in observers
6. **Validate chat IDs** before sending messages

## Security Considerations

1. **Bot Token Security**: Store bot tokens in environment variables
2. **Chat ID Validation**: Validate chat IDs before sending messages
3. **Rate Limiting**: Be mindful of Telegram's rate limits
4. **Error Information**: Don't expose sensitive information in error messages

## Troubleshooting

### Common Issues

1. **Messages not sending**: Check queue worker is running
2. **Authentication errors**: Verify bot token is correct
3. **Chat ID errors**: Ensure chat ID is valid and user has started conversation with bot
4. **Queue not processing**: Check queue configuration and worker status

### Debug Commands

```bash
# Check queue status
php artisan queue:work --once

# View failed jobs
php artisan queue:failed

# Clear failed jobs
php artisan queue:flush

# Restart queue workers
php artisan queue:restart
``` 