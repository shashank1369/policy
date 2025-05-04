// This file contains mock data that will be used to simulate dynamic content
// In a real application, this would come from an API

export type Policy = {
  id: string
  type: "home" | "travel"
  name: string
  policyNumber: string
  coverage: number
  premium: number
  startDate: string
  endDate: string
  status: "active" | "pending" | "expired"
  description?: string
  iconColor?: string
}

export type Recommendation = {
  id: string
  type: "home" | "travel"
  name: string
  description: string
  coverage: number
  premium: number
  matchPercentage: number
  benefits: string[]
  imageUrl: string
}

export type Activity = {
  id: string
  type: "payment" | "document" | "claim" | "support" | "calculation" | "policy"
  title: string
  description: string
  date: string
  amount?: number
  status?: string
}

export type Claim = {
  id: string
  policyId: string
  policyType: "home" | "travel"
  claimNumber: string
  amount: number
  status: "pending" | "processing" | "approved" | "rejected"
  filedDate: string
  description: string
}

export type UserStats = {
  activePolicies: number
  prominenceScore: number
  recentClaims: number
  nextPayment: {
    amount: number
    dueInDays: number
  }
}

export type CompanyStats = {
  activePolicies: number
  totalRevenue: number
  activeClaims: number
  customerRating: number
  growthRates: {
    policies: number
    revenue: number
    claims: number
    rating: number
  }
}

export type CustomerTier = "premium" | "valuable" | "standard"

export type Customer = {
  id: string
  name: string
  email: string
  tier: CustomerTier
  policyCount: number
  totalPremium: number
  joinDate: string
  initials: string
  avatarBgColor: string
}

export type InsuranceProduct = {
  id: string
  type: "home" | "travel"
  name: string
  description: string
  activePolicies: number
  revenue: number
  claimsRatio: number
}

