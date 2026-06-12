# ============================================================
# AMC CZYRKA - Einmaliges Setup: Fonts & Bilder lokal speichern
# Ausfuehren:  Rechtsklick > "Mit PowerShell ausfuehren"
# (oder in PowerShell:  .\download-assets.ps1 )
# Danach laedt die Website KEINE Daten mehr von Google/Unsplash.
# ============================================================
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force -Path "fonts","images/stock" | Out-Null

# --- 1. Google Fonts herunterladen (Fraunces + Manrope) ---
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
$cssUrl = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..700,30..100;1,9..144,400..600,30..100&family=Manrope:wght@400;500;600;700&display=swap"
Write-Host "Lade Font-CSS von Google..."
$css = (Invoke-WebRequest -Uri $cssUrl -UserAgent $ua -UseBasicParsing).Content

$i = 0
$css = [regex]::Replace($css, "url\((https://fonts\.gstatic\.com[^)]+)\)", {
  param($m)
  $url = $m.Groups[1].Value
  $ext = [System.IO.Path]::GetExtension(($url -split "\?")[0])
  $script:i++
  $name = "font-$($script:i)$ext"
  Write-Host "  -> fonts/$name"
  Invoke-WebRequest -Uri $url -UserAgent $ua -OutFile "fonts/$name" -UseBasicParsing
  "url($name)"
})
Set-Content -Path "fonts/fonts.css" -Value $css -Encoding UTF8
Write-Host "fonts/fonts.css erstellt ($i Dateien)."

# --- 2. Unsplash-Bilder herunterladen ---
$images = @(
  @{ Id = "photo-1504328345606-18bbc8c9d7d1"; W = 1200 }
  @{ Id = "photo-1507652313519-d4e9174996dd"; W = 1600 }
  @{ Id = "photo-1530124566582-a618bc2615dc"; W = 1200 }
  @{ Id = "photo-1552321554-5fefe8c9ef14"; W = 1600 }
  @{ Id = "photo-1556912173-3bb406ef7e77"; W = 900 }
  @{ Id = "photo-1558036117-15d82a90b9b1"; W = 1600 }
  @{ Id = "photo-1558618666-fcd25c85cd64"; W = 1600 }
  @{ Id = "photo-1564540586988-aa4e53c3d799"; W = 1600 }
  @{ Id = "photo-1565514020179-026b92b84bb6"; W = 1200 }
  @{ Id = "photo-1565610222536-ef125c59da2e"; W = 1600 }
  @{ Id = "photo-1568605114967-8130f3a36994"; W = 1600 }
  @{ Id = "photo-1581092160562-40aa08e78837"; W = 1200 }
  @{ Id = "photo-1581092918056-0c4c3acd3789"; W = 1200 }
  @{ Id = "photo-1583608205776-bfd35f0d9f83"; W = 1600 }
  @{ Id = "photo-1584622650111-993a426fbf0a"; W = 1600 }
  @{ Id = "photo-1600566753086-00f18fb6b3ea"; W = 900 }
  @{ Id = "photo-1600566753190-17f0baa2a6c3"; W = 900 }
  @{ Id = "photo-1600585154340-be6161a56a0c"; W = 1920 }
  @{ Id = "photo-1600607687939-ce8a6c25118c"; W = 1920 }
  @{ Id = "photo-1605276374104-dee2a0ed3cd6"; W = 1200 }
  @{ Id = "photo-1620626011761-996317b8d101"; W = 900 }
)
foreach ($img in $images) {
  $out = "images/stock/$($img.Id).jpg"
  if (Test-Path $out) { Write-Host "  vorhanden: $out"; continue }
  $url = "https://images.unsplash.com/$($img.Id)?auto=format&fit=crop&w=$($img.W)&q=80&fm=jpg"
  Write-Host "  -> $out"
  Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing
}
Write-Host ""
Write-Host "Fertig! Fonts und Bilder sind jetzt lokal. Website kann deployt werden." -ForegroundColor Green
