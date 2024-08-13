import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createPublicId(publicId: string, id: number): string {
  return `${publicId.slice(0, 11)}${id}${publicId.slice(11)}`
}

export function returnPublicId(publicId: string): number {
  return parseInt(publicId.slice(11, -10))
}


export function convertTo24Hour(time: { hour: string, minute: string, period: string }) {
  let hour = parseInt(time.hour) % 12;
  if (time.period === "PM") hour += 12;
  return { hour, minute: parseInt(time.minute) };
};