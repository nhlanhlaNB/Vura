const BASE_PRICING = {
  baseFare: 12,
  bookingFee: 8,
  perKm: 7.4,
  perMin: 1.25,
  minimumFare: 35,
};

const RIDE_TYPE_MULTIPLIERS = {
  economy: 1,
  comfort: 1.25,
  xl: 1.55,
};

const ROUND_INCREMENT = 0.5;

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toMoney = (value) => Number(toNumber(value).toFixed(2));

const getTimeDemandMultiplier = (date) => {
  const now = date instanceof Date ? date : new Date();
  const hour = now.getHours();
  const day = now.getDay();

  const isMorningPeak = hour >= 7 && hour < 9;
  const isEveningPeak = hour >= 16 && hour < 19;
  const isLateWeekend = (day === 5 || day === 6) && (hour >= 22 || hour < 4);

  let multiplier = 1;
  if (isMorningPeak || isEveningPeak) multiplier += 0.15;
  if (isLateWeekend) multiplier += 0.1;

  return multiplier;
};

const getSupplyDemandMultiplier = ({ activeRequests = 0, availableDrivers = 0 }) => {
  const requests = Math.max(0, toNumber(activeRequests));
  const drivers = Math.max(1, toNumber(availableDrivers));
  const ratio = requests / drivers;

  if (ratio <= 1) return 1;

  const extra = (ratio - 1) * 0.35;
  return clamp(1 + extra, 1, 2.2);
};

export const calculateDemandMultiplier = (context = {}) => {
  const {
    date = new Date(),
    activeRequests = 0,
    availableDrivers = 0,
    weatherSeverity = 0,
  } = context;

  const timeMultiplier = getTimeDemandMultiplier(date);
  const supplyMultiplier = getSupplyDemandMultiplier({ activeRequests, availableDrivers });
  const weatherMultiplier = 1 + clamp(toNumber(weatherSeverity), 0, 0.25);

  return clamp(timeMultiplier * supplyMultiplier * weatherMultiplier, 1, 2.5);
};

export const calculateTripFare = ({
  distanceKm,
  durationMin,
  rideType = 'economy',
  demandContext = {},
}) => {
  const safeDistanceKm = Math.max(0, toNumber(distanceKm));
  const safeDurationMin = Math.max(0, toNumber(durationMin));

  const rideMultiplier = RIDE_TYPE_MULTIPLIERS[rideType] || RIDE_TYPE_MULTIPLIERS.economy;
  const surgeMultiplier = calculateDemandMultiplier(demandContext);

  const baseFare = BASE_PRICING.baseFare * rideMultiplier;
  const bookingFee = BASE_PRICING.bookingFee * rideMultiplier;
  const distanceCharge = safeDistanceKm * BASE_PRICING.perKm * rideMultiplier;
  const timeCharge = safeDurationMin * BASE_PRICING.perMin * rideMultiplier;
  const minimumFare = BASE_PRICING.minimumFare * rideMultiplier;

  const serviceSubtotal = baseFare + distanceCharge + timeCharge;
  const surgedServiceSubtotal = serviceSubtotal * surgeMultiplier;
  const preMinimumTotal = surgedServiceSubtotal + bookingFee;
  const finalFare = Math.max(minimumFare, preMinimumTotal);
  const roundedDisplayFare = Math.round(finalFare / ROUND_INCREMENT) * ROUND_INCREMENT;

  return {
    rideType,
    finalFare: toMoney(finalFare),
    roundedDisplayFare: toMoney(roundedDisplayFare),
    surgeMultiplier: toMoney(surgeMultiplier),
    distanceKm: toMoney(safeDistanceKm),
    durationMin: toMoney(safeDurationMin),
    breakdown: {
      baseFare: toMoney(baseFare),
      bookingFee: toMoney(bookingFee),
      distanceCharge: toMoney(distanceCharge),
      timeCharge: toMoney(timeCharge),
      serviceSubtotal: toMoney(serviceSubtotal),
      surgedServiceSubtotal: toMoney(surgedServiceSubtotal),
      preMinimumTotal: toMoney(preMinimumTotal),
      minimumFare: toMoney(minimumFare),
      appliedMinimumFare: preMinimumTotal < minimumFare,
      surgeMultiplier: toMoney(surgeMultiplier),
    },
  };
};

export const formatCurrencyZAR = (amount) => `R${toMoney(amount).toFixed(2)}`;
