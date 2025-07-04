<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unidad extends Model
{
    /** @use HasFactory<\Database\Factories\UnidadFactory> */
    use HasFactory;

    protected $table = 'unidades'; // Especificar el nombre correcto de la tabla

    protected $fillable = ['nombre_unidad']; // Permitir asignación masiva para nombre_unidad

    /**
     * Get all of the tickets for the Unidad
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'unidad_id'); // Especificar la FK si no sigue la convención
    }

    /**
     * The users that belong to the Unidad
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_unidad', 'unidad_id', 'user_id');
    }
}
