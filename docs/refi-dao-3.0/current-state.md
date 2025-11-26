# ReFi DAO 2.0 Current State Assessment

**Last Updated:** November 2025  
**Status:** Comprehensive Assessment Complete  
**Purpose:** Document current state of ReFi DAO 2.0 to inform ReFi DAO 3.0 planning

---

## 1. ReFi DAO 2.0 Achievement Summary

### 1.1 Infrastructure Completion

ReFi DAO 2.0 successfully completed its infrastructure-building phase (2024-H2 2025), establishing a fully operational network society with:

**On-Chain Role Management:**
- Deployed 5 operational roles via Hats Protocol:
  - Core Stewards (strategic facilitators)
  - Core Contributors & Advisors (experts and collaborators)
  - Local Node Leads (regional coordinators)
  - Network Initiative Leads (specialized working group coordinators)
  - Network Members (entry-level membership)
- Integrated with Guild.xyz for automated access control
- On-chain role tracking and verification

**Gardens Funding Pools:**
- **Local Node Kickstarter Pool:** ~€1.9k remaining (originally 3k USDGLO)
  - Successfully funded: ReFi Marseille (€1.9k), ReFi Lagos
  - Up to 500 USDGLO per proposal for new nodes
- **Network Initiatives Pool:** ~€2.8k remaining (originally 3k USDGLO)
  - Up to 3,000 USDGLO per proposal for network-wide projects
  - Ready to fund: Research & Media Initiative, other initiatives

**Treasury Consolidation:**
- Completed migration to cross-chain Safe wallets
- Deployed across: Ethereum, Celo, Base, Arbitrum, Gnosis Chain, Optimism, Polygon
- Treasury addresses:
  - ReFi DAO Treasury: 0x68060388C7D97B4bF779a2Ead46c86e5588F073f
  - ReFi DAO Hot wallet (refidao.eth): 0x7340F1a1e4e38F43d2FCC85cdb2b764de36B40c0

**Legal Framework:**
- ReFi Foundation Fiscal Sponsorship established
- Provides legal structure for operations

### 1.2 Governance Framework Implementation

**Consent-Based, Optimistic Governance:**
- Enables Local Nodes and Network Initiatives to act autonomously within mission-aligned boundaries
- Uses biannual strategic planning cycle for alignment
- Transparent decision-making, role accountability, adaptive review processes
- Principles from The Androgynous Organisation (T.A.O.), DACI frameworks, regenerative organizational cycles

**Biannual Strategic Planning:**
- First strategic plan completed (H2 2025)
- Establishes framework for ongoing planning cycles

**Forum & Communication:**
- Regen Coordination Hub activated for governance discussions
- Role-specific Telegram groups for coordination
- Monthly ReFi DAO Global sessions
- Quarterly community (ReFi DAO Network) calls

### 1.3 Network Structure

**Multi-Layered Network:**
- **ReFi DAO Global:** Operational and governance layer
  - Strategic planning, treasury management, network coordination
  - Core Stewards, Contributors, Advisors
- **ReFi Local Nodes:** Place-based communities
  - Implementing regenerative finance experiments regionally
  - Operating autonomously while aligned with Community Covenant
- **Network Initiatives:** Autonomous working groups
  - Specialized solutions for regenerative finance ecosystem
  - Examples: ReFi Podcast, Research & Media, Local Node Support
- **Network Members:** Entry-level membership
  - Anyone aligned with mission who signs Community Covenant

### 1.4 Contributor Status

**H2 2025 Renewal Results:**
- 12 active contributors renewed for H2 2025
- 92% contributor retention rate (12/13 continuing from renewal survey)
- 13 contributor feedback responses informing strategic priorities
- 2 new local node leads joining ReFi DAO Global:
  - Alejandra (ReFi Marseille) - joining as Core Contributor
  - Michael (ReFi Lagos) - invited, pending form completion

**Contribution Points System:**
- Recognition system for meaningful engagement across all roles
- Points earned across financial, labor, expertise, and participation domains
- On-chain integration with Prosperity Pass for verifiable reputation tracking
- Contributor Levels recognize sustained involvement over time

