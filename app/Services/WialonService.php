<?php

namespace App\Services;

use App\Utils\Wialon\WialonEventRequest;
use Exception;

class WialonService
{
    protected ?string $sid = null;

    public function login(): void
    {
        if (!$this->sid) {
            $this->sid = WialonEventRequest::login();
        }
    }

    public function getRegisteredEvents(array $unitIds, int $timeFrom, int $timeTo): array
    {
        if (!$this->sid) {
            throw new Exception('Debe iniciar sesión en Wialon antes de obtener eventos. Llame a login() primero.');
        }
        return WialonEventRequest::getRegisteredEvents($this->sid, $unitIds, $timeFrom, $timeTo);
    }

    public function logout(): void
    {
        if ($this->sid) {
            WialonEventRequest::logout($this->sid);
            $this->sid = null;
        }
    }
}