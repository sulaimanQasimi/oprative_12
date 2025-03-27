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
    public $model;
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

    /**
     * Get all customers
     *
     * @return Collection
     */
    public function all(): Collection
    {
        return $this->model->all();
    }

    /**
     * Get paginated customers
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    /**
     * Find customer by ID
     *
     * @param int $id
     * @return Model|null
     */
    public function find(int $id): ?Model
    {
        return $this->model->find($id);
    }

    /**
     * Create new customer
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * Update customer
     *
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(int $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data);
    }

    /**
     * Delete customer
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
    }

    /**
     * Find customer by email
     *
     * @param string $email
     * @return Model|null
     */
    public function findByEmail(string $email): ?Model
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * Get customers with their users
     *
     * @return Collection
     */
    public function withUsers(): Collection
    {
        return $this->model->with('users')->get();
    }

    /**
     * Get customer with all related data
     *
     * @param int $id
     * @return Model|null
     */
    public function findWithRelations(int $id): ?Model
    {
        return $this->model->with(['users', 'sales', 'payments', 'accounts'])->find($id);
    }
}
