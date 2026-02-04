# ReFi DAO Website Content Development Guide

## Purpose
This document tracks content development for all pages on the ReFi DAO website. Content here should be refined and then reflected in the actual HTML pages.

## Navigation Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  About▼  Local Nodes  Community▼  Media▼  Resources  │
└─────────────────────────────────────────────────────────────────┘
           │                      │          │
           ├─ Mission & Vision    │          ├─ ReFi Blog ↗
           ├─ Network Structure   │          └─ ReFi Podcast ↗
           └─ Team                │
                                  ├─ Network Initiatives
                                  ├─ Regen Coordination
                                  └─ ReFi Mediterranean
```

**Note:** After implementation, About and Community are direct links (no dropdowns).

## Page Content Specifications

### Homepage (index.html)
- Hero section with animated ring
- Map preview section
- Stats grid (85+ Nodes, 45+ Countries, 5000+ Members, 20+ Initiatives)
- What We Do section (6 feature cards)
- Explore Resources section (3 resource cards)
- CTA section with 3 action buttons

### About (about.html)
- Mission section
- Timeline section (2024-2026 milestones)
- Network Structure section (3 cards: Global, Local Nodes, Initiatives)
- Values section (4 icons: Regeneration, Collaboration, Transparency, Inclusivity)
- Team section (Core Contributors)
- CTA section

### Community (community.html)
- Network Initiatives section (3 initiative cards)
- Regen Coordination section (description + external link)
- ReFi Mediterranean section (description + external link)
- Local Nodes preview (stats + map link)
- CTA section

**Note:** Guilds & Working Groups section has been removed.

### Local Nodes (local-nodes.html)
- Hero with embedded interactive map
- Node list section with filters and sorting
- Join CTA section

### Resources Hub (resources-hub.html)
- Onboarding guides section (3 cards: Local Node, Network Initiative, Network Member)
- Core Documents section (list of document links)
- Toolkits section (3 cards: Local Node Toolkit, Governance Framework, Funding Resources)
- Full Documentation CTA

### Join the Network (join-the-network.html)
- Hero section
- Introduction section
- Ways to Join section (3 cards: Start a Local Node, Launch an Initiative, Become a Member)
- Getting Started section (3 steps)
- What to Expect section
- CTA section

## Content Guidelines

### Voice and Tone
- **Authoritative but approachable**: Speak with confidence about ReFi while remaining welcoming
- **People-first**: Focus on community, collaboration, and collective action
- **Plain language**: Avoid jargon when possible; explain technical terms when needed
- **Action-oriented**: Emphasize what people can do and how they can contribute

### Key Messaging
- ReFi DAO is a network society focused on regenerative finance
- We connect regenerative movements globally
- We empower communities to co-create regenerative futures
- We balance decentralized autonomy with coordinated alignment
- We're building infrastructure for systemic change

### Call-to-Action Patterns
- Primary CTAs: "Join the Network", "Start a Local Node", "Launch an Initiative"
- Secondary CTAs: "Learn More", "Explore", "Read Guide"
- External CTAs: Include ↗ symbol for external links
- Multiple CTAs: Offer different entry points for different audiences

### Link to Source Materials
- Notion guides serve as source of truth for onboarding content
- Blog posts provide updates and announcements
- Forum for community discussions
- Discord/Telegram for real-time communication

## External Resources

### Notion Guides
- **Local Node Onboarding**: https://refi-dao.notion.site/local-node-onboarding
- **Network Initiative Guide**: https://refi-dao.notion.site/Starting-a-ReFi-Network-Initiative-Onboarding-Guide-2aebf304370a81bb8fb7d80ca2257044
- **Global Onboarding Guide**: https://refi-dao.notion.site/ReFi-DAO-Global-Onboarding-Guide-2aebf304370a81878a83c4449dcc9519
- **Network Resources**: https://refi-dao.notion.site/refi-dao-network-resources
- **Network Structure**: https://refi-dao.notion.site/ReFi-DAO-Network-Structure-Roles-Governance-2aebf304370a81f9a306f3dd1657f1ce

### External Links
- **Blog**: https://blog.refidao.com
- **Podcast**: https://podcast.refidao.com
- **Forum**: https://forum.refidao.com
- **Documentation**: https://docs.refidao.com
- **Discord**: https://discord.gg/refidao
- **Telegram**: https://t.me/refidao
- **Twitter**: https://twitter.com/ReFiDAOist
- **GitHub**: https://github.com/ReFiDAO
- **Events**: https://lu.ma/refidao

## Content Updates Workflow

1. **Draft content** in this document or Notion
2. **Review and refine** messaging, tone, and structure
3. **Implement in HTML** pages maintaining design consistency
4. **Test links** and ensure all CTAs work correctly
5. **Update this document** to reflect changes

## Notes

- All pages should maintain consistent design with existing pages
- Navigation paths are simple relative paths (e.g., `../` for assets/styles)
- Community sub-sections use anchor links (#network-initiatives, #regen-coordination, #refi-mediterranean)
- Redirect pages (local-node.html, network-initiative.html, network-structure.html) redirect to Notion guides
- Native page (join-the-network.html) adapts content from Notion guides while maintaining website design
