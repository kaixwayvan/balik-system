export const statsData = [
  {
    title: "Total Users",
    value: 0,
    type: "users",
  },
  {
    title: "Active Today",
    value: 0,
    type: "active",
  },
  {
    title: "Rewards Issued",
    value: 0,
    type: "rewards",
  },
  {
    title: "Avg. Task Completion",
    value: 0,
    type: "completion",
  },
];

export const badgesData = [
  {
    title: "First Report",
    description: "Auto-awarded after first verified report",
    users: 0,
  },
  {
    title: "Trusted User",
    description: "90% Successful claims",
    users: 0,
  },
  {
    title: "Consistent Reporter",
    description: "5 verified reports",
    users: 0,
  },
];

export const certificatesData = [
  {
    title: "Trusted Finder Certificate",
    requirements: [
      "Report at least 5 found items.",
      "Successful claim rate ≥ 80%",
      "No policy violations.",
    ],
  },
  {
    title: "Consistent Reporter Certificate",
    requirements: [
      "Report at least 1 item for 3 consecutive months.",
      "At least 1 verified report each month",
    ],
  },
];

export const levelRulesData = [
  {
    from: "Level 1",
    to: "Level 2",
    requirement: "2 verified reports + 100 points",
  },
  {
    from: "Level 2",
    to: "Level 3",
    requirement: "85% accuracy + 5 verified reports",
  },
];

export const auditLogsData = [];