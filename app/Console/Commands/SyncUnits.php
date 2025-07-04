<?php

namespace App\Console\Commands;

use App\Services\WialonSyncService;
use Illuminate\Console\Command;
use Throwable;

class SyncUnits extends Command
{
    protected $signature = 'wialon:sync-units';
    protected $description = 'Sincroniza las unidades desde Wialon con la base de datos local';
    
    public function __construct(private WialonSyncService $wialonSyncService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        try {
            // Llama al orquestador para iniciar el proceso.
            $result = $this->wialonSyncService->syncUnits();

            // Retorna un código de estado basado en el resultado.
            if ($result['failed'] > 0 || str_contains(strtolower($result['message']), 'error')) {
                return Command::FAILURE; // 1
            }

            return Command::SUCCESS; // 0

        } catch (Throwable $e) {
            $this->error("Se produjo una excepción no controlada: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}