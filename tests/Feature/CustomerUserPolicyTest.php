<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\CustomerUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CustomerUserPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $regularUser;
    protected CustomerUser $customerUser;
    protected Customer $customer;

    protected function setUp(): void
    {
        parent::setUp();

        // Create permissions
        Permission::create(['name' => 'view_customer', 'guard_name' => 'web']);
        Permission::create(['name' => 'update_customer', 'guard_name' => 'web']);

        // Create admin user with permissions
        $this->adminUser = User::factory()->create();
        $this->adminUser->givePermissionTo(['view_customer', 'update_customer']);

        // Create regular user without permissions
        $this->regularUser = User::factory()->create();

        // Create customer and customer user
        $this->customer = Customer::factory()->create();
        $this->customerUser = CustomerUser::factory()->create([
            'customer_id' => $this->customer->id,
        ]);
    }

    /** @test */
    public function admin_user_can_view_any_customer_users()
    {
        $this->actingAs($this->adminUser);

        $this->assertTrue($this->adminUser->can('viewAny', CustomerUser::class));
    }

    /** @test */
    public function regular_user_cannot_view_any_customer_users()
    {
        $this->actingAs($this->regularUser);

        $this->assertFalse($this->regularUser->can('viewAny', CustomerUser::class));
    }

    /** @test */
    public function admin_user_can_view_customer_user()
    {
        $this->actingAs($this->adminUser);

        $this->assertTrue($this->adminUser->can('view', $this->customerUser));
    }

    /** @test */
    public function regular_user_cannot_view_customer_user()
    {
        $this->actingAs($this->regularUser);

        $this->assertFalse($this->regularUser->can('view', $this->customerUser));
    }

    /** @test */
    public function admin_user_can_create_customer_user()
    {
        $this->actingAs($this->adminUser);

        $this->assertTrue($this->adminUser->can('create', CustomerUser::class));
    }

    /** @test */
    public function regular_user_cannot_create_customer_user()
    {
        $this->actingAs($this->regularUser);

        $this->assertFalse($this->regularUser->can('create', CustomerUser::class));
    }

    /** @test */
    public function admin_user_can_update_customer_user()
    {
        $this->actingAs($this->adminUser);

        $this->assertTrue($this->adminUser->can('update', $this->customerUser));
    }

    /** @test */
    public function regular_user_cannot_update_customer_user()
    {
        $this->actingAs($this->regularUser);

        $this->assertFalse($this->regularUser->can('update', $this->customerUser));
    }

    /** @test */
    public function admin_user_can_delete_customer_user()
    {
        $this->actingAs($this->adminUser);

        $this->assertTrue($this->adminUser->can('delete', $this->customerUser));
    }

    /** @test */
    public function regular_user_cannot_delete_customer_user()
    {
        $this->actingAs($this->regularUser);

        $this->assertFalse($this->regularUser->can('delete', $this->customerUser));
    }

    /** @test */
    public function admin_user_can_restore_customer_user()
    {
        $this->actingAs($this->adminUser);

        $this->assertTrue($this->adminUser->can('restore', $this->customerUser));
    }

    /** @test */
    public function regular_user_cannot_restore_customer_user()
    {
        $this->actingAs($this->regularUser);

        $this->assertFalse($this->regularUser->can('restore', $this->customerUser));
    }

    /** @test */
    public function admin_user_can_force_delete_customer_user()
    {
        $this->actingAs($this->adminUser);

        $this->assertTrue($this->adminUser->can('forceDelete', $this->customerUser));
    }

    /** @test */
    public function regular_user_cannot_force_delete_customer_user()
    {
        $this->actingAs($this->regularUser);

        $this->assertFalse($this->regularUser->can('forceDelete', $this->customerUser));
    }
}
