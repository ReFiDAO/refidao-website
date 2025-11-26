# Hypercert Minting Guide | ReFi Local Nodes

### Table of Contents

# **Introduction**

This guide is intended to **provide you with a comprehensive overview of hypercerts, their significance for ReFi DAO, and step-by-step instructions for minting them.** We aim to make this process as straightforward and informative as possible, enabling you to effectively showcase your node's impact.

For ReFi Local Nodes, effective use of hypercerts can build:

- A transparent and permanent on-chain record of all of the work and associated impacts the Local Node has been involved in.
- Trust, credibility and reputation when seeking to raise funding from Web3 grant providers (Gitcoin, Celo & Optimism RPGF etc…)
- Potential eligibility for a ReFi DAO RPGF funding round 👀

Follow this guide to learn more and implement 👇

# Background

## **What are Hypercerts?**

Hypercerts are a novel token standard designed to transparently track and reward positive impact. Each hypercert represents a unique impact claim, encapsulating the scope of work, the timeframe, the contributors, and the rights conferred by ownership. Implemented as ERC-1155 semi-fungible tokens, hypercerts are stored on IPFS, ensuring durability and accessibility of the impact information.

## **Why Hypercerts Matter**

Hypercerts have the potential to address a critical gap in the funding and recognition of public goods by enabling a scalable, distributed, and transparent impact-tracking system. This system can not only track but also evaluate and reward impactful work, providing a powerful incentive for creators and funders alike. The versatility of hypercerts supports diverse funding mechanisms and facilitates experimentation and interoperability, enhancing the efficiency of impact capital allocation.

## ReFi DAO Vision

We envision hypercerts as a key primitive for tracking activities across the global network of ReFi Local Nodes and helping to channel resources towards those with the highest verifiable impact. For each local node, the minting of hypercerts will create a transparent record of impacts that will serve to bolster reputation and fundraising potential. In practice, this means:

- All active ReFi Local Nodes should mint hypercerts for all the impact actions they have done since funds were raised.
- ReFi DAO Sponsors can receive a share of the hypercerts and thus have an on-chain claim to the impact they helped support with their sponsorship.
- Retroactive funding for the most impressive and credible impact claims.

# **Minting Guidelines - Preparing Your Hypercerts**

<aside>
❗ Please read and follow the below guidelines carefully!

</aside>

