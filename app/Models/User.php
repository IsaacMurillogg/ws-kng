<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * The unidades that belong to the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function unidades() // Nombre cambiado a 'unidades' para consistencia
    {
        // Especificar la tabla pivote 'user_unidad' y las claves foráneas/locales si no siguen la convención estricta
        return $this->belongsToMany(Unidad::class, 'user_unidad', 'user_id', 'unidad_id');
    }

    /**
     * Get all of the comentarios for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comentarios(): HasMany
    {
        return $this->hasMany(Comentario::class);
    }
}