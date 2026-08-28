export interface AddressParts {
  street?: string | null;
  city?: string | null;
  postCode?: string | null;
}

/**
 * Composes the split address fields (street / city / postCode) into a single
 * readable line, skipping any that are empty. Returns "" when none are set.
 */
export function formatAddress({ street, city, postCode }: AddressParts): string {
  return [street, city, postCode]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
}
