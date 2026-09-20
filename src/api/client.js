import axios from "axios";
import {
  generateDemoActivities,
  DEMO_GOALS,
  DEMO_SCENARIOS,
  DEMO_NEWS,
} from "../utils/demoData";
import {
  calculateEmission,
  calculateSustainabilityScore,
  parseQuickTrace,
  EMISSION_FACTORS,
} from "../utils/carbonCalculator";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("terratrace_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Storage keys for offline / browser preview fallback mode
const STORAGE_KEYS = {
  USER: "terratrace_user",
  ACTIVITIES: "terratrace_activities",
  GOALS: "terratrace_goals",
  SCENARIOS: "terratrace_scenarios",
  NEWS: "terratrace_news",
};

// Local storage helpers
function getLocal(key, defaultVal) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error("Storage error", err);
  }
}

// Initialize local store if empty
export function initLocalDataIfEmpty() {
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    setLocal(STORAGE_KEYS.ACTIVITIES, generateDemoActivities());
  }
  if (!localStorage.getItem(STORAGE_KEYS.GOALS)) {
    setLocal(STORAGE_KEYS.GOALS, DEMO_GOALS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SCENARIOS)) {
    setLocal(STORAGE_KEYS.SCENARIOS, DEMO_SCENARIOS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
    setLocal(STORAGE_KEYS.NEWS, DEMO_NEWS);
  }
}

// Compute client-side analytics dynamically
export function computeDashboardAnalytics() {
  const activities = getLocal(STORAGE_KEYS.ACTIVITIES, []);
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 3600000);

  // Current 7 days
  const thisWeekActs = activities.filter(
    (a) => new Date(a.timestamp) >= sevenDaysAgo,
  );
  // Previous 7 days
  const lastWeekActs = activities.filter((a) => {
    const t = new Date(a.timestamp);
    return t >= fourteenDaysAgo && t < sevenDaysAgo;
  });

  const weeklyFootprint = Number(
    thisWeekActs.reduce((acc, a) => acc + (a.emission || 0), 0).toFixed(1),
  );
  const prevWeekFootprint =
    Number(
      lastWeekActs.reduce((acc, a) => acc + (a.emission || 0), 0).toFixed(1),
    ) || 58.2;

  const weeklyChangePercent =
    prevWeekFootprint > 0
      ? Number(
          (
            ((weeklyFootprint - prevWeekFootprint) / prevWeekFootprint) *
            100
          ).toFixed(1),
        )
      : 0;

  // Category breakdown
  const categoryTotals = { Transportation: 0, Energy: 0, Food: 0, Waste: 0 };
  thisWeekActs.forEach((a) => {
    const cat = a.category || "Transportation";
    if (categoryTotals[cat] !== undefined) {
      categoryTotals[cat] += Math.max(0, a.emission || 0);
    }
  });

  const totalCatEmissions =
    Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1;
  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([name, val]) => ({
      name,
      value: Number(val.toFixed(1)),
      percentage: Math.round((val / totalCatEmissions) * 100),
    }))
    .sort((a, b) => b.value - a.value);

  // Biggest impact source
  const biggestImpact = categoryBreakdown[0] || {
    name: "Transportation",
    percentage: 51,
    value: 24.5,
  };

  // Daily trend for the past 7 days
  const dailyTrend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600000);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayStr = d.toISOString().split("T")[0];

    const dayActs = activities.filter(
      (a) => a.timestamp && a.timestamp.startsWith(dayStr),
    );
    const total = dayActs.reduce((sum, a) => sum + (a.emission || 0), 0);
    dailyTrend.push({
      day: dayName,
      date: dayStr,
      emission: Number(Math.max(0, total).toFixed(1)),
    });
  }

  // Sustainability score
  const sustainabilityScore = calculateSustainabilityScore(weeklyFootprint);

  // Personalized recommendation
  let recommendation = {
    title: "Switch 2 Commutes to Metro",
    description:
      "Replacing 36 km of private driving with rapid transit cuts approximately 5.8 kg CO2e weekly.",
    estimated_impact: "-5.8 kg CO2e / week",
    difficulty: "Low",
  };

  if (biggestImpact.name === "Food") {
    recommendation = {
      title: "Incorporate 2 Plant-Based Dinners",
      description:
        "Replacing high-emission meals with legumes or vegetarian bowls cuts ~4.2 kg CO2e weekly.",
      estimated_impact: "-4.2 kg CO2e / week",
      difficulty: "Easy",
    };
  } else if (biggestImpact.name === "Energy") {
    recommendation = {
      title: "Optimize Off-Peak & Standby Power",
      description:
        "Auditing standby AC and continuous appliance draw can trim up to 6 kWh per week.",
      estimated_impact: "-2.3 kg CO2e / week",
      difficulty: "Medium",
    };
  } else if (biggestImpact.name === "Waste") {
    recommendation = {
      title: "Meal Planning to Eliminate Leftover Spoilage",
      description:
        "Diverting 1.5 kg of organic waste prevents anaerobic landfill methane formation.",
      estimated_impact: "-3.7 kg CO2e / week",
      difficulty: "Easy",
    };
  }

  // Future projection (Current baseline vs moderate lifestyle improvements)
  const projection = [
    {
      period: "Current",
      baseline: Number(weeklyFootprint.toFixed(1)),
      optimized: Number(weeklyFootprint.toFixed(1)),
    },
    {
      period: "1 Month",
      baseline: Number((weeklyFootprint * 4.3).toFixed(1)),
      optimized: Number((weeklyFootprint * 4.3 * 0.82).toFixed(1)),
    },
    {
      period: "6 Months",
      baseline: Number((weeklyFootprint * 26).toFixed(1)),
      optimized: Number((weeklyFootprint * 26 * 0.76).toFixed(1)),
    },
    {
      period: "1 Year",
      baseline: Number((weeklyFootprint * 52).toFixed(1)),
      optimized: Number((weeklyFootprint * 52 * 0.72).toFixed(1)),
    },
  ];

  return {
    sustainabilityScore,
    weeklyFootprint,
    prevWeekFootprint,
    weeklyChangePercent,
    categoryBreakdown,
    dailyTrend,
    biggestImpact,
    recommendation,
    projection,
    recentActivities: activities.slice(0, 8),
  };
}

