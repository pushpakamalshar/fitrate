# AI Outfit Rater (Working Name: fitrate)

# PART 1 — PRODUCT REQUIREMENTS DOCUMENT (PRD)

---

# 1. Product Overview

**Product Name (Working):** fitrate

**Category:** AI Fashion SaaS

**Platform:** Responsive Web Application

**One-liner**

An AI-powered fashion platform where users upload their outfit photos, receive detailed AI ratings and styling advice, then optionally share their fitchecks with the community.

---

# 2. Problem Statement

People constantly wonder:

- Does this outfit actually look good?
- Do these colors work together?
- What should I improve?
- What would make this outfit look premium?

Current solutions are limited because they:

- depend on random opinions
- only provide generic fashion advice
- don't explain why an outfit works
- don't remember previous outfits
- lack objective analysis

Users need instant, personalized, AI-powered fashion feedback.

---

# 3. Solution

Users upload a full-body outfit photo.

The AI analyzes:

- Color Harmony
- Overall Style
- Fit
- Layering
- Accessories
- Footwear
- Balance
- Silhouette
- Trendiness
- Occasion Suitability

The AI returns:

- Overall Rating
- Category Scores
- Strengths
- Weaknesses
- Personalized Suggestions
- Outfit Summary
- Style Archetype
- Occasion Match

Users can save their fitchecks or publish them to the community.

---

# 4. Target Users

| User                | Goal                        |
| ------------------- | --------------------------- |
| Students            | Dress better every day      |
| Fashion Enthusiasts | Improve personal style      |
| Content Creators    | Share outfits               |
| Professionals       | Dress confidently           |
| Casual Users        | Get outfit advice instantly |

---

# 5. Goals (MVP)

Create an AI fashion platform where users can:

✅ Upload outfits

✅ Receive AI ratings

✅ Save history

✅ View previous analyses

✅ Share outfits publicly

✅ Browse community fits

---

# Success Metrics

- AI analysis under 10 seconds
- High upload completion rate
- Returning users
- Community engagement
- Outfit history usage

---

# 6. Scope

## In Scope

- Landing Page
- Authentication
- User Profiles
- Upload Outfit
- AI Analysis
- Rating Dashboard
- Outfit History
- Community Feed
- Likes
- Comments
- Bookmarks
- Responsive Design
- Dark Mode
- Notifications

---

## Out of Scope (Phase 1)

- Virtual Try-On
- AI Shopping
- Wardrobe Planner
- Mobile Apps
- Brand Marketplace

---

# 7. Tech Stack

## Frontend

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Backend

- Supabase

### Services

- Authentication
- PostgreSQL
- Storage
- Realtime
- Edge Functions

## AI

OpenAI Vision

(or Gemini Vision)

---

# 8. Design Philosophy

## Style

Premium

Minimal

Editorial

Modern

Timeless

Inspired by:

- shadcn/ui
- Apple
- Linear
- Arc
- Vercel
- COS
- Notion

The interface should disappear.

The outfit should become the hero.

No unnecessary colors.

No gradients.

No flashy UI.

Luxury comes from spacing, typography, and simplicity.

---

# 9. Design System

## Theme

Monochrome Fashion

### Background

```
#F7F7F7
```

### Card

```
#FFFFFF
```

### Hover

```
#FAFAFA
```

### Border

```
#E5E5E5
```

### Primary Text

```
#09090B
```

### Secondary Text

```
#71717A
```

### Accent

```
Black
```

No colorful interface.

Uploaded outfit photos provide the color.

---

## Typography

Geist

or

Inter

Large headings

Semibold

Comfortable spacing

Minimal bold usage

---

## Border Radius

Cards

```
rounded-3xl
```

Buttons

```
rounded-full
```

Inputs

```
rounded-2xl
```

Images

```
rounded-2xl
```

---

## Motion

150ms–200ms

Fade

Scale

Slide

Blur

Never bounce.

---

# 10. User Flow

Landing

↓

Authentication

↓

Upload Outfit

↓

AI Processing

↓

Results Dashboard

↓

Save Outfit

↓

Publish to Community

↓

Community Feed

↓

Profile

---

# 11. Screens

## Landing Page

Hero

Features

How It Works

Testimonials

CTA

Footer

---

## Authentication

Login

Signup

Forgot Password

Google Login

---

## Dashboard

Recent Fitchecks

Average Score

Quick Upload

Statistics

Trending Fits

---

## Upload

Drag & Drop

Image Preview

Replace Image

Analyze Button

---

## AI Loading

Image Preview

Animated Progress

AI Thinking

Loading Skeleton

---

## Results Dashboard

Uploaded Outfit

Overall Score

Category Ratings

What Works

What Could Improve

AI Summary