### 1.5 Local Nodes Status

**Active Nodes (8-10 globally):**
- ReFi Marseille (Alejandra) - newly activated, applying to GG24 Mediterranean round
- ReFi Lagos (Michael) - launching with focus on no-code tools for Global South builders
- ReFi Mediterranean (Antonio) - stewarding regional coordination, submitted GG24 application
- ReFi Lisboa (Rica) - established node, seeking increased involvement pathways
- ReFi Medellín/Colombia (Ana, Juan) - coordinating Colombian nodes, connecting local to global
- ReFi Barcelona (coordination: luizfernando) - €11k secured for DD24 localized fund, €30k matching potential
- Additional nodes: Tulum, Red Hook/Brooklyn (Eve - climate justice focus), Tunisia (John - accessibility tools)

**Newly Funded Nodes:**
- ReFi Marseille: €1,900 approved via Gardens
- ReFi Lagos: Funding approved via Gardens

**DD24 & Localism.fund Opportunities:**
- Three funding rounds launching:
  1. Local grant programs - supporting local capital allocation projects
  2. LatAm meetups - €30k from Ethereum Foundation for monthly gatherings
  3. Bioregional reforestation - tree planting funding

### 1.6 Platform Partnerships

**Regenerative.fi:**
- Partnership discussions for platform launch support
- Content creation collaboration
- Community airdrop coordination
- $ReFi token launch coordination (Q1 2026)

**Prosperity Pass:**
- Integration with Contribution Points system
- On-chain reputation tracking
- Badge system for ReFi DAO contributors

### 1.7 Documentation Hub Completion

**Published Resources:**
- Comprehensive resources hub at regencoordination.xyz/refidao
- Community Covenant v1.0 (mission, vision, values)
- Network Structure, Roles & Governance framework
- Onboarding guides for all participation levels:
  - Network Member onboarding
  - Local Node Leader onboarding
  - Network Initiative Leader onboarding
  - Global Contributor onboarding
- Contribution Points system documentation
- Local Node Toolkit
- Membership agreements

**Operational Tools Integration:**
- KarmaGAP for project tracking and milestone reporting
- Contribution tracking integrated with Prosperity Pass and Airtable
- Gardens platform for democratic resource allocation

---

## 2. Infrastructure Status Assessment

### 2.1 Website Migration Status

**Current Status:** Phase 1 Complete, Phase 2-6 Pending

**Phase 1: Webflow Fix (Complete)**
- Removed problematic user account infrastructure
- Deleted defunct pages (events, guilds, working groups)
- Preserved functional elements (about, media, community pages)
- Site backup created as safety net

**Remaining Phases:**
- Phase 2: Content extraction from Webflow
- Phase 3: Markdown conversion
- Phase 4: RSS feed integration, newsletter integration
- Phase 5: Design & styling
- Phase 6: Deployment

**Documentation:**
- Content extraction guide available
- Migration checklist tracking progress

### 2.2 Ghost Migration Status

**Status:** Guides Ready, Not Started

**Current Setup:**
- Managed Ghost hosting: $144/month
- Auto-pulls latest posts to website

**Migration Plan:**
- Target: Railway.app or Render.com
- Estimated cost: $5-20/month
- Savings: ~$120-130/month
- Setup time: 2-3 hours
- Complete migration guide available

**Next Steps:**
1. Create Railway account
2. Deploy Ghost template
3. Export content from managed Ghost
4. Import to Railway instance
5. Configure domain and DNS

### 2.3 Airtable Migration Status

**Status:** Guides & Scripts Ready, Not Started

**Current Setup:**
- Paid Airtable: ~$50/month
- Used for: Contribution Points tracking, member databases, project tracking

**Migration Plan:**
- Target: NocoDB (self-hosted)
- Estimated cost: $5-10/month
- Savings: ~$30-40/month
- Two-phase approach:
  1. Complete migration to NocoDB (eliminate Airtable costs)
  2. Evaluate and selectively move appropriate data to Notion

