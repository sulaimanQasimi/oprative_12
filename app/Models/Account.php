<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use HasUuids;
    protected $fillable = ['branch_id','account_number','account_type_id'];
    public function branch(){
        return $this->belongsTo(Branch::class);
    }public function account_type(){
        return $this->belongsTo(AccountType::class);
    }
}
