export interface Lesson {
  id: string;
  title: string;
  content: string;
  tips: string[];
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  lessons: Lesson[];
}

export const LEARNING_MODULES: Module[] = [
  {
    id: 'middleman',
    title: 'Spot Middleman Cheating',
    icon: 'account-alert',
    lessons: [
      {
        id: 'middleman-1',
        title: 'Warning Signs',
        content:
          'Middlemen often exploit farmers by manipulating prices and weights. Learn to recognize the red flags.',
        tips: [
          'Always verify weight measurements yourself',
          'Get price quotes from multiple buyers before selling',
          'Be wary of middlemen who pressure quick decisions',
          'Check current market rates on your phone before negotiating',
          'Join farmer groups to share information about honest buyers',
        ],
      },
      {
        id: 'middleman-2',
        title: 'Common Tricks',
        content:
          'Understanding common exploitation tactics helps you protect your income.',
        tips: [
          'False weighing: Tampered scales show less weight than actual',
          'Quality downgrading: Claiming good produce as lower quality',
          'Delayed payment: Promising higher prices but never paying',
          'Hidden deductions: Unexpected charges for transport or storage',
          'Price manipulation: Claiming market prices are lower than reality',
        ],
      },
      {
        id: 'middleman-3',
        title: 'Protection Strategies',
        content:
          'Practical steps to ensure fair treatment and payment.',
        tips: [
          'Use government mandis (markets) with regulated prices',
          'Carry your own weighing scale for verification',
          'Document all transactions with photos and receipts',
          'Form farmer cooperatives to negotiate better prices',
          'Use government apps like eNAM for price information',
        ],
      },
    ],
  },
  {
    id: 'pricing',
    title: 'Fair Market Prices',
    icon: 'cash',
    lessons: [
      {
        id: 'pricing-1',
        title: 'How Prices Work',
        content:
          'Agricultural prices are affected by supply, demand, season, and government policies.',
        tips: [
          'Prices are highest when supply is low and demand is high',
          'Seasonal factors: Harvest time often has lowest prices',
          'Government MSP (Minimum Support Price) sets a floor price',
          'Quality and freshness affect pricing significantly',
          'Transportation costs impact final prices in urban markets',
        ],
      },
      {
        id: 'pricing-2',
        title: 'Finding Fair Prices',
        content:
          'Resources and methods to discover accurate market prices.',
        tips: [
          'Check government MSP announcements regularly',
          'Use eNAM app for real-time mandi prices nationwide',
          'Compare prices across multiple nearby markets',
          'Consider transportation and handling costs',
          'Track price trends to time your sales better',
        ],
      },
      {
        id: 'pricing-3',
        title: 'Negotiation Tips',
        content:
          'Effective strategies to get the best price for your produce.',
        tips: [
          'Know your bottom line (break-even price) before negotiating',
          'Show quality samples to justify higher prices',
          'Be willing to walk away from unfair offers',
          'Build long-term relationships with honest buyers',
          'Time your harvest to avoid peak supply periods if possible',
        ],
      },
    ],
  },
  {
    id: 'insurance',
    title: 'Crop Insurance',
    icon: 'shield-check',
    lessons: [
      {
        id: 'insurance-1',
        title: 'Why Insurance Matters',
        content:
          'Crop insurance protects farmers from losses due to natural calamities and price crashes.',
        tips: [
          'Protects against drought, flood, pests, and diseases',
          'Government subsidizes 50% of premium costs',
          'Provides financial security during crop failure',
          'Helps avoid falling into debt after bad seasons',
          'Available for most major crops and regions',
        ],
      },
      {
        id: 'insurance-2',
        title: 'PMFBY Scheme',
        content:
          'Pradhan Mantri Fasal Bima Yojana is the main government crop insurance program.',
        tips: [
          'Very low premium: 2% for Kharif, 1.5% for Rabi crops',
          'Covers all stages from sowing to post-harvest',
          'Compensation based on area-level crop loss assessment',
          'Automatic enrollment if you have crop loan',
          'Apply through banks, CSCs, or online portal',
        ],
      },
      {
        id: 'insurance-3',
        title: 'Making Claims',
        content:
          'Steps to successfully claim crop insurance compensation.',
        tips: [
          'Report crop loss within 72 hours to insurance company',
          'Provide required documents: land records, photos',
          'Cooperate with field inspection by officials',
          'Follow up regularly on claim status',
          'Keep copies of all applications and receipts',
        ],
      },
    ],
  },
  {
    id: 'diversification',
    title: 'Crop Diversification',
    icon: 'flower',
    lessons: [
      {
        id: 'diversification-1',
        title: 'Benefits of Diversification',
        content:
          'Growing multiple crops reduces risk and increases income stability.',
        tips: [
          'Spreads risk: If one crop fails, others may succeed',
          'Better soil health through crop rotation',
          'Multiple income streams throughout the year',
          'Reduces pest and disease buildup',
          'Takes advantage of different market opportunities',
        ],
      },
      {
        id: 'diversification-2',
        title: 'Choosing Crops',
        content:
          'Selecting the right combination of crops for your land and market.',
        tips: [
          'Consider soil type and water availability',
          'Mix short and long duration crops',
          'Combine food crops with cash crops',
          'Include legumes to improve soil nitrogen',
          'Research local market demand before planting',
        ],
      },
      {
        id: 'diversification-3',
        title: 'Implementation Strategy',
        content:
          'Practical steps to transition to diversified farming.',
        tips: [
          'Start small: Add one new crop per season',
          'Learn from successful farmers in your area',
          'Get training from agricultural extension officers',
          'Plan crop calendar to optimize land use',
          'Keep detailed records to evaluate profitability',
        ],
      },
    ],
  },
  {
    id: 'finance',
    title: 'Debt vs Equity',
    icon: 'bank',
    lessons: [
      {
        id: 'finance-1',
        title: 'Understanding Debt',
        content:
          'Loans must be repaid with interest, regardless of crop success or failure.',
        tips: [
          'Debt creates fixed obligations that must be paid',
          'High interest rates (especially from moneylenders) are dangerous',
          'Prefer bank loans over informal loans (lower interest)',
          'Calculate if expected income can cover loan + interest',
          'Avoid borrowing for consumption, only for productive investments',
        ],
      },
      {
        id: 'finance-2',
        title: 'Better Financing Options',
        content:
          'Government schemes and cooperative options offer safer financing.',
        tips: [
          'KCC (Kisan Credit Card): Low interest farm loans from banks',
          'Government subsidies: Up to 50% off for equipment, seeds',
          'SHG (Self Help Groups): Community-based savings and lending',
          'Cooperative societies: Shared investments and profits',
          'PM-KISAN: Direct income support of ₹6000/year',
        ],
      },
      {
        id: 'finance-3',
        title: 'Debt Management',
        content:
          'If already in debt, smart strategies can help you recover.',
        tips: [
          'List all debts: Amount, interest rate, due dates',
          'Prioritize high-interest debts first',
          'Negotiate with lenders for extended payment terms',
          'Consider debt restructuring schemes from banks',
          'Seek help from agricultural department before crisis deepens',
        ],
      },
    ],
  },
];