**Tools Available:**
- Export script: `scripts/airtable-export.js`
- Audit template available
- Complete migration guide available

**Next Steps:**
1. Complete Airtable audit
2. Run export script
3. Deploy NocoDB
4. Migrate all data
5. Update integrations

### 2.4 Notion Migration Status

**Status:** Complete

**Completed:**
- Resources Hub migrated from Regen Coordination workspace to ReFi DAO workspace
- Local node project workspaces migrated
- Permissions and access configured
- Links updated across systems
- Documentation updated

### 2.5 Cost Analysis

**Current Monthly Costs:**
- Ghost: $144/month
- Airtable: ~$50/month
- Softr: ~$50/month (reduced - local nodes DB only)
- **Total: ~$244/month**

**Target Monthly Costs:**
- Railway/Render (Ghost): $5-20/month
- NocoDB: $5-10/month
- Notion: $0 (free tier)
- GitHub Pages: $0 (free)
- Softr: ~$20/month (local nodes DB only)
- **Total: $10-30/month**

**Potential Savings:**
- **Monthly: ~$214-234/month**
- **Annual: ~$2,600-2,800/year**

### 2.6 Integration Status

**RSS Feed Integration:**
- Script available: `scripts/fetch-rss.js`
- GitHub Actions workflow created
- Ready for Ghost migration completion

**Newsletter Integration:**
- Integration guides available
- Options: Tally.so (recommended), Mailchimp, ConvertKit

**Database APIs:**
- Prosperity Pass integration active
- Contribution Points tracking operational
- Ready for Airtable migration

**Cross-System Links:**
- Documentation links updated
- Resources Hub integrated
- Forum integration active

---

## 3. Network Initiatives Status

### 3.1 Research & Media Initiative

**Status:** Scoped, Launching November 2025

**Leads:** Theresa, Maya, Trinity

**Mandate:**
- Merge CommSpot and ReFi Podcast into unified research/media workstream
- Create industry/state-of-research reports
- Produce token/project deep dives
- Article series for regenerative.fi
- Podcast/long-form interviews

**Goals:**
- Raise ReFi literacy
- Provide investor-grade research
- Amplify network stories
- Support platform launches (Regenerative.fi, Prosperity Pass)

**Status:**
- Active scoping phase
- Awaiting funding approval from Network Initiatives pool
- Editorial calendar to be established
- First deliverables planned for November 2025

**Dependencies:**
- Partner content briefs
- Editorial calendar
- Research standards
- Distribution playbook

### 3.2 Local Node Support Initiative

**Status:** Scoped, Launching December 2025

**Lead:** TBD (recruiting - potential candidates: Eve, Antonio)

**Mandate:**
- Onboarding & incubation for new nodes
- Periodic check-ins
- Regional knowledge sharing
- Playbooks and updated toolkit
- Light-touch coaching on events, fundraising, partnerships

**Proposed Deliverables:**
- Refreshed node toolkit
- Onboarding checklist
- Monthly office hours
- Regional convenings
- Metrics dashboard on node activity

**Goals:**
- Improve node survival/activation rates
- Reduce duplicated effort
- Surface needs to Global
- Create pathways from DD24/localism.fund into nodes

**Status:**
- Scoping phase complete
- Recruiting lead coordinator
- Awaiting funding approval
- Launch target: December 2025

**Dependencies:**
- Access to ReFi docs, branding kits, social templates
- Karma/Gov tooling
- Coordination with DD24/localism.fund and Prosperity Pass

### 3.3 Knowledge Sharing Program

**Status:** Concept Stage

**Format:**
- Short peer clinics
- Recorded case studies
- 1:1 introductions
- Written playbooks

**Focus Areas:**
- Event formats that work
- Sponsorship outreach
- Microlending pilots
- Impact measurement
- Compliance basics

**Outputs:**
- Library of 10+ case studies
- Quarterly cross-node forum
- FAQ and decision trees for common challenges

**Status:**
- Concept stage
- Strong interest from contributors
- Tereza proposed monthly workshops
- Launch target: November 2025

