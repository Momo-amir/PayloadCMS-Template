# Google Tag Manager Setup Guide

Complete step-by-step guide to set up Google Tag Manager for this project.

## Table of Contents
1. [Initial Setup](#1-initial-setup)
2. [Configure GTM Variables](#2-configure-gtm-variables)
3. [Create Triggers](#3-create-triggers)
4. [Create Tags](#4-create-tags)
5. [Testing](#5-testing)
6. [Events Reference](#6-events-reference)

---

## 1. Initial Setup

### Create GTM Account & Container

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click **Create Account**
3. Fill in:
   - **Account Name**: Your company/project name
   - **Country**: Your location
   - **Container Name**: Your website domain
   - **Target Platform**: Web
4. Click **Create** and accept Terms of Service
5. Copy your **Container ID** (format: `GTM-XXXXXXX`)

### Add GTM to Your Project

1. Create a `.env` file in your project root (or edit existing)
2. Add your GTM container ID:

```bash
NEXT_PUBLIC_GTM_MEASUREMENT_ID=GTM-XXXXXXX
```

3. Restart your development server
4. The GTM script will automatically load when users accept cookies

---

## 2. Configure GTM Variables

### Enable Built-in Variables

1. In GTM, go to **Variables** → **Configure**
2. Enable these built-in variables:
   - ✅ Click Element
   - ✅ Click Text
   - ✅ Click URL
   - ✅ Page Path
   - ✅ Page URL
   - ✅ Referrer
   - ✅ Event (under "Errors")

### Create Data Layer Variables

For each parameter below, create a **Data Layer Variable**:

**How to create:**
1. Go to **Variables** → **User-Defined Variables** → **New**
2. Click **Choose a variable type** → **Data Layer Variable**
3. Enter the **Data Layer Variable Name** from the table below
4. Click **Save**

| Variable Name | Data Layer Variable Name | Used By |
|---------------|-------------------------|---------|
| `button_name` | `button_name` | button_click |
| `section` | `section` | button_click |
| `destination_url` | `destination_url` | button_click, card_click |
| `card_title` | `card_title` | card_click |
| `card_type` | `card_type` | card_click |
| `post_title` | `post_title` | post_card_click, post_view |
| `post_slug` | `post_slug` | post_card_click, post_view |
| `categories` | `categories` | post_card_click, post_view |
| `position` | `position` | post_card_click |
| `list_context` | `list_context` | post_card_click |
| `form_name` | `form_name` | form_submit |
| `form_type` | `form_type` | form_submit |
| `success` | `success` | form_submit |
| `search_term` | `search_term` | search |
| `results_count` | `results_count` | search |
| `action` | `action` | video_interaction |
| `video_title` | `video_title` | video_interaction |
| `progress` | `progress` | video_interaction |
| `component_name` | `component_name` | component_impression, time_spent |
| `component_type` | `component_type` | component_impression |
| `depth_percentage` | `depth_percentage` | scroll_depth |
| `page` | `page` | scroll_depth |
| `link_text` | `link_text` | link_click |
| `link_url` | `link_url` | link_click |
| `link_type` | `link_type` | link_click |
| `duration_seconds` | `duration_seconds` | time_spent |

---

## 3. Create Triggers

Create a **Custom Event** trigger for each event:

**How to create:**
1. Go to **Triggers** → **New**
2. Click **Choose trigger type** → **Custom Event**
3. Enter the **Event name** from the table below
4. Select **All Custom Events**
5. Name it as shown in the **Trigger Name** column
6. Click **Save**

| Event Name | Trigger Name | Description |
|------------|--------------|-------------|
| `button_click` | CE - Button Click | Fired when buttons/CTAs are clicked |
| `card_click` | CE - Card Click | Fired when custom cards are clicked |
| `post_card_click` | CE - Post Card Click | Fired when blog post cards are clicked |
| `post_view` | CE - Post View | Fired when a blog post is viewed |
| `form_submit` | CE - Form Submit | Fired when forms are submitted |
| `search` | CE - Search | Fired when search is performed |
| `video_interaction` | CE - Video Interaction | Fired on video play/pause/complete |
| `component_impression` | CE - Component Impression | Fired when components become visible |
| `scroll_depth` | CE - Scroll Depth | Fired at 25%, 50%, 75%, 100% scroll |
| `link_click` | CE - Link Click | Fired when links are clicked |
| `time_spent` | CE - Time Spent | Fired when user leaves a page/component |

---

## 4. Create Tags

### Option A: Universal GA4 Event Tag (Recommended)

**This single tag handles ALL events automatically!**

1. Go to **Tags** → **New**
2. Click **Choose tag type** → **Google Analytics: GA4 Event**
3. Configure:
   - **Configuration Tag**: Select your GA4 Configuration tag (or create one with your Measurement ID)
   - **Event Name**: `{{Event}}` (use the built-in Event variable)
   - Click **Advanced Settings** → **Fields to Set**
     - Add any global parameters you want (optional)
4. **Triggering**: 
   - Click the trigger box
   - Select **All Custom Events** or select all your CE triggers
5. Name it: `GA4 - All Events`
6. Click **Save**

**That's it!** This tag will automatically forward all your dataLayer events to GA4 with all parameters.

---

### Option B: Individual Tags Per Event

If you need more control, create separate tags for each event:

#### Example: Button Click Tag

1. Go to **Tags** → **New**
2. Click **Choose tag type** → **Google Analytics: GA4 Event**
3. Configure:
   - **Configuration Tag**: Your GA4 Config tag
   - **Event Name**: `button_click`
   - **Event Parameters**:
     - Parameter: `button_name` → Value: `{{button_name}}`
     - Parameter: `section` → Value: `{{section}}`
     - Parameter: `destination_url` → Value: `{{destination_url}}`
4. **Triggering**: `CE - Button Click`
5. Name it: `GA4 - Button Click`
6. Save

**Repeat for each event** with the appropriate parameters from the table in Section 2.

---

## 5. Testing

### Preview Mode

1. In GTM, click **Preview** (top right)
2. Enter your website URL
3. GTM opens your site in debug mode
4. Perform actions (click cards, buttons, search, etc.)
5. Check the **Summary** panel:
   - ✅ Events should appear in the left panel
   - ✅ Click each event to see the dataLayer data
   - ✅ Verify all variables have correct values
   - ✅ Check that tags fired successfully

### Debug Checklist

- [ ] GTM container loads on page
- [ ] Events fire when actions occur
- [ ] Variables contain correct data (no undefined values)
- [ ] Tags trigger successfully
- [ ] No errors in console

### Publish Your Container

1. Click **Submit** (top right)
2. Add **Version Name**: e.g., "Initial analytics setup"
3. Add **Version Description**: "Added tracking for cards, buttons, search, video, forms"
4. Click **Publish**

---

## 6. Events Reference

Complete list of events tracked in your application:

### `button_click`
**Triggered:** When any button or CTA is clicked  
**Helper Function:** `trackButtonClick(buttonName, section?, url?)`  
**Parameters:**
- `button_name` - Name/label of the button
- `section` - Section where button is located (optional)
- `destination_url` - Where the button navigates (optional)

**Example Usage:**
```typescript
import { trackButtonClick } from '@/cms/utilities/analytics'
trackButtonClick('Sign Up', 'Hero Section', '/signup')
```

---

### `card_click`
**Triggered:** When custom cards are clicked  
**Helper Function:** `trackCardClick(cardTitle, cardType?, destination?)`  
**Parameters:**
- `card_title` - Title of the card
- `card_type` - Type of card (e.g., 'custom', 'service')
- `destination_url` - Where the card navigates

**Example Usage:**
```typescript
import { trackCardClick } from '@/cms/utilities/analytics'
trackCardClick('Our Services', 'custom', '/services')
```

---

### `post_card_click`
**Triggered:** When blog post cards are clicked  
**Helper Function:** `trackPostCardClick(postTitle, postSlug, categories?, position?, listContext?)`  
**Parameters:**
- `post_title` - Title of the post
- `post_slug` - URL slug of the post
- `categories` - Comma-separated categories
- `position` - Position in list (1-indexed)
- `list_context` - Where card appeared (e.g., 'archive', 'related')

**Example Usage:**
```typescript
import { trackPostCardClick } from '@/cms/utilities/analytics'
trackPostCardClick('Getting Started', 'getting-started', ['Tutorial', 'Guides'], 1, 'archive')
```

---

### `post_view`
**Triggered:** When a blog post page is viewed  
**Helper Function:** `trackPostView(postTitle, postSlug, categories?)`  
**Parameters:**
- `post_title` - Title of the post
- `post_slug` - URL slug of the post
- `categories` - Comma-separated categories

**Example Usage:**
```typescript
import { trackPostView } from '@/cms/utilities/analytics'
trackPostView('My Post', 'my-post', ['News', 'Updates'])
```

---

### `form_submit`
**Triggered:** When forms are submitted  
**Helper Function:** `trackFormSubmit(formName, formType?, success?)`  
**Parameters:**
- `form_name` - Name of the form
- `form_type` - Type (e.g., 'contact', 'newsletter')
- `success` - Whether submission succeeded (default: true)

**Example Usage:**
```typescript
import { trackFormSubmit } from '@/cms/utilities/analytics'
trackFormSubmit('Contact Form', 'contact', true)
```

---

### `search`
**Triggered:** When search is performed  
**Helper Function:** `trackSearch(searchTerm, resultsCount?)`  
**Parameters:**
- `search_term` - The search query
- `results_count` - Number of results returned

**Example Usage:**
```typescript
import { trackSearch } from '@/cms/utilities/analytics'
trackSearch('payload cms', 12)
```

---

### `video_interaction`
**Triggered:** On video play, pause, or complete  
**Helper Function:** `trackVideoInteraction(action, videoTitle, progress?)`  
**Parameters:**
- `action` - 'play', 'pause', or 'complete'
- `video_title` - Title of the video
- `progress` - Progress percentage (0-100)

**Example Usage:**
```typescript
import { trackVideoInteraction } from '@/cms/utilities/analytics'
trackVideoInteraction('play', 'Product Demo', 0)
trackVideoInteraction('complete', 'Product Demo', 100)
```

---

### `component_impression`
**Triggered:** When components become visible (50% for 1 second by default)  
**Hook:** `useTrackImpression(componentName, componentType?, threshold?, minVisibleTime?)`  
**Parameters:**
- `component_name` - Name of the component
- `component_type` - Type (e.g., 'hero', 'cta')

**Example Usage:**
```typescript
import { useTrackImpression } from '@/cms/hooks/useAnalytics'

const MyComponent = () => {
  const ref = useTrackImpression('Hero Banner', 'hero')
  return <div ref={ref}>...</div>
}
```

---

### `scroll_depth`
**Triggered:** At 25%, 50%, 75%, 100% scroll depth  
**Hook:** `useTrackScrollDepth()`  
**Parameters:**
- `depth_percentage` - Scroll depth (25, 50, 75, or 100)
- `page` - Current page path

**Example Usage:**
```typescript
import { useTrackScrollDepth } from '@/cms/hooks/useAnalytics'

const Page = () => {
  useTrackScrollDepth()
  return <div>...</div>
}
```

---

### `link_click`
**Triggered:** When links are clicked  
**Hook:** `useTrackLink(linkText, linkUrl, isExternal?)`  
**Parameters:**
- `link_text` - Text of the link
- `link_url` - URL of the link
- `link_type` - 'internal' or 'external'

**Example Usage:**
```typescript
import { useTrackLink } from '@/cms/hooks/useAnalytics'

const MyComponent = () => {
  const handleClick = useTrackLink('Read More', '/blog/post-1', false)
  return <a onClick={handleClick}>Read More</a>
}
```

---

### `time_spent`
**Triggered:** When user leaves a page/component  
**Hook:** `useTrackTimeSpent(componentName)`  
**Parameters:**
- `component_name` - Name of the component
- `duration_seconds` - Time spent in seconds

**Example Usage:**
```typescript
import { useTrackTimeSpent } from '@/cms/hooks/useAnalytics'

const ProductPage = () => {
  useTrackTimeSpent('Product Detail Page')
  return <div>...</div>
}
```

---

## Advanced: Custom Events

You can track custom events using `track()` directly:

```typescript
import { track } from '@/cms/utilities/analytics'

// Track anything you want
track('custom_event', {
  any: 'data',
  you: 'want',
  value: 123
})
```

Then create the corresponding trigger and tag in GTM!

---

## Useful Resources

- [GTM Documentation](https://support.google.com/tagmanager)
- [GTM Academy](https://analytics.google.com/analytics/academy/)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GTM Community Templates](https://tagmanager.google.com/gallery/)

## Troubleshooting

**Events not appearing in GTM Preview?**
- Check console for errors
- Verify cookie consent was given
- Check `window.dataLayer` in console: `console.log(window.dataLayer)`

**Tags not firing?**
- Verify trigger event name matches exactly
- Check trigger is attached to tag
- Use GTM Preview mode to debug

**Variables showing as undefined?**
- Verify Data Layer Variable name matches parameter name exactly
- Check the event is pushing the parameter: `console.log(window.dataLayer)`

1. Go to **Tags** → **New**
2. **Choose tag type** → **Google Analytics: GA4 Event**
3. Configure:
   - **Configuration Tag**: Your GA4 Config tag (or create one)
   - **Event Name**: `card_click` (or use `{{Event}}` to use the event name from dataLayer)
   - **Event Parameters**:
     - Parameter Name: `card_title` → Value: `{{card_title}}`
     - Parameter Name: `card_type` → Value: `{{card_type}}`
     - Parameter Name: `destination_url` → Value: `{{destination_url}}`
4. **Triggering**: Select `CE - Card Click`
5. Name it: `GA4 - Card Click Event`
6. Save

#### Meta Pixel Tag (Example)

1. **Tags** → **New**
2. **Choose tag type** → **Custom HTML** (or use Meta Pixel template from Community Templates)
3. Add your Meta Pixel code with the event
4. **Triggering**: Select your trigger
5. Save

## 4. Test Your Setup

### Preview Mode

1. In GTM, click **Preview**
2. Enter your website URL
3. GTM will open your site in debug mode
4. Perform actions (click cards, buttons, etc.)
5. Check that events appear in the **Summary** panel
6. Verify all variables have correct values

### Debug Checklist

- ✅ GTM container loads on page
- ✅ Events fire when actions occur
- ✅ Variables contain correct data
- ✅ Tags trigger successfully

## 5. Publish Your Container

1. Click **Submit** in GTM
2. Add **Version Name**: e.g., "Initial analytics setup"
3. Add **Version Description**: Describe what you configured
4. Click **Publish**

## 6. Common GTM Tags to Add

### Google Analytics 4
- Event tag for each custom event
- Page view tracking
- Scroll depth tracking

### Meta Pixel
- PageView
- Custom events (Lead, Purchase, etc.)

### LinkedIn Insight Tag
- Page view tracking
- Conversion tracking

### Google Ads Conversion Tracking
- Conversion tags for specific events

## 7. Events Already Implemented in Your Code

Your code fires these events to the dataLayer:

| Event Name | Parameters | Usage |
|------------|------------|-------|
| `button_click` | `button_name`, `section`, `destination_url` | Button/CTA clicks |
| `link_click` | `link_text`, `link_url`, `link_type` | Link clicks |
| `form_submit` | `form_name`, `form_type`, `success` | Form submissions |
| `card_click` | `card_title`, `card_type`, `destination_url` | Custom card clicks |
| `post_card_click` | `post_title`, `post_slug`, `categories`, `position`, `list_context` | Blog post card clicks |
| `search` | `search_term`, `results_count` | Search queries |
| `file_download` | `file_name`, `file_type`, `file_url` | File downloads |
| `video_interaction` | `action`, `video_title`, `progress` | Video plays/pauses |

## 8. Best Practices

- **Use consistent naming**: Stick to snake_case for events and parameters
- **Document everything**: Add descriptions in GTM for all tags/triggers/variables
- **Use folders**: Organize tags by platform (GA4, Meta, LinkedIn, etc.)
- **Test before publishing**: Always use Preview mode
- **Version control**: Write clear version descriptions when publishing
- **Keep it simple**: Start with key events, add more later
- **Monitor regularly**: Check if tags are firing correctly using GTM preview or GA4 DebugView

## 9. Debugging Tools

- **GTM Preview Mode**: Built into GTM interface
- **Google Tag Assistant**: Chrome extension
- **GA4 DebugView**: Real-time event monitoring in GA4
- **Browser Console**: Check `window.dataLayer` to see pushed events

```javascript
// In browser console, check dataLayer
console.log(window.dataLayer)
```

## Support

- [GTM Documentation](https://support.google.com/tagmanager)
- [GTM Academy](https://analytics.google.com/analytics/academy/)
- [GTM Community Templates](https://tagmanager.google.com/gallery/)