Style Archetype

Occasion Match

Suggested Improvements

Save

Share

---

## Community

Trending

Newest

Following

Top Rated

Search

---

## Outfit Detail

Photo

Rating

Comments

Likes

Bookmarks

Related Fits

---

## User Profile

Avatar

Bio

Statistics

Uploads

Average Rating

Saved Fits

Followers

Following

---

## Notifications

Likes

Comments

Followers

Mentions

System Updates

---

## Settings

Account

Appearance

Notifications

Privacy

Delete Account

---

# 12. Core Features

## Authentication

Supabase Auth

Google OAuth

Magic Link

Email Login

---

## Upload Outfit

Drag & Drop

Camera Upload

Preview

Delete

Replace

Compression

---

## AI Analysis

Overall Score

Color Harmony

Fit

Style

Accessories

Footwear

Silhouette

Layering

Trend Score

Occasion Match

---

## AI Suggestions

What Works

What Could Improve

Alternative Colors

Accessories

Footwear

Confidence Level

Outfit Summary

---

## Community

Like

Comment

Bookmark

Share

Trending

Leaderboard

Profile

---

## Outfit History

Previous Uploads

Previous Ratings

Re-analyze

Delete

Private/Public Toggle

---

# 13. Database

## profiles

- id
- username
- avatar
- bio
- created_at

---

## fitchecks

- id
- user_id
- image_url
- visibility
- created_at

---

## analyses

- id
- fitcheck_id
- overall_score
- color_score
- fit_score
- style_score
- accessory_score
- footwear_score
- summary
- strengths
- improvements
- archetype
- occasion

---

## likes

- id
- fitcheck_id
- user_id

---

## comments

- id
- fitcheck_id
- user_id
- comment
- created_at

---

## bookmarks

- id
- fitcheck_id
- user_id

---

## notifications

- id
- user_id
- type
- reference_id
- read
- created_at

---

# 14. Folder Structure

```
app/
(auth)
(dashboard)
(upload)
(community)
(profile)
(settings)

components/
landing/
upload/
analysis/
community/
profile/
shared/
ui/

lib/
supabase/
utils/

hooks/

store/

types/

data/

public/
```

---

# 15. shadcn/ui Components

Use only shadcn/ui components whenever possible.

- Button
- Card
- Avatar
- Badge
- Tabs
- Dialog
- Sheet
- Drawer
- Dropdown Menu
- Tooltip
- Hover Card
- Alert
- Progress
- Skeleton
- Sonner
- Separator
- Scroll Area
- Carousel
- Input
- Textarea
- Form

---

# 16. AI Response Format

```json
{
  "overallScore": 9.1,
  "scores": {
    "colorHarmony": 9,
    "fit": 9,
    "style": 10,
    "accessories": 8,
    "footwear": 9
  },
  "strengths": [],
  "improvements": [],
  "summary": "",
  "styleArchetype": "",
  "occasion": "",
  "confidence": 97
}
```

---

# 17. Development Principles

- Server Components by default
- Server Actions where appropriate
- Strict TypeScript
- No `any`
- Mobile-first
- Fully responsive
- Accessible (WCAG AA)
- Reusable components
- Clean folder structure
- Production-ready code
- `npm run lint` passes
- `npm run build` passes
- Zero console errors

---

# 18. Roadmap

## Phase 1

Landing Page

Authentication

Upload

AI Rating

History

---

## Phase 2

Community

Comments

Likes

Bookmarks

Profiles

Leaderboards

---

## Phase 3

AI Wardrobe

Virtual Stylist

Closet Management

Daily Outfit Generator

Shopping Recommendations

---

# PART 2 — CLAUDE CODE PROMPT

You are building **Tenue AI**, a premium AI-powered fashion web application.

## Tech Stack

- Next.js 15 App Router
- TypeScript (Strict)
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Supabase (Auth, PostgreSQL, Storage, Realtime)
- OpenAI Vision (or Gemini Vision)

## Goal

Build a production-quality AI fashion platform where users upload outfit photos, receive AI-generated ratings and personalized styling advice, save their outfit history, and optionally share fitchecks with the community.

## Design Style

- Premium monochrome aesthetic
- Inspired by Apple, Linear, shadcn/ui, Arc, and COS
- White, black, and gray only
- Outfit photos are the primary visual focus
- Large whitespace
- Rounded corners
- Subtle shadows
- No gradients
- Minimal animations (150–200ms)
- Fully responsive
- Mobile-first

## Build Order

1. Design System & Layout
2. Landing Page
3. Authentication
4. Dashboard
5. Upload Flow
6. AI Analysis Screen
7. Community Feed
8. User Profile
9. Notifications
10. Settings
11. Responsive Optimization
12. Performance & Accessibility
