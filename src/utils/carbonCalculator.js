/**
 * TerraTrace Deterministic Carbon Calculation Engine
 * Values based on DEFRA / IPCC standard emission factors (kg CO2e per unit)
 */

export const EMISSION_FACTORS = {
  // Transportation (per km)
  car: { factor: 0.171, unit: 'km', category: 'Transportation', label: 'Car (Gasoline/Diesel)' },
  motorcycle: { factor: 0.103, unit: 'km', category: 'Transportation', label: 'Motorcycle' },
  bus: { factor: 0.089, unit: 'km', category: 'Transportation', label: 'Bus' },
  metro: { factor: 0.035, unit: 'km', category: 'Transportation', label: 'Metro / Subway' },
  train: { factor: 0.041, unit: 'km', category: 'Transportation', label: 'Train' },
  flight: { factor: 0.255, unit: 'km', category: 'Transportation', label: 'Flight (Economy)' },
  bike: { factor: 0.0, unit: 'km', category: 'Transportation', label: 'Cycling' },
  walking: { factor: 0.0, unit: 'km', category: 'Transportation', label: 'Walking' },

  // Food (per meal / serving)
  beef: { factor: 6.5, unit: 'meal', category: 'Food', label: 'Beef Meal' },
  chicken: { factor: 1.4, unit: 'meal', category: 'Food', label: 'Chicken Meal' },
  vegetarian: { factor: 0.8, unit: 'meal', category: 'Food', label: 'Vegetarian Meal' },
  vegan: { factor: 0.5, unit: 'meal', category: 'Food', label: 'Vegan Meal' },
  dairy: { factor: 0.45, unit: 'serving', category: 'Food', label: 'Dairy Product' },

  // Energy (per kWh)
  electricity: { factor: 0.385, unit: 'kWh', category: 'Energy', label: 'Grid Electricity' },

  // Waste (per kg)
  food_waste: { factor: 2.5, unit: 'kg', category: 'Waste', label: 'Food Waste' },
  plastic: { factor: 1.8, unit: 'kg', category: 'Waste', label: 'Plastic Waste' },
  recycling: { factor: -0.4, unit: 'kg', category: 'Waste', label: 'Recycled Waste (Offset)' },
};

/**
 * Calculates deterministic emissions in kg CO2e.
 * Formula: emission = quantity * emission_factor
 */
export function calculateEmission(activityType, quantity) {
  const normType = activityType?.toLowerCase().replace(/[\s-]/g, '_');
  const factorObj = EMISSION_FACTORS[normType];
  if (!factorObj) {
    return Number((Number(quantity || 0) * 0.1).toFixed(2));
  }
  const result = Number(quantity || 0) * factorObj.factor;
  return Number(result.toFixed(2));
}

/**
 * Calculate sustainability score (0 - 100)
 * Global average benchmark ~ 100 kg CO2e / week
 */
export function calculateSustainabilityScore(weeklyFootprint) {
  if (weeklyFootprint <= 0) return 98;
  // S-curve grading: <25 kg -> 95+, 45 kg -> 88, 80 kg -> 72, 120 kg -> 55, 200 kg -> 30
  const score = Math.max(15, Math.min(99, Math.round(100 - (weeklyFootprint / 2.2))));
  return score;
}

/**
 * Natural language Quick Trace parser using keyword/regex analysis
 */
