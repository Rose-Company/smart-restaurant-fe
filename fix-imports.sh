#!/bin/bash

# Fix imports in table components
cd "/Users/nguyenthanhphat/Downloads/Admin Dashboard Design"

# ActionBar
sed -i '' 's|from '\''../../../components/ui/button'\''|from '\''../../../components/ui/misc/button'\''|g' src/features/tables/components/ActionBar.tsx

# StatsBar - no UI imports needed

# TableCard
sed -i '' 's|from '\''../../../components/ui/button'\''|from '\''../../../components/ui/misc/button'\''|g' src/features/tables/components/TableCard.tsx
sed -i '' 's|from '\''../../../components/ui/badge'\''|from '\''../../../components/ui/data-display/badge'\''|g' src/features/tables/components/TableCard.tsx

# TableGrid - no UI imports needed

# QRPreviewDialog
sed -i '' 's|from '\''../../../components/ui/button'\''|from '\''../../../components/ui/misc/button'\''|g' src/features/tables/components/dialogs/QRPreviewDialog.tsx

echo "Import fixes completed!"
