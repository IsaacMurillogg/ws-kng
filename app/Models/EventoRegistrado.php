<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EventoRegistrado extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'unit_name',
        'timestamp',
        'event_text',
        'event_type',
        'latitud',
        'longitud',
        'procesado',
        'procesado_alerta'
    ];

    protected $casts = [
        'timestamp' => 'datetime',
        'procesado' => 'boolean',
        'procesado_alerta' => 'boolean',
    ];
}