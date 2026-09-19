import { calculateEmission } from './carbonCalculator';

export function generateDemoActivities() {
  const activities = [];
  const now = new Date();
  
  // Weekly lifestyle profile:
  // Car: 180 km/week (~25.7 km/day)
  // Metro: 25 km/week (~3.5 km/day)
  // Chicken: 4 meals/week
  // Vegetarian: 5 meals/week
  // Electricity: 42 kWh/week (~6 kWh/day)
  // Food waste: 2 kg/week

  // Generate 4 weeks (28 days) of realistic daily log data
  for (let dayOffset = 27; dayOffset >= 0; dayOffset--) {
    const dayDate = new Date(now);
    dayDate.setDate(now.getDate() - dayOffset);
    const dayOfWeek = dayDate.getDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Daily Electricity (avg 6 kWh/day, slightly higher on weekends)
    const elecKwh = isWeekend ? 7.2 : 5.6;
    activities.push({
      id: `demo-act-${dayOffset}-elec`,
      category: 'Energy',
      activity_type: 'electricity',
      quantity: elecKwh,
      unit: 'kWh',
      emission: calculateEmission('electricity', elecKwh),
      timestamp: new Date(dayDate.getTime() + 8 * 3600000).toISOString(),
      user_id: 'demo-user',
      notes: 'Residential grid consumption',
    });

    // Transportation:
    if (!isWeekend) {
      // Workday commute: Car or Metro
      if (dayOfWeek % 2 === 1) {
        // Car commute ~36 km
        activities.push({
          id: `demo-act-${dayOffset}-commute`,
          category: 'Transportation',
          activity_type: 'car',
          quantity: 36,
          unit: 'km',
          emission: calculateEmission('car', 36),
          timestamp: new Date(dayDate.getTime() + 9 * 3600000).toISOString(),
          user_id: 'demo-user',
          notes: 'Office commute & errands',
        });
      } else {
        // Hybrid metro day: 12 km metro + 18 km car
        activities.push({
          id: `demo-act-${dayOffset}-metro`,
          category: 'Transportation',
          activity_type: 'metro',
          quantity: 12.5,
          unit: 'km',
          emission: calculateEmission('metro', 12.5),
          timestamp: new Date(dayDate.getTime() + 9 * 3600000).toISOString(),
          user_id: 'demo-user',
          notes: 'Rapid transit commute',
        });
        activities.push({
          id: `demo-act-${dayOffset}-car`,
          category: 'Transportation',
          activity_type: 'car',
          quantity: 18,
          unit: 'km',
          emission: calculateEmission('car', 18),
          timestamp: new Date(dayDate.getTime() + 18 * 3600000).toISOString(),
          user_id: 'demo-user',
          notes: 'Grocery run',
        });
      }
    } else {
      // Weekend car drive ~36 km
      activities.push({
        id: `demo-act-${dayOffset}-car-wk`,
        category: 'Transportation',
        activity_type: 'car',
        quantity: 36,
        unit: 'km',
        emission: calculateEmission('car', 36),
        timestamp: new Date(dayDate.getTime() + 14 * 3600000).toISOString(),
        user_id: 'demo-user',
        notes: 'Weekend travel & shopping',
      });
    }

    // Food distribution across the week (4 chicken, 5 vegetarian, occasional vegan/beef)
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5 || (dayOfWeek === 6 && dayOffset < 14)) {
      activities.push({
        id: `demo-act-${dayOffset}-food-chk`,
        category: 'Food',
        activity_type: 'chicken',
        quantity: 1,
        unit: 'meal',
        emission: calculateEmission('chicken', 1),
        timestamp: new Date(dayDate.getTime() + 13 * 3600000).toISOString(),
        user_id: 'demo-user',
        notes: 'Grilled chicken lunch bowl',
      });
    } else {
      activities.push({
        id: `demo-act-${dayOffset}-food-veg`,
        category: 'Food',
        activity_type: 'vegetarian',
        quantity: 1,
        unit: 'meal',
        emission: calculateEmission('vegetarian', 1),
        timestamp: new Date(dayDate.getTime() + 13 * 3600000).toISOString(),
        user_id: 'demo-user',
        notes: 'Mediterranean chickpea salad',
      });
    }

    // Food waste: ~2 kg per week logged on Wednesdays and Sundays
    if (dayOfWeek === 0 || dayOfWeek === 3) {
      activities.push({
        id: `demo-act-${dayOffset}-waste`,
        category: 'Waste',
        activity_type: 'food_waste',
        quantity: 1.0,
        unit: 'kg',
        emission: calculateEmission('food_waste', 1.0),
        timestamp: new Date(dayDate.getTime() + 20 * 3600000).toISOString(),
        user_id: 'demo-user',
        notes: 'Kitchen organic waste',
      });
    }

    // Recycling: offset
    if (dayOfWeek === 6) {
      activities.push({
        id: `demo-act-${dayOffset}-recyc`,
        category: 'Waste',
        activity_type: 'recycling',
        quantity: 3.5,
        unit: 'kg',
        emission: calculateEmission('recycling', 3.5),
        timestamp: new Date(dayDate.getTime() + 11 * 3600000).toISOString(),
        user_id: 'demo-user',
        notes: 'Paper & cardboard curb dropoff',
      });
    }
  }

  return activities;
}

