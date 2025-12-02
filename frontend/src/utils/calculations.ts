export const calculateProfitPlan = (data: {
  cropType: string;
  farmSize: number;
  seedCost: number;
  fertilizerCost: number;
  laborCost: number;
  irrigationCost: number;
  expectedYield: number;
}) => {
  const totalCost =
    data.seedCost +
    data.fertilizerCost +
    data.laborCost +
    data.irrigationCost;

  const costPerAcre = totalCost / data.farmSize;
  const yieldPerAcre = data.expectedYield / data.farmSize;

  // Break-even price calculation
  const breakEvenPrice = data.expectedYield > 0 ? totalCost / data.expectedYield : 0;

  return {
    totalCost,
    costPerAcre,
    yieldPerAcre,
    breakEvenPrice,
    costBreakdown: {
      seeds: data.seedCost,
      fertilizer: data.fertilizerCost,
      labor: data.laborCost,
      irrigation: data.irrigationCost,
    },
  };
};

export const calculateRiskScore = (data: {
  cropType: string;
  farmSize: number;
  diversification: string;
  weatherRisk: string;
}) => {
  let score = 0;
  const risks: string[] = [];

  // Weather risk contribution (0-40 points)
  if (data.weatherRisk === 'high') {
    score += 40;
    risks.push('High weather risk in your area. Consider crop insurance.');
  } else if (data.weatherRisk === 'medium') {
    score += 20;
    risks.push('Moderate weather risk. Monitor forecasts regularly.');
  } else {
    score += 5;
  }

  // Diversification contribution (0-30 points)
  if (data.diversification === 'single') {
    score += 30;
    risks.push('Single crop dependency increases financial risk. Consider diversification.');
  } else if (data.diversification === 'multi') {
    score += 15;
    risks.push('Good diversification, but more crops can reduce risk further.');
  } else {
    score += 5;
  }

  // Farm size contribution (0-30 points)
  if (data.farmSize < 2) {
    score += 25;
    risks.push('Small farm size limits income potential. Explore cooperative farming.');
  } else if (data.farmSize < 5) {
    score += 15;
  } else {
    score += 5;
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high';
  if (score < 30) {
    riskLevel = 'low';
  } else if (score < 60) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }

  return {
    score,
    riskLevel,
    risks: risks.slice(0, 3), // Top 3 risks
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
