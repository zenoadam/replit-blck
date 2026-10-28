/**
 * Copyright (c) 2026 Zeno Productions. All rights reserved.
 */
import { twMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