### 3.4 ReFi Podcast (Completed)

**Status:** Concluded H1 2025

**Achievements:**
- Final episode: April 14, 2025
- Nearly 100,000 total downloads
- Led by Tereza Bizkova and Maya Dentzel
- Featured conversations with regenerative finance leaders
- Produced excerpt content (life mantras overview June 24)
- Participated in GG23 Regen Coordination round

**Legacy:**
- Content and learnings informing Research & Media Initiative
- Network stories documented
- Educational content for community

---

## 4. Financial Position & Sustainability

### 4.1 Current Financial Position

**Treasury Balance (as of Oct 1, 2025):**
- €25.58k across cross-chain accounts
- Mix of fiat and crypto (exposed to FX/crypto volatility)
- Cross-chain Safe wallets deployed

**Gardens Funding Pools:**
- €4.7k committed total
  - €1.9k Local Node Kickstarter Pool
  - €2.8k Network Initiatives Pool

**Runway:**
- 3-5 months at current light-spend pace
- Compresses if initiatives funded without new income sources

### 4.2 H1 2025 Actuals

**Income:** ~€36k
- Includes Optimism RPGF: 4 ETH + price appreciation
- Favorable ETH price impact

**Expenses:** ~€26k
- Core operations
- Network support
- Minimal contractor support

**Net:** +€10k
- Positive due to RPGF and favorable ETH price

### 4.3 H2 2025 Outlook

**Grant Pipeline:**
- Weak for remainder of year
- Risk of negative cash flow if operations continue without offsetting revenue

**Risk Factors:**
- Negative cash flow if initiatives funded without new income
- Runway compression if spending increases
- FX/crypto volatility exposure
- Single partner dependency risk

**Sensitivities:**
- ±20% crypto price swing changes runway by ~0.5-1.0 months
- 1-2 funded initiatives without revenue shortens runway by ~1-2 months

### 4.4 Revenue Opportunities Identified

**Service Fees:**
- DD24/localism.fund round management
- Program management fees for local funding rounds
- Scalable model with clear SLAs

**Partnership SOWs:**
- Regenerative.fi partnership (content, onboarding, deliverables)
- Prosperity Pass deliverables
- Platform integration support

**Sponsorships:**
- Research & Media Initiative outputs
- Recurring revenue potential
- Content sponsorships

**Targeted Fundraising:**
- Bundle ReFi Global value props
- Pitch to localism/climate funders
- Leverage proven network infrastructure

### 4.5 Expense Profile

**Core Operations:**
- Global coordination (luizfernando)
- Forum/tooling/subscriptions
- Communications
- Minimal contractor support

**Network Support:**
- Local node pool top-ups
- Bounties
- Convenings
- Toolkit refresh
- Onboarding support

**Initiatives:**
- Currently unfunded or early-stage
- Research & Media Initiative
- Local Node Support Initiative
- Knowledge Sharing Program

### 4.6 Cost Reduction Initiatives

**Infrastructure Migrations:**
- Ghost: $144/month → $5-20/month (savings: ~$120-130/month)
- Airtable: ~$50/month → $5-10/month (savings: ~$30-40/month)
- **Total potential savings: ~$214-234/month**

**Mitigation Strategies:**
- Revenue activation: publish fee schedule, pre-sign SOWs
- Targeted fundraising: bundle value props
- Cost discipline: milestone-tied tranches, quarterly reviews
- Proof of value: deliver Local Node Showcase, document success stories

---

## Sources

- ReFi DAO 2.0 Progress Report - H2 2025 Update
- H2 2025 Biannual Retrospective & Strategic Plan
- MIGRATION-STATUS.md
- docs/ReFi-DAO-Infrastructure-Migration/README.md
- Meeting notes (Oct 1, Oct 9, Oct 30, Nov 4, Nov 5)

---

**Next Steps:** See [Closure Checklist](closure-checklist.md) for tasks needed to complete ReFi DAO 2.0, and [Vision & Strategic Models](vision-strategic-models.md) for ReFi DAO 3.0 planning.


