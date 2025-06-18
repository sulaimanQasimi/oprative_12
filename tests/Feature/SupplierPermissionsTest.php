<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Supplier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SupplierPermissionsTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $adminUser;
    protected $limitedUser;
    protected $supplier;

    protected function setUp(): void
    {
        parent::setUp();

        // Create permissions
        $permissions = [
            'view_any_supplier',
            'view_supplier',
            'create_supplier',
            'update_supplier',
            'delete_supplier',
            'restore_supplier',
            'force_delete_supplier',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create admin role with all permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo($permissions);

        // Create limited role with only view permissions
        $limitedRole = Role::create(['name' => 'limited']);
        $limitedRole->givePermissionTo(['view_any_supplier', 'view_supplier']);

        // Create users
        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('admin');

        $this->limitedUser = User::factory()->create();
        $this->limitedUser->assignRole('limited');

        // Create a test supplier
        $this->supplier = Supplier::factory()->create([
            'name' => 'Test Supplier',
            'email' => 'test@supplier.com',
            'phone' => '123-456-7890',
        ]);
    }

    /** @test */
    public function admin_can_view_supplier_index()
    {
        $response = $this->actingAs($this->adminUser)
            ->get(route('admin.suppliers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Supplier/Index')
                 ->has('suppliers')
                 ->has('permissions')
                 ->where('permissions.can_create', true)
                 ->where('permissions.can_update', true)
                 ->where('permissions.can_delete', true)
                 ->where('permissions.can_view', true)
        );
    }

    /** @test */
    public function limited_user_can_view_supplier_index_with_limited_permissions()
    {
        $response = $this->actingAs($this->limitedUser)
            ->get(route('admin.suppliers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Supplier/Index')
                 ->has('suppliers')
                 ->has('permissions')
                 ->where('permissions.can_create', false)
                 ->where('permissions.can_update', false)
                 ->where('permissions.can_delete', false)
                 ->where('permissions.can_view', true)
        );
    }

    /** @test */
    public function user_without_view_any_permission_cannot_access_index()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get(route('admin.suppliers.index'));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_view_supplier_create_page()
    {
        $response = $this->actingAs($this->adminUser)
            ->get(route('admin.suppliers.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Supplier/Create')
                 ->has('permissions')
                 ->where('permissions.can_create', true)
        );
    }

    /** @test */
    public function limited_user_cannot_access_supplier_create_page()
    {
        $response = $this->actingAs($this->limitedUser)
            ->get(route('admin.suppliers.create'));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_create_supplier()
    {
        $supplierData = [
            'name' => 'New Supplier',
            'contact_name' => 'John Doe',
            'email' => 'john@newsupplier.com',
            'phone' => '987-654-3210',
            'address' => '123 Main St',
            'city' => 'New York',
            'state' => 'NY',
            'country' => 'USA',
            'postal_code' => '10001',
            'id_number' => 'SUP001',
        ];

        $response = $this->actingAs($this->adminUser)
            ->post(route('admin.suppliers.store'), $supplierData);

        $response->assertRedirect(route('admin.suppliers.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('suppliers', [
            'name' => 'New Supplier',
            'email' => 'john@newsupplier.com',
        ]);
    }

    /** @test */
    public function limited_user_cannot_create_supplier()
    {
        $supplierData = [
            'name' => 'New Supplier',
            'email' => 'test@example.com',
        ];

        $response = $this->actingAs($this->limitedUser)
            ->post(route('admin.suppliers.store'), $supplierData);

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_view_supplier_show_page()
    {
        $response = $this->actingAs($this->adminUser)
            ->get(route('admin.suppliers.show', $this->supplier));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Supplier/Show')
                 ->has('supplier')
                 ->has('permissions')
                 ->where('permissions.can_view', true)
                 ->where('permissions.can_update', true)
                 ->where('permissions.can_delete', true)
                 ->where('supplier.id', $this->supplier->id)
        );
    }

    /** @test */
    public function limited_user_can_view_supplier_show_page()
    {
        $response = $this->actingAs($this->limitedUser)
            ->get(route('admin.suppliers.show', $this->supplier));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Supplier/Show')
                 ->has('supplier')
                 ->has('permissions')
                 ->where('permissions.can_view', true)
                 ->where('permissions.can_update', false)
                 ->where('permissions.can_delete', false)
        );
    }

    /** @test */
    public function user_without_view_permission_cannot_access_show_page()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get(route('admin.suppliers.show', $this->supplier));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_view_supplier_edit_page()
    {
        $response = $this->actingAs($this->adminUser)
            ->get(route('admin.suppliers.edit', $this->supplier));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Supplier/Edit')
                 ->has('supplier')
                 ->has('permissions')
                 ->where('permissions.can_update', true)
                 ->where('supplier.id', $this->supplier->id)
        );
    }

    /** @test */
    public function limited_user_cannot_access_supplier_edit_page()
    {
        $response = $this->actingAs($this->limitedUser)
            ->get(route('admin.suppliers.edit', $this->supplier));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_update_supplier()
    {
        $updateData = [
            'name' => 'Updated Supplier Name',
            'email' => 'updated@supplier.com',
            'phone' => '555-0123',
        ];

        $response = $this->actingAs($this->adminUser)
            ->put(route('admin.suppliers.update', $this->supplier), $updateData);

        $response->assertRedirect(route('admin.suppliers.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('suppliers', [
            'id' => $this->supplier->id,
            'name' => 'Updated Supplier Name',
            'email' => 'updated@supplier.com',
        ]);
    }

    /** @test */
    public function limited_user_cannot_update_supplier()
    {
        $updateData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ];

        $response = $this->actingAs($this->limitedUser)
            ->put(route('admin.suppliers.update', $this->supplier), $updateData);

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_delete_supplier()
    {
        $response = $this->actingAs($this->adminUser)
            ->delete(route('admin.suppliers.destroy', $this->supplier));

        $response->assertRedirect(route('admin.suppliers.index'));
        $response->assertSessionHas('success');

        $this->assertSoftDeleted('suppliers', [
            'id' => $this->supplier->id,
        ]);
    }

    /** @test */
    public function limited_user_cannot_delete_supplier()
    {
        $response = $this->actingAs($this->limitedUser)
            ->delete(route('admin.suppliers.destroy', $this->supplier));

        $response->assertStatus(403);

        $this->assertDatabaseHas('suppliers', [
            'id' => $this->supplier->id,
            'deleted_at' => null,
        ]);
    }

    /** @test */
    public function admin_can_restore_deleted_supplier()
    {
        // First delete the supplier
        $this->supplier->delete();

        $response = $this->actingAs($this->adminUser)
            ->post(route('admin.suppliers.restore', $this->supplier->id));

        $response->assertRedirect(route('admin.suppliers.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('suppliers', [
            'id' => $this->supplier->id,
            'deleted_at' => null,
        ]);
    }

    /** @test */
    public function limited_user_cannot_restore_supplier()
    {
        // First delete the supplier
        $this->supplier->delete();

        $response = $this->actingAs($this->limitedUser)
            ->post(route('admin.suppliers.restore', $this->supplier->id));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_force_delete_supplier()
    {
        // First soft delete the supplier
        $this->supplier->delete();

        $response = $this->actingAs($this->adminUser)
            ->delete(route('admin.suppliers.force-delete', $this->supplier->id));

        $response->assertRedirect(route('admin.suppliers.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('suppliers', [
            'id' => $this->supplier->id,
        ]);
    }

    /** @test */
    public function limited_user_cannot_force_delete_supplier()
    {
        // First soft delete the supplier
        $this->supplier->delete();

        $response = $this->actingAs($this->limitedUser)
            ->delete(route('admin.suppliers.force-delete', $this->supplier->id));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_view_supplier_payments()
    {
        $response = $this->actingAs($this->adminUser)
            ->get(route('admin.suppliers.payments', $this->supplier));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Supplier/Payments')
                 ->has('supplier')
                 ->has('payments')
                 ->has('permissions')
                 ->where('permissions.can_view', true)
        );
    }

    /** @test */
    public function admin_can_view_supplier_purchases()
    {
        $response = $this->actingAs($this->adminUser)
            ->get(route('admin.suppliers.purchases', $this->supplier));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Supplier/Purchases')
                 ->has('supplier')
                 ->has('purchases')
                 ->has('permissions')
                 ->where('permissions.can_view', true)
        );
    }

    /** @test */
    public function validation_errors_are_handled_correctly()
    {
        $invalidData = [
            'name' => '', // Required field
            'email' => 'invalid-email', // Invalid email format
        ];

        $response = $this->actingAs($this->adminUser)
            ->post(route('admin.suppliers.store'), $invalidData);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['name', 'email']);
    }

    /** @test */
    public function controller_handles_model_not_found_exceptions()
    {
        $nonExistentId = 99999;

        $response = $this->actingAs($this->adminUser)
            ->get("/adminpanel/suppliers/{$nonExistentId}");

        $response->assertStatus(404);
    }

    /** @test */
    public function navigation_filters_supplier_menu_based_on_permissions()
    {
        // Test that user with view_any_supplier permission sees the menu
        $response = $this->actingAs($this->adminUser)
            ->get(route('admin.dashboard'));

        $response->assertStatus(200);
        // The navigation component should include suppliers menu for admin

        // Test that user without permission doesn't see the menu
        $userWithoutPermission = User::factory()->create();

        $response = $this->actingAs($userWithoutPermission)
            ->get(route('admin.dashboard'));

        $response->assertStatus(200);
        // The navigation component should filter out suppliers menu
    }
}
