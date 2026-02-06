export function generateAutoID(prefix: string): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}_${timestamp}${random}`;
}

export function generateVehicleID(): string {
  return generateAutoID('VH');
}

export function generateStationID(): string {
  return generateAutoID('ST');
}