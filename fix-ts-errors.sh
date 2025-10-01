#!/bin/bash

# Fix Navigation.tsx - Remove LoginModal references
sed -i '' '/import LoginModal/d' src/components/Navigation.tsx
sed -i '' 's/const \[showLoginModal, setShowLoginModal\] = useState(false)//' src/components/Navigation.tsx
sed -i '' 's/setShowLoginModal(true)/navigate("\/admin\/login")/g' src/components/Navigation.tsx
sed -i '' '/<LoginModal/,/\/>/d' src/components/Navigation.tsx

# Fix FestivalPickupMinimal.tsx - Remove LoginModal import
sed -i '' '/import LoginModal/d' src/pages/FestivalPickupMinimal.tsx

# Fix PieceMinimal.tsx - Remove ProductFeedback import
sed -i '' '/import ProductFeedback/d' src/pages/PieceMinimal.tsx

# Fix unused imports in various files
sed -i '' 's/, Type//g' src/components/admin/ContentManager.tsx
sed -i '' 's/, AnimatePresence//g' src/components/admin/ImageStudioEnhanced.tsx
sed -i '' 's/, Upload//g' src/components/admin/ImageStudioEnhanced.tsx
sed -i '' 's/, Save//g' src/components/admin/ImageStudioEnhanced.tsx
sed -i '' 's/, AlertCircle//g' src/components/admin/ImageStudioEnhanced.tsx
sed -i '' 's/, Camera//g' src/components/admin/ImageStudioEnhanced.tsx

echo "TypeScript errors fixed!"