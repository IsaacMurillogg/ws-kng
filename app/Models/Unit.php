<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_wialon',
        'nombre',
        'plates',
        'telefono',
        'status',
        'location',
        'latitude',
        'longitude',
        'speed',
        'last_report_at',
        'raw_data',
        'monitorear_eventos',
    ];

    protected $casts = [
        'last_report_at' => 'datetime',
        'raw_data' => 'array',
        'monitorear_eventos' => 'boolean',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'unit_user');
    }
}
