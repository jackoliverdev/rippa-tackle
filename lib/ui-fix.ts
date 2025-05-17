import * as React from "react";

/**
 * Fix for Radix UI Symbol issues during build
 */
export const createSlottableComponent = <T extends React.ElementType>(
  Component: T
): T => {
  return Component;
};

// Fix the type to allow displayName property
export const createForwardRefComponent = <T extends React.ComponentType<any>>(
  displayName: string,
  Component: T
): T => {
  try {
    Component.displayName = displayName;
  } catch (e) {
    // Silently fail if we can't set the displayName
    console.warn(`Unable to set displayName for ${displayName}`);
  }
  return Component;
};