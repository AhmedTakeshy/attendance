import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createId(publicId: string, id: number): string {
  return `${publicId.slice(0, 11)}${id}${publicId.slice(11)}`
}