export function parseQuickTrace(input) {
  if (!input || typeof input !== 'string') return null;
  const text = input.toLowerCase().trim();

  // Number extraction
  const numWordMap = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  let quantity = 1;

  const numMatch = text.match(/(\d+(\.\d+)?)/);
  if (numMatch) {
    quantity = parseFloat(numMatch[1]);
  } else {
    for (const [word, val] of Object.entries(numWordMap)) {
      if (text.includes(word)) {
        quantity = val;
        break;
      }
    }
  }

  // Detection rules
  if (text.includes('car') || text.includes('drove') || text.includes('drive')) {
    return {
      category: 'Transportation',
      activity_type: 'car',
      quantity,
      unit: 'km',
      label: 'Car Travel',
      emission: calculateEmission('car', quantity),
    };
  }
  if (text.includes('metro') || text.includes('subway') || text.includes('tube')) {
    return {
      category: 'Transportation',
      activity_type: 'metro',
      quantity,
      unit: 'km',
      label: 'Metro Travel',
      emission: calculateEmission('metro', quantity),
    };
  }
  if (text.includes('bus')) {
    return {
      category: 'Transportation',
      activity_type: 'bus',
      quantity,
      unit: 'km',
      label: 'Bus Ride',
      emission: calculateEmission('bus', quantity),
    };
  }
  if (text.includes('train') || text.includes('rail')) {
    return {
      category: 'Transportation',
      activity_type: 'train',
      quantity,
      unit: 'km',
      label: 'Train Journey',
      emission: calculateEmission('train', quantity),
    };
  }
  if (text.includes('flight') || text.includes('fly') || text.includes('flew') || text.includes('plane')) {
    return {
      category: 'Transportation',
      activity_type: 'flight',
      quantity,
      unit: 'km',
      label: 'Flight',
      emission: calculateEmission('flight', quantity),
    };
  }
  if (text.includes('bike') || text.includes('cycl') || text.includes('bicycle')) {
    return {
      category: 'Transportation',
      activity_type: 'bike',
      quantity,
      unit: 'km',
      label: 'Bicycle Ride',
      emission: calculateEmission('bike', quantity),
    };
  }
  if (text.includes('walk') || text.includes('ran') || text.includes('jog')) {
    return {
      category: 'Transportation',
      activity_type: 'walking',
      quantity,
      unit: 'km',
      label: 'Walking / Running',
      emission: calculateEmission('walking', quantity),
    };
  }
  if (text.includes('beef') || text.includes('steak') || text.includes('burger')) {
    return {
      category: 'Food',
      activity_type: 'beef',
      quantity,
      unit: 'meal',
      label: 'Beef Meal',
      emission: calculateEmission('beef', quantity),
    };
  }
  if (text.includes('chicken') || text.includes('poultry')) {
    return {
      category: 'Food',
      activity_type: 'chicken',
      quantity,
      unit: 'meal',
      label: 'Chicken Meal',
      emission: calculateEmission('chicken', quantity),
    };
  }
  if (text.includes('vegetarian') || text.includes('veggie')) {
    return {
      category: 'Food',
      activity_type: 'vegetarian',
      quantity,
      unit: 'meal',
      label: 'Vegetarian Meal',
      emission: calculateEmission('vegetarian', quantity),
    };
  }
  if (text.includes('vegan') || text.includes('plant-based')) {
    return {
      category: 'Food',
      activity_type: 'vegan',
      quantity,
      unit: 'meal',
      label: 'Vegan Meal',
      emission: calculateEmission('vegan', quantity),
    };
  }
  if (text.includes('electricity') || text.includes('kwh') || text.includes('power') || text.includes('ac ') || text.includes('air conditioning')) {
    return {
      category: 'Energy',
      activity_type: 'electricity',
      quantity,
      unit: 'kWh',
      label: 'Electricity Consumption',
      emission: calculateEmission('electricity', quantity),
    };
  }
  if (text.includes('food waste') || text.includes('leftover') || text.includes('wasted food')) {
    return {
      category: 'Waste',
      activity_type: 'food_waste',
      quantity,
      unit: 'kg',
      label: 'Food Waste',
      emission: calculateEmission('food_waste', quantity),
    };
  }
  if (text.includes('plastic')) {
    return {
      category: 'Waste',
      activity_type: 'plastic',
      quantity,
      unit: 'kg',
      label: 'Plastic Waste',
      emission: calculateEmission('plastic', quantity),
    };
  }
  if (text.includes('recycle') || text.includes('recycling')) {
    return {
      category: 'Waste',
      activity_type: 'recycling',
      quantity,
      unit: 'kg',
      label: 'Recycled Materials',
      emission: calculateEmission('recycling', quantity),
    };
  }

  // Fallback default
  return {
    category: 'Transportation',
    activity_type: 'car',
    quantity: quantity || 10,
    unit: 'km',
    label: 'Custom Activity',
    emission: calculateEmission('car', quantity || 10),
  };
}