export const DEMO_GOALS = [
  {
    id: 'goal-1',
    title: 'Reduce monthly footprint by 20%',
    category: 'General',
    target: 20,
    unit: '% reduction',
    current: 14.5,
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    status: 'active',
  },
  {
    id: 'goal-2',
    title: 'Use public transport 10 times this month',
    category: 'Transportation',
    target: 10,
    unit: 'trips',
    current: 7,
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    status: 'active',
  },
  {
    id: 'goal-3',
    title: 'Reduce electricity consumption by 15%',
    category: 'Energy',
    target: 15,
    unit: '% kWh saved',
    current: 9.2,
    startDate: '2026-03-01',
    endDate: '2026-04-15',
    status: 'active',
  },
  {
    id: 'goal-4',
    title: 'Reduce food waste by 30%',
    category: 'Waste',
    target: 30,
    unit: '% waste cut',
    current: 24,
    startDate: '2026-02-15',
    endDate: '2026-03-31',
    status: 'active',
  },
];

export const DEMO_SCENARIOS = [
  {
    id: 'scenario-1',
    name: 'Transit First & Meatless Thursdays',
    createdAt: '2026-03-12T10:00:00Z',
    inputs: {
      carKm: 110, // down from 180
      metroKm: 70, // up from 25
      chickenMeals: 2, // down from 4
      electricityKwh: 36, // down from 42
      foodWasteKg: 1.2, // down from 2
    },
    currentFootprint: 53.4,
    simulatedFootprint: 36.8,
    reductionPercent: 31.1,
    annualSavingsKg: 863.2,
  },
  {
    id: 'scenario-2',
    name: 'Aggressive Grid & EV Optimization',
    createdAt: '2026-03-15T15:30:00Z',
    inputs: {
      carKm: 60,
      metroKm: 85,
      chickenMeals: 3,
      electricityKwh: 28,
      foodWasteKg: 1.0,
    },
    currentFootprint: 53.4,
    simulatedFootprint: 27.9,
    reductionPercent: 47.8,
    annualSavingsKg: 1326.0,
  },
];

export const DEMO_NEWS = [
  {
    id: 'news-1',
    title: 'Global High-Speed Rail Ridership Surges 18% in Urban Hubs',
    summary: 'Intercity and regional commuter lines report record modal shift from personal passenger cars, cutting localized transport emissions by an estimated 4.2 million tonnes of CO2e annually.',
    source: 'International Energy Agency (IEA)',
    source_url: 'https://www.iea.org/reports/rail',
    published_date: '2026-03-18',
    category: 'Transit & Mobility',
  },
  {
    id: 'news-2',
    title: 'Plant-Rich Dietary Shift Can Offset Up to 26% of Personal GHG Budgets',
    summary: 'A new comprehensive agricultural lifecycle assessment affirms that swapping two red meat meals weekly for legume- or fungal-protein alternatives yields an immediate 280 kg CO2e annual saving per capita.',
    source: 'Our World in Data / Oxford University',
    source_url: 'https://ourworldindata.org/environmental-impacts-of-food',
    published_date: '2026-03-16',
    category: 'Food Systems',
  },
  {
    id: 'news-3',
    title: 'Next-Generation Heat Pumps and Grid Balancing Reduce Peak Energy Load by 30%',
    summary: 'Decentralized smart-metering and cold-climate heat pumps demonstrate superior grid flexibility, enabling urban households to diminish baseline electricity emissions even amid winter cold snaps.',
    source: 'Renewable Energy World',
    source_url: 'https://www.renewableenergyworld.com',
    published_date: '2026-03-14',
    category: 'Clean Energy',
  },
  {
    id: 'news-4',
    title: 'Municipal Biogas Facilities Divert 80,000 Tons of Organic Waste From Landfills',
    summary: 'Anaerobic digestion of residential food waste avoids potent fugitive methane emissions, generating closed-loop heat and fertilizer for regional agriculture.',
    source: 'EPA Sustainable Materials Management',
    source_url: 'https://www.epa.gov/sustainable-management-food',
    published_date: '2026-03-11',
    category: 'Circular Economy',
  },
];
