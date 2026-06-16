$ErrorActionPreference = "Stop"
$text = [System.IO.File]::ReadAllText("index.html")
$match = [regex]::Match($text, "<script>([\s\S]*?)</script>")
if (-not $match.Success) { throw "script block not found" }
$tmp = Join-Path $env:TEMP "agnes-ai-studio-check.js"
Set-Content -Path $tmp -Value $match.Groups[1].Value -NoNewline
node --check $tmp
node --check worker.js
git diff --check
Write-Host "OK: syntax and whitespace checks passed"
