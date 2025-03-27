<div class="container" dir="rtl">
    <x-customer-navbar />

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
