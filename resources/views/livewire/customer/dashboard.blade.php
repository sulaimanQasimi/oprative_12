<div class="container" dir="rtl">
    <x-customer-navbar />

    <!-- Existing Content -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <livewire:customer.market-order-create />
    </div>
    <!-- Main Content Grid -->

</div>
@script
<script>
    $wire.on('closeModalAfterSuccess', () => {
        setTimeout(() => {
            $wire.closeScanner();
        }, 1000);
    });
</script>
@endscript