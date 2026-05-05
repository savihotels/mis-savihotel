export type KpiInput = {
  roomsAvailable: number;
  roomsSold: number;
  roomRevenue: number;
};

export function calcKpi({ roomsAvailable, roomsSold, roomRevenue }: KpiInput) {
  const occupancy = roomsAvailable > 0 ? (roomsSold / roomsAvailable) * 100 : 0;
  const arr = roomsSold > 0 ? roomRevenue / roomsSold : 0;
  const revpar = roomsAvailable > 0 ? roomRevenue / roomsAvailable : 0;

  return {
    occupancy,
    arr,
    revpar
  };
}

export function calcGrowth(current: number, previous: number) {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}
