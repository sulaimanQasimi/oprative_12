<?php

namespace App\Repositories\Customer;

use App\Models\Customer;
use App\Repositories\Customer\Traits\RegisterRoutes;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class CustomerRepository
{
    use RegisterRoutes;
    public Customer $model;
    public $id;
    public function __construct(Customer $model)
    {
        $this->model = $model;
        $this->id = $model->id;
    }

    public static function currentUserCustomer()
    {
        return new static(Auth::guard('customer_user')->user()->customer);
    }

}