// Generate mock data based on user email to simulate personalized content
export function generateMockData(email: string, userType: "customer" | "company") {
  // Use email as a seed for "randomness" to ensure consistent data for the same user
  const seed = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Simple function to get deterministic "random" numbers based on seed
  const getRandomNumber = (min: number, max: number, offset = 0) => {
    const value = ((seed + offset) % (max - min)) + min
    return value
  }

  if (userType === "customer") {
    // Generate customer-specific data
    const userStats: UserStats = {
      activePolicies: getRandomNumber(0, 3, 1), // 0, 1, or 2 policies
      prominenceScore: getRandomNumber(650, 850, 2),
      recentClaims: getRandomNumber(0, 3, 3),
      nextPayment: {
        amount: getRandomNumber(2000, 15000, 4),
        dueInDays: getRandomNumber(5, 30, 5),
      },
    }

    // Generate policies based on user stats
    const policies: Policy[] = []
    const policyTypes: Array<"home" | "travel"> = ["home", "travel"]

    // Determine which policies the user has based on the seed
    const hasHomePolicyFirst = seed % 2 === 0

    for (let i = 0; i < userStats.activePolicies; i++) {
      // If user has only one policy, determine which one based on seed
      // If user has two policies, they'll have both home and travel
      const type =
        userStats.activePolicies === 1 ? (hasHomePolicyFirst ? "home" : "travel") : policyTypes[i % policyTypes.length]

      const policyId = `${type.charAt(0).toUpperCase()}I-${2023 + (i % 3)}-${getRandomNumber(10000, 99999, i)}`

      const iconColor = type === "home" ? "from-emerald-500 to-teal-600" : "from-blue-500 to-indigo-600"

      policies.push({
        id: `policy-${i}-${seed}`,
        type,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Insurance`,
        policyNumber: policyId,
        coverage: getRandomNumber(500000, 10000000, i * 10),
        premium: getRandomNumber(1000, 5000, i * 5),
        startDate: `${getRandomNumber(1, 28, i)}-${getRandomNumber(1, 12, i + 1)}-${2023 + (i % 3)}`,
        endDate: `${getRandomNumber(1, 28, i)}-${getRandomNumber(1, 12, i + 1)}-${2024 + (i % 3)}`,
        status: "active",
        iconColor,
      })
    }

    // Generate recommendations (always at least one for UI consistency)
    const recommendations: Recommendation[] = []

    // Recommend policies the user doesn't have
    const userHasHome = policies.some((policy) => policy.type === "home")
    const userHasTravel = policies.some((policy) => policy.type === "travel")

    if (!userHasHome) {
      recommendations.push({
        id: `rec-home-${seed}`,
        type: "home",
        name: "Home Insurance",
        description: "Comprehensive home insurance tailored to your needs",
        coverage: getRandomNumber(5000000, 10000000, 15),
        premium: getRandomNumber(1500, 3500, 7),
        matchPercentage: getRandomNumber(85, 98, 1),
        benefits: [
          "Comprehensive Coverage",
          "Natural Disaster Protection",
          "Theft & Burglary Protection",
          "Liability Coverage",
        ],
        imageUrl: `/placeholder.svg?height=128&width=384&text=Home+Insurance`,
      })
    }

    if (!userHasTravel) {
      recommendations.push({
        id: `rec-travel-${seed}`,
        type: "travel",
        name: "Travel Insurance",
        description: "Worldwide travel coverage for your journeys",
        coverage: getRandomNumber(2000000, 5000000, 25),
        premium: getRandomNumber(1000, 3000, 17),
        matchPercentage: getRandomNumber(80, 95, 2),
        benefits: ["Medical Expenses", "Trip Cancellation", "Lost Baggage", "24/7 Global Assistance"],
        imageUrl: `/placeholder.svg?height=128&width=384&text=Travel+Insurance`,
      })
    }

    // If user already has both policies, recommend an upgrade to one of them
    if (userHasHome && userHasTravel) {
      const upgradeType = seed % 2 === 0 ? "home" : "travel"
      recommendations.push({
        id: `rec-upgrade-${seed}`,
        type: upgradeType,
        name: `Premium ${upgradeType.charAt(0).toUpperCase() + upgradeType.slice(1)} Insurance`,
        description: `Upgrade your ${upgradeType} insurance for enhanced coverage`,
        coverage: getRandomNumber(10000000, 20000000, 35),
        premium: getRandomNumber(3500, 6000, 27),
        matchPercentage: getRandomNumber(88, 96, 3),
        benefits: [
          "Enhanced Coverage",
          "Premium Customer Service",
          "Lower Deductibles",
          upgradeType === "home" ? "Additional Living Expenses" : "Adventure Activities Coverage",
        ],
        imageUrl: `/placeholder.svg?height=128&width=384&text=Premium+${upgradeType.charAt(0).toUpperCase() + upgradeType.slice(1)}+Insurance`,
      })
    }

    // Generate recent activities
    const activityTypes: Array<"payment" | "document" | "claim" | "support" | "calculation" | "policy"> = [
      "payment",
      "document",
      "claim",
      "support",
      "calculation",
      "policy",
    ]

    const activities: Activity[] = []
    for (let i = 0; i < 4; i++) {
      const type = activityTypes[i % activityTypes.length]
      const daysAgo = i * 3 + getRandomNumber(1, 5, i)
      const policyType = policies.length > 0 ? policies[i % policies.length]?.type : seed % 2 === 0 ? "home" : "travel"

      let title = ""
      let description = ""

      switch (type) {
        case "payment":
          title = "Premium Payment"
          description = `You paid ₹${getRandomNumber(1000, 5000, i)} for ${policyType.charAt(0).toUpperCase() + policyType.slice(1)} Insurance`
          break
        case "document":
          title = "Document Upload"
          description = `You uploaded documents for ${policyType.charAt(0).toUpperCase() + policyType.slice(1)} Insurance verification`
          break
        case "claim":
          title = "Claim Filed"
          description = `You filed a claim for ${policyType.charAt(0).toUpperCase() + policyType.slice(1)} Insurance`
          break
        case "support":
          title = "Support Chat"
          description = "You chatted with our support team"
          break
        case "calculation":
          title = "Premium Calculation"
          description = `You calculated premium for ${policyType.charAt(0).toUpperCase() + policyType.slice(1)} Insurance`
          break
        case "policy":
          title = "Policy Renewed"
          description = `Your ${policyType.charAt(0).toUpperCase() + policyType.slice(1)} Insurance policy was renewed`
          break
      }

      activities.push({
        id: `activity-${i}-${seed}`,
        type,
        title,
        description,
        date: `April ${getRandomNumber(1, 28, i * 3)}, 2025`,
        amount: type === "payment" ? getRandomNumber(1000, 5000, i) : undefined,
      })
    }

    // Generate claims
    const claims: Claim[] = []
    for (let i = 0; i < userStats.recentClaims; i++) {
      const policyType = policies.length > 0 ? policies[i % policies.length]?.type : seed % 2 === 0 ? "home" : "travel"

      const claimReasons = {
        home: ["water damage", "fire damage", "theft", "structural damage", "natural disaster"],
        travel: ["medical emergency", "trip cancellation", "lost baggage", "flight delay", "accommodation issues"],
      }

      const reason = claimReasons[policyType][i % claimReasons[policyType].length]

      claims.push({
        id: `claim-${i}-${seed}`,
        policyId: policies.find((p) => p.type === policyType)?.id || `policy-${i}-${seed}`,
        policyType,
        claimNumber: `CL-${2023 + (i % 3)}-${getRandomNumber(10000, 99999, i)}`,
        amount: policyType === "home" ? getRandomNumber(50000, 500000, i * 5) : getRandomNumber(10000, 100000, i * 5),
        status: ["pending", "processing", "approved", "rejected"][i % 4] as any,
        filedDate: `April ${getRandomNumber(1, 28, i * 2)}, 2025`,
        description: `Claim for ${policyType} insurance due to ${reason}`,
      })
    }

    return {
      userStats,
      policies,
      recommendations,
      activities,
      claims,
    }
  } else {
    // Generate company-specific data
    const companyStats: CompanyStats = {
      activePolicies: getRandomNumber(80, 200, 1),
      totalRevenue: getRandomNumber(1500000, 5000000, 2) / 100, // In lakhs
      activeClaims: getRandomNumber(5, 15, 3),
      customerRating: 4 + getRandomNumber(0, 10, 4) / 10,
      growthRates: {
        policies: getRandomNumber(2, 15, 5),
        revenue: getRandomNumber(5, 20, 6),
        claims: getRandomNumber(-5, 5, 7),
        rating: getRandomNumber(-5, 15, 8) / 10,
      },
    }

    // Generate insurance products - only home and travel
    const insuranceProducts: InsuranceProduct[] = [
      {
        id: `product-home-${seed}`,
        type: "home",
        name: "Home Insurance",
        description: "Comprehensive home protection plans",
        activePolicies: Math.floor(companyStats.activePolicies * 0.6),
        revenue: Math.floor(companyStats.totalRevenue * 0.6),
        claimsRatio: getRandomNumber(8, 20, 1),
      },
      {
        id: `product-travel-${seed}`,
        type: "travel",
        name: "Travel Insurance",
        description: "International and domestic travel coverage",
        activePolicies: Math.floor(companyStats.activePolicies * 0.4),
        revenue: Math.floor(companyStats.totalRevenue * 0.4),
        claimsRatio: getRandomNumber(5, 15, 2),
      },
    ]

    // Generate customers
    const customerNames = [
      "Alex Johnson",
      "Sarah Parker",
      "Raj Kumar",
      "Maria Garcia",
      "David Smith",
      "Priya Patel",
      "John Williams",
      "Emma Brown",
    ]

    const customers: Customer[] = []
    const tiers: CustomerTier[] = ["premium", "valuable", "standard"]
    const colors = ["emerald", "blue", "purple", "amber", "rose", "indigo", "teal", "pink"]

    for (let i = 0; i < 8; i++) {
      const name = customerNames[i]
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")

      customers.push({
        id: `customer-${i}-${seed}`,
        name,
        email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
        tier: tiers[i % 3],
        policyCount: getRandomNumber(1, 3, i),
        totalPremium: getRandomNumber(5000, 50000, i * 5),
        joinDate: `${getRandomNumber(1, 28, i)}-${getRandomNumber(1, 12, i + 1)}-${2022 + (i % 3)}`,
        initials,
        avatarBgColor: `${colors[i % colors.length]}-100`,
      })
    }

    // Generate claims
    const claims: Claim[] = []
    const policyTypes: Array<"home" | "travel"> = ["home", "travel"]

    const claimReasons = {
      home: ["water damage", "fire damage", "theft", "structural damage", "natural disaster"],
      travel: ["medical emergency", "trip cancellation", "lost baggage", "flight delay", "accommodation issues"],
    }

    for (let i = 0; i < companyStats.activeClaims; i++) {
      const policyType = policyTypes[i % policyTypes.length]
      const reason = claimReasons[policyType][i % claimReasons[policyType].length]

      claims.push({
        id: `claim-${i}-${seed}`,
        policyId: `policy-${i}-${seed}`,
        policyType,
        claimNumber: `${policyType.charAt(0).toUpperCase()}C-${2023}-${getRandomNumber(100, 999, i)}`,
        amount: policyType === "home" ? getRandomNumber(50000, 500000, i * 10) : getRandomNumber(10000, 100000, i * 10),
        status: ["pending", "processing"][i % 2] as any,
        filedDate: `April ${getRandomNumber(1, 28, i)}, 2025`,
        description: `${policyType.charAt(0).toUpperCase() + policyType.slice(1)} insurance claim for ${reason}`,
      })
    }

    return {
      companyStats,
      insuranceProducts,
      customers,
      claims,
    }
  }
}
