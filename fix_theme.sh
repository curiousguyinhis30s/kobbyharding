#!/bin/bash

# List of all files with theme imports
FILES=(
"src/components/Navigation.tsx"
"src/pages/CollectionNew.tsx"
"src/pages/AboutKobby.tsx"
"src/pages/admin/AdminDashboard.tsx"
"src/components/admin/ContentManager.tsx"
"src/components/admin/InventoryManagement.tsx"
"src/components/MinimalAIChat.tsx"
"src/pages/Collection.tsx"
"src/pages/DeliveryOptions.tsx"
"src/pages/Checkout.tsx"
"src/pages/Cart.tsx"
"src/components/admin/ImageStudioEnhanced.tsx"
"src/pages/WelcomeEnhanced.tsx"
"src/components/AIAssistant.tsx"
"src/components/SmartRecommendations.tsx"
"src/pages/Piece.tsx"
"src/pages/Contact.tsx"
"src/pages/FestivalPickup.tsx"
"src/components/Footer.tsx"
"src/components/admin/AnalyticsDashboard.tsx"
"src/components/admin/ImageStudio.tsx"
)

# Replacements
declare -A REPLACEMENTS=(
["colors.background"]="#ffffff"
["colors.text"]="#000000"
["colors.primary"]="#000000"
["colors.surface"]="#f8f8f8"
["colors.border"]="#e0e0e0"
["colors.cardBg"]="#ffffff"
["colors.backgroundAlt"]="#f8f8f8"
["colors.textMuted"]="#666666"
["colors.accent"]="#000000"
["colors.accentHover"]="#333333"
["config.font.body"]="system-ui, -apple-system, sans-serif"
["config.font.heading"]="system-ui, -apple-system, sans-serif"
)

echo "Starting theme cleanup..."

for file in "${FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "Processing: $file"

        # Remove import lines
        sed -i '' "/import.*useTheme.*from.*themeUtils/d" "$file"
        sed -i '' "/import.*ThemeContext/d" "$file"
        sed -i '' "/import.*ThemeProvider/d" "$file"

        # Remove useTheme() calls and theme destructuring
        sed -i '' "/const.*useTheme()/d" "$file"
        sed -i '' "/const.*{.*theme.*}.*useTheme()/d" "$file"
        sed -i '' "/const.*{.*colors.*}.*useTheme()/d" "$file"
        sed -i '' "/const.*{.*config.*}.*useTheme()/d" "$file"
        sed -i '' "/const.*{.*theme.*,.*colors.*}.*useTheme()/d" "$file"
        sed -i '' "/const.*{.*theme.*,.*colors.*,.*config.*}.*useTheme()/d" "$file"
        sed -i '' "/const.*colors.*=.*themes\[theme\]/d" "$file"

        # Replace color references
        for key in "${!REPLACEMENTS[@]}"; do
            value="${REPLACEMENTS[$key]}"
            sed -i '' "s|${key}|'${value}'|g" "$file"
        done

        # Fix specific patterns
        sed -i '' "s|\`linear-gradient(90deg, '\#000000', '\#333333')\`|'linear-gradient(90deg, #000000, #333333)'|g" "$file"
        sed -i '' "s|\`linear-gradient(135deg, '\#000000', '\#333333')\`|'linear-gradient(135deg, #000000, #333333)'|g" "$file"
        sed -i '' "s|'\#000000'20|rgba(0,0,0,0.1)|g" "$file"
        sed -i '' "s|'\#333333'20|rgba(51,51,51,0.1)|g" "$file"

    fi
done

echo "Theme cleanup completed!"