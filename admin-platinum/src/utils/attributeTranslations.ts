/**
 * Translation utility for attribute names from English to Spanish
 * Used to display attributes in Spanish throughout the UI
 */

// Core attribute translations (for products, references, applications)
export const coreAttributeTranslations: Record<string, string> = {
  // Products
  'SKU': 'SKU',
  'Name': 'Nombre',
  'Description': 'Descripción',

  // References
  'Reference Brand': 'Marca de Intercambio',
  'ReferenceNumber': 'Número de Intercambio',
  'Reference Number': 'Número de Intercambio',
  'Part Type': 'Tipo de Parte',
  'PartType': 'Tipo de Parte',
  'Reference Type': 'Tipo de Referencia',
  'ReferenceType': 'Tipo de Referencia',

  // Applications
  'Origin': 'Origen',

  // Common variations
  'referenceBrand': 'Marca de Intercambio',
  'referenceNumber': 'Número de Intercambio',
  'partType': 'Tipo de Parte',
  'referenceType': 'Tipo de Referencia',
  'productName': 'Nombre de Producto',
  'name': 'Nombre',
  'description': 'Descripción',
  'sku': 'SKU',
  'origin': 'Origen',
};

// Common category attribute translations
export const categoryAttributeTranslations: Record<string, string> = {
  // Common product/reference/application attributes
  'System': 'Sistema',
  'Type': 'Tipo',
  'Model': 'Modelo',
  'Submodel': 'Submodelo',
  'Year': 'Año',
  'Engine Liters': 'Litros del Motor',
  'Engine_Liters': 'Litros del Motor',
  'Engine CC': 'CC del Motor',
  'Engine_CC': 'CC del Motor',
  'Engine CID': 'CID del Motor',
  'Engine_CID': 'CID del Motor',
  'Engine Cylinders': 'Cilindros del Motor',
  'Engine_Cylinders': 'Cilindros del Motor',
  'Engine Block': 'Bloque del Motor',
  'Engine_Block': 'Bloque del Motor',
  'Engine Description': 'Motor Descripción',
  'Engine_Description': 'Motor Descripción',
  'Motor_Descripcion': 'Motor Descripción',
  'Specifications': 'Especificaciones',
  'Manufacturer': 'Fabricante',
  'Brand': 'Marca',
  'Category': 'Categoría',

  // Common variations
  'model': 'Modelo',
  'submodel': 'Submodelo',
  'year': 'Año',
  'año': 'Año',
  'anio': 'Año',
  'system': 'Sistema',
  'type': 'Tipo',
  'brand': 'Marca',
  'category': 'Categoría',
  'manufacturer': 'Fabricante',
  'specifications': 'Especificaciones',
};

/**
 * Translates an attribute name from English to Spanish
 * @param attributeName - The English attribute name
 * @param isCoreAttribute - Whether this is a core attribute (default: false)
 * @returns The Spanish translation or the original name if no translation found
 */
export const translateAttributeName = (
  attributeName: string | null | undefined,
  isCoreAttribute: boolean = false
): string => {
  if (!attributeName) return '';

  const trimmedName = attributeName.trim();
  if (!trimmedName) return '';

  // First check core attributes if it's a core attribute
  if (isCoreAttribute) {
    const coreTranslation = coreAttributeTranslations[trimmedName];
    if (coreTranslation) return coreTranslation;
  }

  // Check category attributes
  const categoryTranslation = categoryAttributeTranslations[trimmedName];
  if (categoryTranslation) return categoryTranslation;

  // Try case-insensitive matching
  const lowerName = trimmedName.toLowerCase();
  for (const [key, value] of Object.entries(categoryAttributeTranslations)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }

  for (const [key, value] of Object.entries(coreAttributeTranslations)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }

  // If no translation found, return original (capitalize first letter for better display)
  return trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);
};
