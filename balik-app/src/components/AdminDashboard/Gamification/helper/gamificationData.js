export const statsData = [
  {
    title: "Total Users",
    value: 127,
    type: "users",
  },
  {
    title: "Active Today",
    value: 89,
    type: "active",
  },
  {
    title: "Rewards Issued",
    value: 23,
    type: "rewards",
  },
  {
    title: "Avg. Task Completion",
    value: 68,
    type: "completion",
  },
];

export const badgesData = [
  {
    title: "First Report",
    description: "Auto-awarded after first verified report",
    users: 90,
  },
  {
    title: "Trusted User",
    description: "90% Successful claims",
    users: 40,
  },
  {
    title: "Consistent Reporter",
    description: "5 verified reports",
    users: 60,
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

export const auditLogsData = [
  "User #104 reached Level 3",
  "Trusted Finder Certificate issued to User #112",
  "Consistent Reporter Badge issued to User #087",
];