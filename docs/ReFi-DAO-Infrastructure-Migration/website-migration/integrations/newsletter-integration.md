# Newsletter Integration Guide

## Overview

This guide covers integrating a newsletter service into the Quartz website for email subscriptions.

## Recommended Services

### Option 1: Tally.so (Recommended)

**Pros:**
- Free tier available
- Simple integration
- Good form builder
- Web3-friendly

**Cons:**
- Limited customization on free tier

### Option 2: Mailchimp

**Pros:**
- Free tier (up to 500 contacts)
- Robust features
- Good analytics

**Cons:**
- More complex setup
- Less Web3-native

### Option 3: ConvertKit

**Pros:**
- Good for creators
- Free tier available
- Clean interface

**Cons:**
- More expensive at scale

## Implementation: Tally.so

### Step 1: Create Tally Form

1. Go to https://tally.so
2. Create account
3. Create new form: "ReFi DAO Newsletter Signup"
4. Add fields:
   - Email (required)
   - Name (optional)
   - Interests (optional - multi-select)
5. Configure settings:
   - Enable email notifications
   - Set up webhook (optional)
6. Publish form and get embed code

### Step 2: Add to Website

**Option A: Embed Form**

Add to `content/about/index.md` and `content/media/index.md`:

```html
<div class="newsletter-signup">
  <h3>Stay Updated</h3>
  <p>Subscribe to receive weekly roundups and ReFi DAO updates.</p>
  <iframe 
    src="https://tally.so/embed/your-form-id?transparentBackground=1&hideTitle=1" 
    width="100%" 
    height="500" 
    frameborder="0" 
    marginheight="0" 
    marginwidth="0">
  </iframe>
</div>
```

**Option B: Link to Form**

Add button/link that opens form in new tab:

```markdown
## Stay Updated

Subscribe to our newsletter to receive weekly roundups and ReFi DAO updates.

[Subscribe to Newsletter](https://tally.so/r/your-form-id){ .cta-button }
```

### Step 3: Style Integration

Add CSS for newsletter section in `quartz/styles/custom.scss`:

```scss
.newsletter-signup {
  margin: 2rem 0;
  padding: 2rem;
  background: var(--light);
  border-radius: 8px;
  
  iframe {
    border: none;
    border-radius: 4px;
  }
}
```

## Implementation: Mailchimp

### Step 1: Create Mailchimp Account

1. Go to https://mailchimp.com
2. Create account (free tier)
3. Create audience/list
4. Create signup form
5. Get form HTML code

### Step 2: Add to Website

**Option A: Embedded Form**

Add Mailchimp form HTML to pages.

**Option B: API Integration**

Use Mailchimp API for custom form:

```javascript
// Client-side form submission
async function subscribe(email) {
  const response = await fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
}
```

**Note:** Requires backend API endpoint (can use GitHub Actions or serverless function).

## Recommended Approach

**Use Tally.so with embedded form:**

1. Simple to set up
2. No backend required
3. Free tier sufficient
4. Easy to maintain

## Placement

Add newsletter signup to:

1. **About Page** - After "Capital Flows & Coordination" section
2. **Media Page** - In "Stay Updated" section
3. **Homepage** - In footer or dedicated section

## Testing

- [ ] Form displays correctly
- [ ] Form submission works
- [ ] Email notifications received
- [ ] Subscriber added to list
- [ ] Mobile responsive
- [ ] Accessible (keyboard navigation, screen readers)

## Privacy & Compliance

- Add privacy notice
- Link to privacy policy
- Comply with GDPR/CCPA if applicable
- Allow unsubscribe option

## Analytics

Track newsletter signups:
- Form submissions
- Conversion rate
- Source tracking (which page)

## Next Steps

1. Choose service (recommend Tally.so)
2. Create form
3. Add to website pages
4. Test thoroughly
5. Monitor signups

---

**Last Updated:** January 2025  
**Status:** Ready for implementation