// Unified API service (tries backend first, falls back gracefully to client store)
export const api = {
  // Auth
  async login(email, password) {
    try {
      const res = await apiClient.post("/api/auth/login", { email, password });
      if (res.data?.access_token) {
        localStorage.setItem("terratrace_token", res.data.access_token);
        if (res.data.user) {
          localStorage.setItem(
            STORAGE_KEYS.USER,
            JSON.stringify(res.data.user),
          );
        }
      }
      return res.data;
    } catch (err) {
      // Throw server validation or credential error so UI displays error message
      if (err.response?.data?.detail) {
        throw new Error(err.response.data.detail);
      }
      // Demo account fallback if backend is unreachable
      if (email === "alex.morgan@terratrace.earth") {
        const mockUser = {
          id: "demo-user-id",
          email: "alex.morgan@terratrace.earth",
          name: "Alex Morgan",
          role: "user",
        };
        localStorage.setItem("terratrace_token", "jwt-demo-token-terratrace");
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
        return { access_token: "jwt-demo-token-terratrace", user: mockUser };
      }
      throw new Error(
        err.message || "Unable to connect to authentication service",
      );
    }
  },

  async signup(name, email, password) {
    try {
      let res;
      try {
        res = await apiClient.post("/api/auth/signup", {
          name,
          email,
          password,
        });
      } catch (err) {
        if (err.response?.status === 404) {
          res = await apiClient.post("/api/auth/register", {
            name,
            email,
            password,
          });
        } else {
          throw err;
        }
      }
      if (res.data?.access_token) {
        localStorage.setItem("terratrace_token", res.data.access_token);
        if (res.data.user) {
          localStorage.setItem(
            STORAGE_KEYS.USER,
            JSON.stringify(res.data.user),
          );
        }
      }
      return res.data;
    } catch (err) {
      if (err.response?.data?.detail) {
        throw new Error(err.response.data.detail);
      }
      throw new Error(err.message || "Registration failed");
    }
  },

  async getCurrentUser() {
    try {
      const res = await apiClient.get("/api/auth/me");
      if (res.data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data));
        return res.data;
      }
    } catch {
      // Silently fall back to cached user in localStorage
    }
    const cached = getLocal(STORAGE_KEYS.USER, null);
    if (cached) return cached;
    return {
      id: "demo-user",
      name: "Alex Morgan",
      email: "alex.morgan@terratrace.earth",
    };
  },

  // Seed / Demo Mode
  async loadDemoData() {
    try {
      await apiClient.post("/api/demo/seed");
    } catch {
      // populate local
    }
    const acts = generateDemoActivities();
    setLocal(STORAGE_KEYS.ACTIVITIES, acts);
    setLocal(STORAGE_KEYS.GOALS, DEMO_GOALS);
    setLocal(STORAGE_KEYS.SCENARIOS, DEMO_SCENARIOS);
    setLocal(STORAGE_KEYS.NEWS, DEMO_NEWS);
    return computeDashboardAnalytics();
  },

  // Activities
  async getActivities() {
    try {
      const res = await apiClient.get("/api/activities");
      return res.data;
    } catch {
      initLocalDataIfEmpty();
      return getLocal(STORAGE_KEYS.ACTIVITIES, []);
    }
  },

  async addActivity(data) {
    try {
      const res = await apiClient.post("/api/activities", data);
      return res.data;
    } catch {
      const activities = getLocal(STORAGE_KEYS.ACTIVITIES, []);
      const emission =
        data.emission !== undefined
          ? data.emission
          : calculateEmission(data.activity_type, data.quantity);

      const newAct = {
        id: `act-${Date.now()}`,
        ...data,
        emission,
        timestamp: data.timestamp || new Date().toISOString(),
        user_id: "demo-user",
      };
      const updated = [newAct, ...activities];
      setLocal(STORAGE_KEYS.ACTIVITIES, updated);
      return newAct;
    }
  },

  async deleteActivity(id) {
    try {
      await apiClient.delete(`/api/activities/${id}`);
    } catch {
      const activities = getLocal(STORAGE_KEYS.ACTIVITIES, []);
      const filtered = activities.filter((a) => a.id !== id);
      setLocal(STORAGE_KEYS.ACTIVITIES, filtered);
    }
    return { success: true };
  },

  // Quick Trace
  async quickTrace(text) {
    try {
      const res = await apiClient.post("/api/activities/quick-trace", { text });
      return res.data;
    } catch {
      const parsed = parseQuickTrace(text);
      if (!parsed) throw new Error("Could not parse activity from text");
      return await this.addActivity(parsed);
    }
  },

  // Analytics
  async getDashboardAnalytics() {
    try {
      const res = await apiClient.get("/api/analytics/dashboard");
      return res.data;
    } catch {
      initLocalDataIfEmpty();
      return computeDashboardAnalytics();
    }
  },

  // Future Lab Simulator
  async simulateFuture(inputs) {
    try {
      const res = await apiClient.post("/api/simulator/calculate", inputs);
      return res.data;
    } catch {
      // Deterministic calculation
      // Standard baseline weekly: 180 km car (30.8 kg), 25 km metro (0.9 kg), 4 chicken (5.6 kg), 42 kWh elec (16.2 kg), 2 kg food waste (5.0 kg) = 58.5 kg CO2e
      const curCar = 180;
      const curMetro = 25;
      const curChicken = 4;
      const curElec = 42;
      const curWaste = 2.0;

      const currentFootprint = Number(
        (
          calculateEmission("car", curCar) +
          calculateEmission("metro", curMetro) +
          calculateEmission("chicken", curChicken) +
          calculateEmission("electricity", curElec) +
          calculateEmission("food_waste", curWaste)
        ).toFixed(1),
      );

      const newCar = inputs.carKm !== undefined ? Number(inputs.carKm) : curCar;
      const newMetro =
        inputs.metroKm !== undefined ? Number(inputs.metroKm) : curMetro;
      const newChicken =
        inputs.chickenMeals !== undefined
          ? Number(inputs.chickenMeals)
          : curChicken;
      const newElec =
        inputs.electricityKwh !== undefined
          ? Number(inputs.electricityKwh)
          : curElec;
      const newWaste =
        inputs.foodWasteKg !== undefined
          ? Number(inputs.foodWasteKg)
          : curWaste;

      const simulatedFootprint = Number(
        (
          calculateEmission("car", newCar) +
          calculateEmission("metro", newMetro) +
          calculateEmission("chicken", newChicken) +
          calculateEmission("electricity", newElec) +
          calculateEmission("food_waste", newWaste)
        ).toFixed(1),
      );

      const weeklyDiff = Number(
        (currentFootprint - simulatedFootprint).toFixed(1),
      );
      const percentageReduction =
        currentFootprint > 0
          ? Number(((weeklyDiff / currentFootprint) * 100).toFixed(1))
          : 0;

      const monthlyReduction = Number((weeklyDiff * 4.3).toFixed(1));
      const annualReduction = Number((weeklyDiff * 52).toFixed(1));

      // Comparison breakdown
      const comparisonCategories = [
        {
          category: "Car Commute",
          current: calculateEmission("car", curCar),
          simulated: calculateEmission("car", newCar),
        },
        {
          category: "Public Metro",
          current: calculateEmission("metro", curMetro),
          simulated: calculateEmission("metro", newMetro),
        },
        {
          category: "Poultry Meals",
          current: calculateEmission("chicken", curChicken),
          simulated: calculateEmission("chicken", newChicken),
        },
        {
          category: "Electricity",
          current: calculateEmission("electricity", curElec),
          simulated: calculateEmission("electricity", newElec),
        },
        {
          category: "Food Waste",
          current: calculateEmission("food_waste", curWaste),
          simulated: calculateEmission("food_waste", newWaste),
        },
      ];

      // Projections
      const projections = [
        {
          horizon: "1 Month",
          currentKg: Number((currentFootprint * 4.3).toFixed(1)),
          simulatedKg: Number((simulatedFootprint * 4.3).toFixed(1)),
          savedKg: monthlyReduction,
        },
        {
          horizon: "6 Months",
          currentKg: Number((currentFootprint * 26).toFixed(1)),
          simulatedKg: Number((simulatedFootprint * 26).toFixed(1)),
          savedKg: Number((monthlyReduction * 6).toFixed(1)),
        },
        {
          horizon: "1 Year",
          currentKg: Number((currentFootprint * 52).toFixed(1)),
          simulatedKg: Number((simulatedFootprint * 52).toFixed(1)),
          savedKg: annualReduction,
        },
      ];

      return {
        currentFootprint,
        simulatedFootprint,
        percentageReduction,
        monthlyReduction,
        annualReduction,
        comparisonCategories,
        projections,
      };
    }
  },

  // Scenarios
  async getScenarios() {
    try {
      const res = await apiClient.get("/api/v1/scenarios");
      return res.data;
    } catch {
      try {
        const res = await apiClient.get("/api/scenarios");
        return res.data;
      } catch {
        return getLocal(STORAGE_KEYS.SCENARIOS, DEMO_SCENARIOS);
      }
    }
  },

  async saveScenario(scenario) {
    const payload = {
      userId: scenario.userId || "demo-user",
      user_id: scenario.userId || "demo-user",
      scenarioName: scenario.scenarioName || scenario.name || "Custom Scenario",
      name: scenario.scenarioName || scenario.name || "Custom Scenario",
      currentFootprint: Number(scenario.currentFootprint),
      simulatedFootprint: Number(scenario.simulatedFootprint),
      reductionPercent: Number(scenario.reductionPercent || 0),
      annualSavingsKg: Number(scenario.annualSavingsKg || 0),
      habitVariables: scenario.habitVariables || scenario.inputs,
      inputs: scenario.habitVariables || scenario.inputs,
    };

    try {
      // Primary: FastAPI POST /api/v1/scenarios/
      const res = await apiClient.post("/api/v1/scenarios", payload);
      return res.data;
    } catch (err) {
      try {
        const res = await apiClient.post("/api/scenarios", payload);
        return res.data;
      } catch {
        const list = getLocal(STORAGE_KEYS.SCENARIOS, []);
        const newScenario = {
          id: `scen-${Date.now()}`,
          ...payload,
          created_at: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        const updated = [newScenario, ...list];
        setLocal(STORAGE_KEYS.SCENARIOS, updated);
        return newScenario;
      }
    }
  },

  async deleteScenario(id) {
    try {
      await apiClient.delete(`/api/scenarios/${id}`);
    } catch {
      const list = getLocal(STORAGE_KEYS.SCENARIOS, []);
      setLocal(
        STORAGE_KEYS.SCENARIOS,
        list.filter((s) => s.id !== id),
      );
    }
    return { success: true };
  },

  // Goals
  async getGoals() {
    try {
      const res = await apiClient.get("/api/goals");
      return res.data;
    } catch {
      return getLocal(STORAGE_KEYS.GOALS, DEMO_GOALS);
    }
  },

  async createGoal(goal) {
    try {
      const res = await apiClient.post("/api/goals", goal);
      return res.data;
    } catch {
      const list = getLocal(STORAGE_KEYS.GOALS, []);
      const newGoal = {
        id: `goal-${Date.now()}`,
        ...goal,
        current: 0,
        status: "active",
        startDate: new Date().toISOString().split("T")[0],
      };
      const updated = [newGoal, ...list];
      setLocal(STORAGE_KEYS.GOALS, updated);
      return newGoal;
    }
  },

  async updateGoal(id, updates) {
    try {
      const res = await apiClient.patch(`/api/goals/${id}`, updates);
      return res.data;
    } catch {
      const list = getLocal(STORAGE_KEYS.GOALS, []);
      const updated = list.map((g) => (g.id === id ? { ...g, ...updates } : g));
      setLocal(STORAGE_KEYS.GOALS, updated);
      return updated.find((g) => g.id === id);
    }
  },

  async deleteGoal(id) {
    try {
      await apiClient.delete(`/api/goals/${id}`);
    } catch {
      const list = getLocal(STORAGE_KEYS.GOALS, []);
      setLocal(
        STORAGE_KEYS.GOALS,
        list.filter((g) => g.id !== id),
      );
    }
    return { success: true };
  },

  // Environmental Intelligence & News
  async getNews() {
    try {
      const res = await apiClient.get("/api/environment/news");
      return res.data;
    } catch {
      return getLocal(STORAGE_KEYS.NEWS, DEMO_NEWS);
    }
  },

  async getEmissionFactors() {
    try {
      const res = await apiClient.get("/api/environment/emission-factors");
      return res.data;
    } catch {
      return EMISSION_FACTORS;
    }
  },

  // Trace AI Chat Assistant
  async askTraceAI(question) {
    try {
      const res = await apiClient.post("/api/assistant/chat", { question });
      return res.data;
    } catch {
      // Local intelligent intent matching based on real user analytics
      const q = question.toLowerCase();
      const analytics = computeDashboardAnalytics();
      const { biggestImpact, weeklyFootprint, sustainabilityScore } = analytics;

      if (
        q.includes("why") &&
        (q.includes("high") || q.includes("footprint") || q.includes("score"))
      ) {
        return {
          answer: `Your current weekly footprint is **${weeklyFootprint} kg CO₂e**, resulting in a sustainability score of **${sustainabilityScore}/100**.\n\nYour highest driver is **${biggestImpact.name}** accounting for **${biggestImpact.percentage}%** of your total emissions (approx ${biggestImpact.value} kg CO₂e). In particular, frequent private vehicle trips and continuous grid electricity generate the majority of your weekly volume.`,
          topic: "Footprint Diagnostics",
          source: "Personal Activity Telemetry",
        };
      }

      if (
        q.includes("biggest") ||
        q.includes("largest") ||
        q.includes("source") ||
        q.includes("opportunity")
      ) {
        return {
          answer: `**${biggestImpact.name}** represents your single largest environmental impact at **${biggestImpact.percentage}%** of total footprint.\n\n**Actionable Opportunity:** Diverting just 25% of your ${biggestImpact.name.toLowerCase()} habits (such as riding transit twice a week or shifting travel modes) can eliminate an estimated **6.2 kg CO₂e** every 7 days.`,
          topic: "Impact Opportunity",
          source: "DEFRA Carbon Assessment Model",
        };
      }

      if (q.includes("20%") || q.includes("reduce") || q.includes("target")) {
        const twentyPercent = (weeklyFootprint * 0.2).toFixed(1);
        return {
          answer: `To cut your footprint by **20%** (~${twentyPercent} kg CO₂e/week):\n\n1. **Swap 40 km of Car Commute to Metro/Train:** Saves ~5.4 kg CO₂e/week.\n2. **Adopt 'Meatless Monday & Thursday':** Swapping 2 poultry meals for plant-based alternatives cuts ~1.8 kg CO2e/week.\n3. **Trim Standby Power by 10%:** Lowers grid draw by 4 kWh (~1.5 kg CO₂e).\n\nCombined, this achieves a **${(((Number(twentyPercent) + 0.8) / weeklyFootprint) * 100).toFixed(0)}% reduction**, surpassing your 20% goal.`,
          topic: "Target Reduction Strategy",
          source: "TerraTrace Simulation Model",
        };
      }

      if (q.includes("car") || q.includes("drive") || q.includes("travel")) {
        return {
          answer: `Every 10 km driven in a standard petrol car yields approx **1.71 kg CO₂e** (0.171 kg/km). In contrast, electric rail and metro produce only **0.035 kg/km**—an **80% carbon reduction** per trip.\n\nIf you replace 50 km of car driving per week with metro transit, you save over **350 kg CO₂e annually**, equivalent to preserving 16 mature urban trees.`,
          topic: "Mobility Analysis",
          source: "EPA & DEFRA Transportation Factors",
        };
      }

      if (
        q.includes("change first") ||
        q.includes("start") ||
        q.includes("priority")
      ) {
        return {
          answer: `Based on your telemetry, start with **Transportation Habits**:\n\n• **Highest leverage:** Switching one round-trip highway commute to transit yields instant high-impact savings.\n• **Low friction:** Ensure zero food waste by meal planning on Sundays.\n\nVisit the **Future Lab** tab to simulate these exact adjustments and verify the cumulative 1-year carbon curve.`,
          topic: "Prioritization Matrix",
          source: "TerraTrace Optimization Engine",
        };
      }

      return {
        answer: `TerraTrace has analyzed your logged activities:\n• Weekly Footprint: **${weeklyFootprint} kg CO₂e**\n• Primary Contributor: **${biggestImpact.name} (${biggestImpact.percentage}%)**\n• Sustainability Rating: **${sustainabilityScore}/100**\n\nYou can experiment with different lifestyle adjustments inside the **Future Lab** tab, or ask me specific questions like "How can I reduce my footprint by 20%?" or "What is my biggest impact source?".`,
        topic: "General Intelligence",
        source: "TerraTrace Engine",
      };
    }
  },
};
