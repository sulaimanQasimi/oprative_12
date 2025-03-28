<?php

namespace App\Helpers;

class Helper
{
    /**
     * Mask account number for security/privacy
     *
     * @param string $accountNo The account number to mask
     * @return string The masked account number
     */
    public static function maskAccountNo($accountNo)
    {
        if (empty($accountNo)) {
            return '';
        }

        $length = strlen($accountNo);

        // For shorter account numbers, show fewer digits
        if ($length <= 8) {
            return substr($accountNo, 0, 2) . str_repeat('*', $length - 4) . substr($accountNo, -2);
        }

        // For longer account numbers, show first 4 and last 4 digits
        return substr($accountNo, 0, 4) . str_repeat('*', $length - 8) . substr($accountNo, -4);
    }
}