<?php

namespace App\Service;

use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class WebhookService
{
    private $client;

    public function __construct()
    {
        $this->client = HttpClient::create();
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function sendWebhookNotification(string $url, array $data): void
    {
        $this->client->request('POST', $url, [
            'json' => $data,
            'headers' => [
                'Content-Type' => 'application/json',
            ],
        ]);
    }
}