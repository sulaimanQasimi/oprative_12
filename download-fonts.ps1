# Create fonts directory if it doesn't exist
$fontsDir = "public/fonts/persian"
if (-not (Test-Path $fontsDir)) {
    New-Item -ItemType Directory -Path $fontsDir -Force
}

# Font URLs
$fonts = @{
    "B-NAZANIN.TTF" = "https://github.com/font-store/font-b-nazanin/raw/master/B-NAZANIN.TTF"
    "IRANSansWeb.ttf" = "https://github.com/rastikerdar/iran-sans/raw/master/dist/IRANSansWeb.ttf"
    "Vazir.ttf" = "https://github.com/rastikerdar/vazir-font/raw/master/dist/Vazir.ttf"
    "Yekan.ttf" = "https://github.com/ParsMizban/Yekan-Font/raw/master/Yekan.ttf"
}

# Download each font
foreach ($font in $fonts.GetEnumerator()) {
    $outFile = Join-Path $fontsDir $font.Key
    Write-Host "Downloading $($font.Key)..."
    Invoke-WebRequest -Uri $font.Value -OutFile $outFile
    Write-Host "Downloaded $($font.Key)"
}