When minting a hypercert for your project using the [hypercert minting dApp](https://hypercerts.org/app/create/), you must provide information across several fields. See below for the specific fields you must complete and how ReFi DAO recommends you fill in the information.

**Instructions**: choose below for the type of work completed that you would like to report, read the guidance thoroughly, and start minting! NOTE: Ideally you mint the hypercert in a wallet that has been set up specifically for your local node (you can create one in Metamask in a couple of clicks), otherwise a local node founder’s wallet is also ok. 

## 1. Node Incubation

**Overview**: Mint a hypercert to document the founding date / period of the local node. This date could be the node’s participation in a ReFi DAO incubator program, its first Gitcoin grant, or any other meaningful date signifying the beginning of the node.

- **Example Hypercert by ReFi London → [view here](https://hypercerts.org/app/view#claimId=0x16ba53b74c234c870c61efc04cd418b8f2865959-5444517870735015415413993718908291383296)**
    
    ![Screenshot 2024-04-04 at 5.13.40 pm.png](Hypercert%20Minting%20Guide%20ReFi%20Local%20Nodes/Screenshot_2024-04-04_at_5.13.40_pm.png)
    

### a. General Fields

- **Hypercert Name**: Combine your node name with the event name as follows: *<node name>* | Incubation 🌱 **(e.g. "ReFi London | Incubation 🌱").
- **Logo Image**: Copy-paste the URI of an image for the top left part of the card. This could be your node logo. You should see a preview of the icon in the artwork. Square-shaped PNG/JPG format is best. TIP: You can copy the image URL from your Twitter profile picture or other social media account (right-click on the image and select ‘copy image address’) or upload new images to a service such as [Postimages.org](http://postimages.org/).
- **Background Banner Image**: Copy-paste a URI for a background banner image that will extend across the upper half of the artwork. This could be your project masthead or a unique piece of art. You will see a preview of the icon in the artwork. Note: it should have an aspect ratio of 1.5 (width to height) and be at least 320 pixels wide and 214 pixels high.
- **Description**: A human-readable description of your node and its formative moment / incubation. Utilize Markdown for formatting and include links for additional information. Stick to about 500 characters.
- **Link**: e.g. your Local Node Twitter account, website or Linktree.

### b. Hypercert Fields

- **Work Scope**: Copy and paste these tags: ReFi DAO Local Node, Incubation
- **Work Start/End Dates**: Specify the timeframe represented by the hypercert. This date could be the node’s participation in a ReFi DAO incubator program, its first Gitcoin grant, or any other meaningful date signifying the beginning of the node.
- **List of Contributors**: Include all key founding contributors, one per line or comma-separated. The list should include all key contributors involved in the work. Contributors are ideally wallet addresses or ENS names, but can also be names / pseudonyms. Groups of contributors can be represented by a multisig or name of an organization. Note - *All contributors' addresses, names or pseudonyms will be public.*

### **c. Allow List & Distribution**

The **allow list** allows you to distribute ownership of your Hypercert between multiple addresses. This allows other parties to be able to claim fractions of the hypercert (e.g. project funders or partners).

<aside>
❗ Make sure refidao.eth - 0x7340F1a1e4e38F43d2FCC85cdb2b764de36B40c0 - is listed in the allow list. See below for guidance.

</aside>

### **Simple allow List Guidance - Adding ReFi DAO Global** (refidao.eth)

Following these two steps will create an equal share distribution of the hypercert between ReFi DAO Global (refidao.eth) and the wallet you are minting from.

1. Paste the following link into ‘Allow List’ field: [https://bafybeiaxqfx5hd2ehpftixxcrtjgkmxyu54ielb6ch62fqwfayamf34uyy.ipfs.w3s.link/ipfs/bafybeiaxqfx5hd2ehpftixxcrtjgkmxyu54ielb6ch62fqwfayamf34uyy/refi-dao-local-nodes-hypercert-allowlist1.csv](https://bafybeiaxqfx5hd2ehpftixxcrtjgkmxyu54ielb6ch62fqwfayamf34uyy.ipfs.w3s.link/ipfs/bafybeiaxqfx5hd2ehpftixxcrtjgkmxyu54ielb6ch62fqwfayamf34uyy/refi-dao-local-nodes-hypercert-allowlist1.csv)
2. Select a ‘Percentage distributed via allowlist’ of 50%.

NOTE: At this stage, this split is more notional rather than defining an equity-like share. The main point is that at least some proportion of the hypercerts does go to ReFi DAO Global to create an on-chain link to the work!

## 2. Events

**Overview**: Mint hypercerts to document every event that your local node has organised, sponsored or supported in any meaningful way.

- **Single Event** - Mint one hypercert per event.
- **Event Series** - Mint one hypercert for a series of events over a defined period. e.g. all Twitter spaces the node has hosted or all of the weekly community meetups etc…
- **Example Hypercert by ReFi London → [view here](https://hypercerts.org/app/view#claimId=0x16ba53b74c234c870c61efc04cd418b8f2865959-4763953136893138488487244504044754960384)**
    
    ![Screenshot 2024-04-04 at 5.13.10 pm.png](Hypercert%20Minting%20Guide%20ReFi%20Local%20Nodes/Screenshot_2024-04-04_at_5.13.10_pm.png)
    

### a. General Fields

- **Hypercert Name**: Combine your node name with the event name as follows: *<node name>* | *<event name>* (e.g. "ReFi London | Regens Unite London 2024").
- **Logo Image**: Copy-paste the URI of an image for the top left part of the card. This could be your node logo. You should see a preview of the icon in the artwork. Square-shaped PNG/JPG format is best. TIP: You can copy the image URL from your Twitter profile picture or other social media account (right-click on the image and select ‘copy image address’) or upload new images to a service such as [Postimages.org](http://postimages.org/).
- **Background Banner Image**: Copy-paste a URI for a background banner image that will extend across the upper half of the artwork. This could be an event promo banner or live photo from the event in action. You will see a preview of the icon in the artwork. Note: it should have an aspect ratio of 1.5 (width to height) and be at least 320 pixels wide and 214 pixels high.
- **Description**: A human-readable description of your event, how your ReFi Node organised, sponsored or supported the event in any meaningful way, and a high-level overview of the impact metrics (number of attendees, key workshops or highlights etc..). Utilize Markdown for formatting and include links for additional information. Stick to about 500 characters.
    - ❗️for **Event Series** please make sure to include links to all of the event pages.
- **Link**: Add your event page URL, starting with "https://".
    - ❗️for **Event Series** this could be your Eventbrite or [lu.ma](http://lu.ma) profile page.

### b. Hypercert Fields

- **Work Scope**: Select all relevant tags listed in *Event Type* table below. 
NOTE: This is one of the most important fields to fill out correctly. Please choose your work scope carefully!
    - **🎪 Event Type**
        
        
        | **Work Scope Tag** | **Description** |
        | --- | --- |
        | **IRL Event** | ‘In-Real-Life Event’ - meeting physically in a specific location to engage in activities or discussions. |
        | Meetup | A casual gathering for people with common interests to discuss, share, and learn from each other in a relaxed setting. |
        | Hackathon | An intensive event where programmers, designers, and others collaborate on software projects over a short period, often with a competitive element. |
        | Conference | A formal gathering that features expert speakers, presentations, and sessions on specific topics, aimed at professionals and enthusiasts. |
        | Unconference | A participant-driven meeting without a predetermined agenda, where attendees decide on the topics and structure of the event. |
        | **Online Event** | A digital gathering that participants join via the internet, allowing for interaction without physical presence. |
        | Webinar | A seminar conducted over the internet where a speaker, or group of speakers, delivers a presentation to an online audience. |
        | Twitter Space | A live audio conversation on Twitter, where hosts and participants can discuss topics in real time. |
        | Workshop | An interactive session focused on teaching or exploring a specific subject, skill, or project, often with active participation from attendees. |
        | *Other Type?* | *If not listed above, come up with your own tags to add such as a Festival, Virtual Reality (VR) Event, or any unique type of gathering. This allows you to define a custom event type that best describes your gathering's nature and audience.* |
- **Work Start/End Dates**: Specify the timeframe of the work represented by the hypercert.
    - ❗️for **Single Event** just select the date of the event.
    - ❗️for **Event Series** include the date range for when the events took place.
- **List of Contributors**:  Include all key contributors of the local node that were involved in the work, one per line or comma-separated. Contributors are ideally wallet addresses or ENS names, but can also be names / pseudonyms. Groups of contributors can be represented by a multisig or name of an organization. Note - *All contributors' addresses, names or pseudonyms will be public.*

### **c. Allow List & Distribution**

The **allow list** allows you to distribute ownership of your Hypercert between multiple addresses. This allows other parties to be able to claim fractions of the hypercert (e.g. project funders or partners).

<aside>
❗ Make sure refidao.eth - 0x7340F1a1e4e38F43d2FCC85cdb2b764de36B40c0 - is listed in the allow list. See below for guidance.

</aside>

### **Simple allow List Guidance - Adding ReFi DAO Global** (refidao.eth)

Following these two steps will create a share distribution of the hypercert between ReFi DAO Global (refidao.eth) and the wallet you are minting from.

1. Paste the following link into ‘Allow List’ field: [https://bafybeiaxqfx5hd2ehpftixxcrtjgkmxyu54ielb6ch62fqwfayamf34uyy.ipfs.w3s.link/ipfs/bafybeiaxqfx5hd2ehpftixxcrtjgkmxyu54ielb6ch62fqwfayamf34uyy/refi-dao-local-nodes-hypercert-allowlist1.csv](https://bafybeiaxqfx5hd2ehpftixxcrtjgkmxyu54ielb6ch62fqwfayamf34uyy.ipfs.w3s.link/ipfs/bafybeiaxqfx5hd2ehpftixxcrtjgkmxyu54ielb6ch62fqwfayamf34uyy/refi-dao-local-nodes-hypercert-allowlist1.csv)
2. Select a ‘Percentage distributed via allowlist’, we recommend between 25-50%.

NOTE: At this stage, this split is more notional rather than defining an equity-like share. The main point is that at least some proportion of the hypercert does go to ReFi DAO Global to create an on-chain link to the work! In the future, this could also allow a share of the hypercerts to be distributed to match funding sponsors so they also have a share of the impact through the funding they have provided.

### **Custom Allow List Guidance**

If you want to define a more complex share of the hypercert between multiple parties, take a look at this beta tool to create custom allowlists: [https://allowlist-creator.vercel.app/](https://allowlist-creator.vercel.app/)

NOTE: please still make sure to add ReFi DAO Global’s Address - 0x7340F1a1e4e38F43d2FCC85cdb2b764de36B40c0 (refidao.eth)

## 3. Ecological Action

**Overview**: Mint hypercerts to document ecological actions that your local node has directly organised, sponsored or supported in any meaningful way.

### a. General Fields

- **Hypercert Name**: Combine your node name with the action name as follows: *<node name>* | *<ecological action name>* (e.g. "ReFi London | Operation WebTree 2024").
- **Logo Image**: Copy-paste the URI of an image for the top left part of the card. This could be your node logo. You should see a preview of the icon in the artwork. Square-shaped PNG/JPG format is best. TIP: You can copy the image URL from your Twitter profile picture or other social media account (right-click on the image and select ‘copy image address’) or upload new images to a service such as [Postimages.org](http://postimages.org/).
- **Background Banner Image**: Copy-paste a URI for a background banner image that will extend across the upper half of the artwork. This could be a promo banner or a IRL photo of the event in action. You will see a preview of the icon in the artwork. Note: it should have an aspect ratio of 1.5 (width to height) and be at least 320 pixels wide and 214 pixels high.
- **Description**: A human-readable description of the Ecological Action, how your ReFi Node organised, sponsored or supported the action in any meaningful way, and a high-level overview of the impact metrics (number of trees planted etc..). Utilize Markdown for formatting and include links for additional information. Stick to about 500 characters.
- **Link**: Add a URL with more info on the initiative or that provides evidence of the work.

### b. Hypercert Fields

- **Work Scope**: First input ‘Ecological Action’ as the first tag. Then select any relevant tags for the claimed impact of the action from the EBF or SGDs listed 👇
    - **Ecological Benefits Framework (EBF) Tags**
        
        Select any EBF tags that apply to your project.  Learn more: [https://ebfcommons.org/](https://ebfcommons.org/)
        
        | **Work Scope Tag** | **Description** |
        | --- | --- |
        | EBF1 | Projects that created a meaningful impact in the ecological benefit: **Air**  |
        | EBF2 | Projects that created a meaningful impact in the ecological benefit: **Water** |
        | EBF3 | Projects that created a meaningful impact in the ecological benefit: **Soil** |
        | EBF4 | Projects that created a meaningful impact in the ecological benefit: **Biodiversity** |
        | EBF5 | Projects that created a meaningful impact in the ecological benefit: **Equity** |
        | EBF6 | Projects that created a meaningful impact in the ecological benefit: **Carbon** |
    - **Sustainable Development Goals (SDGs) Tags**
        
        Select the most relevant SDG tags that apply to your project. Learn more: [https://sdgs.un.org/goals](https://sdgs.un.org/goals)
        
        | **Work Scope Tag** | **Description** |
        | --- | --- |
        | SDG1 | Projects that created a measurable  impact according to SDG1: No poverty |
        | SDG2 | Projects that created a measurable  impact according to SDG2: Zero Hunger |
        | etc… | The remaining 15 SDGs based on the above logic. |
- **Work Start/End Dates**: Specify the timeframe of the work represented by the hypercert.
- **List of Contributors**: Include all key contributors of the local node that were involved in the work, one per line or comma-separated. Contributors are ideally wallet addresses or ENS names, but can also be names / pseudonyms. Groups of contributors can be represented by a multisig or name of an organization. Note - *All contributors' addresses, names or pseudonyms will be public.*

### **c. Allow List & Distribution**

The **allow list** allows you to distribute ownership of your Hypercert between multiple addresses. This allows other parties to be able to claim fractions of the hypercert (e.g. project funders or partners).

<aside>
❗ Make sure refidao.eth - 0x7340F1a1e4e38F43d2FCC85cdb2b764de36B40c0 - is listed in the allow list. See below for guidance.

</aside>

### **Simple allow List Guidance - Adding ReFi DAO Global** (refidao.eth)

Following these two steps will create a share distribution of the hypercert between ReFi DAO Global (refidao.eth) and the wallet you are minting from.

1. Paste the following link into ‘Allow List’ field: [https://bafybeiaxqfx5hd2ehpftixxcrtjgkmxyu54ielb6ch62fqwfayamf34uyy.ipfs.w3s.link/ipfs/bafybeiaxqfx5hd2ehpftixxcrtjgkmxyu54ielb6ch62fqwfayamf34uyy/refi-dao-local-nodes-hypercert-allowlist1.csv](https://bafybeiaxqfx5hd2ehpftixxcrtjgkmxyu54ielb6ch62fqwfayamf34uyy.ipfs.w3s.link/ipfs/bafybeiaxqfx5hd2ehpftixxcrtjgkmxyu54ielb6ch62fqwfayamf34uyy/refi-dao-local-nodes-hypercert-allowlist1.csv)
2. Select a ‘Percentage distributed via allowlist’, we recommend between 25-50%.

NOTE: At this stage, this split is more notional rather than defining an equity-like share. The main point is that at least some proportion of the hypercert does go to ReFi DAO Global to create an on-chain link to the work! In the future, this could also allow a share of the hypercerts to be distributed to match funding sponsors so they also have a share of the impact through the funding they have provided.

### **Custom Allow List Guidance**

If you want to define a more complex share of the hypercert between multiple parties, take a look at this beta tool to create custom allowlists: [https://allowlist-creator.vercel.app/](https://allowlist-creator.vercel.app/)

NOTE: please still make sure to add ReFi DAO Global’s Address - 0x7340F1a1e4e38F43d2FCC85cdb2b764de36B40c0 (refidao.eth)

## Other?

To be defined - please feel free to leave a suggestion here as a comment!

## **Minting Process**

1. **Prepare Your Information**: Gather all necessary information and relevant resources as the guidelines specify.
2. **Access the Minting Platform**: Navigate to the hypercert minting platform —> [https://hypercerts.org/app/create/](https://hypercerts.org/app/create/#name=%3Cproject%20name%3E%20%7C%20%3CCelo%20PG%20category%3E%20&impactScopes%5B0%5D=all&impactTimeEnd=2024-03-28&workTimeStart=2024-03-28&workTimeEnd=2024-03-28&rights%5B0%5D=Public%20Display&allowlistPercentage=50)
3. **Connect Wallet & Select Celo Network**: Connect your Web3 wallet to the hypercert dApp and select the Celo Network. 
    1. Ideally you have a wallet specifically for your local node (if not you can set one up in metamask in a couple clicks), otherwise a local node founder’s personal wallet is also ok.
4. **Enter General and Hypercert Fields**: Input your project's details carefully, following the structure detailed in the guides above.
5. **Set Distribution Parameters**: Determine how you wish to distribute your hypercert, including the allocation to the allowlist.
6. **Review and Submit**: Ensure all entered information is accurate and complete. Submit your hypercert for minting.

Have questions? Reach out to [@MontyMerlin](https://linktr.ee/montybryant) if you experience any issues or need guidance for minting your Hypercert.

### ❗️Bonus TIP

- Once you have filled out a hypercert form, you can copy a link at the end to save all the info. Then if you paste the link, it will be pre-filled out with the info - great for creating a backup and saving time if minting multiple in a row!
    
    ![Untitled](Hypercert%20Minting%20Guide%20ReFi%20Local%20Nodes/Untitled.jpeg)
    

# **Conclusion**

Minting a hypercert for your Celo Public Goods Program application is a vital step in demonstrating your project's impact and aligning with Celo's mission. By following this guide, you can effectively communicate the value of your work and participate in a transformative funding ecosystem. Should you have any further questions or require assistance, please refer to the detailed [Hypercert Docs](https://network-goods.github.io/hypercerts-docs/) or contact the Celo PG team.