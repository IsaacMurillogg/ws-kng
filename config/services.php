<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'wialon' => [
        'token' => env('WIALON_TOKEN'),
        'unit_ids' => array_map('intval', explode(',', env('WIALON_UNIT_IDS', ''))),
        'base_url' => env('WIALON_BASE_URL', 'https://hst-api.wialon.com'),
        'field_mappings' => [
            'plates' => env('WIALON_CUSTOM_FIELD_PLATES_NAME', 'plates'),
        ],
        'flags' => env('WIALON_DATA_FLAGS', 4099),
    ],
];
