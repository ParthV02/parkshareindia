# Parkshareindia

# ParkShare India — Premium Parking Space Sharing Platform

Build a complete, responsive web application called **ParkShare India** with the tagline **“Share Space. Park Smart.”**

ParkShare India is a peer-to-peer parking platform for Indian metropolitan cities. Drivers can discover and book available private parking spaces, while homeowners and authorized property owners can list unused parking spaces and earn money.

This is a college project prototype, so the application must be visually impressive, intuitive, interactive, and professional enough to demonstrate to a professor.

**IMPORTANT: Prioritize the UI/UX quality first. Do not create a generic template, dark dashboard, or basic CRUD application.**

## 1. Strict design system

Follow this design system throughout the entire application.

### Colors
- **Main background:** Pure white `#FFFFFF`
- **Secondary background:** Very light grey `#F8FAFC`
- **Primary yellow buttons:** `#FFD43B`
- **Yellow button hover:** `#F5C518`
- **Primary blue buttons:** `#2563EB`
- **Blue button hover:** `#1D4ED8`
- **Main text:** Dark navy `#172033`
- **Secondary text:** Slate grey `#64748B`
- **Borders:** Light grey `#E2E8F0`
- **Success:** Soft green for verified and successful states.
- **Warning:** Soft amber for pending reviews and reminders.
- **Error:** Restrained red for validation errors.

### Button rules
- Use **yellow buttons for primary actions**, such as “Search Parking”, “Book Now”, “Confirm Booking”, and “Add Parking Space”.
- Use **blue buttons for secondary actions**, such as “View Details”, “Manage Listing”, “View Bookings”, and “Verify Details”.
- Use white buttons with light grey borders for tertiary actions.
- Keep button text dark navy on yellow buttons and white on blue buttons.
- Use consistent button heights, rounded corners, subtle hover effects, and clear focus states.
- Never randomly switch button colors between pages.

### Overall appearance
- White background on all major pages.
- Spacious layouts with excellent alignment and visual hierarchy.
- Modern typography using Inter or a similar clean sans-serif font.
- Rounded cards with subtle shadows and thin grey borders.
- Clean forms with light backgrounds and clearly visible labels.
- Use professional parking photographs and tasteful illustrations.
- Use Lucide icons consistently.
- Use subtle transitions and micro-interactions.
- Use yellow sparingly to emphasize actions, not as a large page background.
- Blue should be used for navigation accents, secondary actions, links, and informational elements.

Avoid dark mode, purple-heavy themes, green-heavy themes, excessive gradients, neon colors, emoji-based illustrations, cluttered layouts, and oversized headings.

## 2. Technology

Use Lovable's supported stack, preferably:
- React and TypeScript.
- Tailwind CSS.
- Reusable UI components.
- Lucide icons.
- Supabase for authentication, database, and storage if supported and configured.
- Leaflet with OpenStreetMap for a map, if available and appropriate.

Use a maintainable component-based architecture. Build a working application, not just a visual mockup. If a backend integration is not configured, use clearly labelled demo data and explain which functionality is simulated.

## 3. Landing page

Design an excellent white-background landing page.

### Navigation bar
Include:
- ParkShare India logo with a simple parking-related icon.
- Find Parking.
- Offer Your Space.
- My Bookings.
- How It Works.
- Sign In.
- A yellow “Find Parking” call-to-action.

Keep the navigation white with a thin bottom border. Make it sticky on scroll where appropriate.

### Hero section

Use a two-column layout on desktop and a stacked layout on mobile.

Left side:
- Small label: “SMARTER PARKING FOR SMARTER CITIES”
- Heading: “Your parking spot is closer than you think.”
- Description: “Discover convenient parking spaces near your destination. Book your slot in minutes and spend less time searching.”
- Search form with city, locality or landmark, date, start time, duration, and vehicle type.
- A prominent yellow “Search Parking” button.
- Popular city chips: Mumbai, Delhi, Bengaluru, Pune, Hyderabad, and Chennai.

Right side:
- A beautiful parking-related photograph or a polished map preview.
- Show sample parking markers and small floating cards with prices.
- Keep the visual balanced against the white background.

### Below the hero
Include:
- A trust strip with “Easy Booking”, “Transparent Pricing”, “Verified Listings”, and “Flexible Extensions”.
- A “How ParkShare Works” section with three or four clear steps.
- A “Find Parking Near You” section featuring sample spaces.
- A section for property owners explaining how they can earn from unused spaces.
- A trust and safety section.
- A clean footer with About, Contact, Privacy, Terms, and Support.

## 4. Driver experience

Create a polished parking search interface.

### Search results page
Use a two-column desktop layout:
- Left side: parking listing cards.
- Right side: interactive map.
- On mobile: provide a map/list toggle.

Add filters for:
- City and locality.
- Price range.
- Covered, open, basement, and garage parking.
- Car, SUV, hatchback, and bike.
- Availability.
- Distance from destination.

Add sorting by price, distance, and relevance.

### Parking cards
Every card should include:
- Parking photo.
- Space name.
- Locality and city.
- Distance, when genuinely available.
- Price per hour in Indian rupees.
- Parking type.
- Allowed vehicle types.
- Availability status.
- Host review or verification status.
- “View Details” blue button.
- “Book Now” yellow button.

Use realistic sample listings from localities such as Andheri, Bandra, Powai, and Lower Parel in Mumbai, along with sample spaces in other metropolitan cities.

Clearly label seeded records as demo listings. Do not claim that sample availability or ratings are live or verified.

### Parking details
When a listing is opened, display:
- Large photo gallery.
- Parking title and locality.
- Map or location preview.
- Price per hour and daily cap.
- Vehicle restrictions.
- Available times.
- Entry instructions.
- Parking rules.
- Host verification status.
- Booking summary.
- Yellow “Book Now” button.

## 5. Driver verification

Before confirming a booking, create a simple verification workflow showing:
- Mobile verification.
- Aadhaar identity verification.
- Driving licence verification.
- Consent and privacy acknowledgement.

For this prototype, use simulated verification statuses only. Never ask for real Aadhaar numbers, real licence numbers, or actual government identity documents.

Display a clear “Demo Verification” label.

In a production application, integrate authorized verification providers, obtain appropriate consent, and implement secure data handling. Never display sensitive identity information to parking owners.

## 6. Booking workflow

Implement a professional multi-step booking process.

**Step 1 — Select booking details**
- Date.
- Start time.
- Duration.
- Vehicle type.
- Parking space summary.

**Step 2 — Review price**
- Hourly rate.
- Number of hours.
- Applicable fees, if any.
- Total amount.
- Cancellation policy.
- Parking rules.

Update the total dynamically whenever the duration changes.

**Step 3 — Demo payment**
- Create a polished payment screen.
- Show demo UPI and card options.
- Clearly state that payments are simulated and no money is charged.

**Step 4 — Confirmation**
- Show a success illustration.
- Booking reference.
- Space details.
- Start and end time.
- Amount.
- Booking status.
- Blue “View Booking” button.
- Yellow “Find More Parking” button.

All booking steps should be functional and navigable.

## 7. My Bookings page

Create a clean dashboard using white cards, light borders, and yellow and blue buttons.

Include:
- Upcoming bookings.
- Active bookings.
- Completed bookings.
- Cancelled bookings.
- Booking reference.
- Space details.
- Date and time.
- Total price.
- Countdown timer for active demo bookings.
- “Extend Time” button.
- “Cancel Booking” button when applicable.
- Booking details and support actions.

### Time extension
When a user selects Extend Time:
1. Offer additional durations.
2. Check simulated availability.
3. Calculate the additional price.
4. Request confirmation.
5. Update the booking end time and total.
6. Show a success message.

Display an in-app reminder before a demo booking expires.

Include an accelerated demo timer so the feature can be demonstrated during a college presentation.

Do not claim that background notifications work when the application is closed unless they are actually implemented.

## 8. Space owner experience

Create a separate **Offer Your Space** experience.

Use the same white background and design system. Yellow buttons remain the primary action color, and blue buttons remain secondary.

### Owner dashboard
Display:
- Total listings.
- Active listings.
- Pending reviews.
- Total bookings.
- Estimated earnings.
- Recent booking activity.
- Listing status.
- Yellow “Add Parking Space” button.

Use simple, readable statistic cards instead of an overcrowded analytics dashboard.

### Add parking space form

Create a multi-step form with a progress indicator.

**Step 1 — Basic information**
- Listing title.
- City.
- Locality.
- Address.
- Parking type.
- Vehicle type.
- Vehicle size restrictions.

**Step 2 — Pricing and availability**
- Price per hour.
- Daily maximum price.
- Available days.
- Available hours.
- Blocked dates and times.

**Step 3 — Location**
- Map pin selection.
- Address and locality confirmation.
- Optional current-location request with explicit browser permission.
- Location coordinates and accuracy only when genuinely obtained.

**Step 4 — Photo evidence**
- Upload parking-space photographs.
- Upload entrance photographs.
- Preview selected photographs.
- Show upload status.

**Step 5 — Authorization**
- Declaration that the owner is authorized to offer the space.
- Proof-of-authorization checklist.
- Society or property-management permission where relevant.
- Submit for review.

The photo and location steps must not automatically prove ownership. Use listing statuses such as Draft, Pending Review, Approved, Rejected, and Suspended.

### Listing management
Allow owners to:
- Edit listings.
- Pause listings.
- Change availability.
- Adjust rates.
- View bookings.
- View estimated earnings.
- Review listing status.

Show confirmation dialogs for important actions.

## 9. Trust and safety

Build a dedicated section explaining:
- Driver verification.
- Owner authorization checks.
- Photo evidence.
- Location consistency checks.
- Transparent pricing.
- Booking history.
- Dispute reporting.

Add a “Report a Problem” action to bookings and listings.

For the prototype, dispute reports may be stored as demo records.

Clearly explain that verification reduces risks but cannot eliminate every dispute or guarantee legal ownership.

## 10. Map experience

The map should visually complement the white UI.

Prefer Leaflet and OpenStreetMap if available. Use clean map tiles, blue or yellow markers, clear location labels, and listing previews.

Interactions:
- Click a marker to open its parking card.
- Click a parking card to focus its marker.
- Switch between map and list views.
- Search by city or locality.

If a live map is unavailable, create a clearly labelled illustrative map rather than pretending to display real locations or live parking availability.

## 11. Authentication and data

If Supabase is configured, use it for:
- User authentication.
- User and owner profiles.
- Parking listings.
- Photos.
- Availability.
- Bookings.
- Notifications.
- Dispute reports.

Implement appropriate access controls so users cannot modify another user's listings or bookings.

Check booking conflicts on the server before confirming reservations.

Never expose secret keys in frontend code.

If authentication and backend services are not configured, provide a convenient demo access mode with sample records, clearly labelled as simulated.

## 12. Responsive design and accessibility

The application must work well on:
- Desktop.
- Tablet.
- Mobile.

Use:
- Responsive grids.
- Mobile-friendly forms.
- Touch-friendly buttons.
- Readable font sizes.
- Visible keyboard focus.
- Accessible form labels.
- Helpful validation errors.
- Loading and empty states.
- Success and failure feedback.

Maintain the white, yellow, and blue design system across every page, modal, dashboard, and form.

## 13. Final implementation requirements

Build and test these complete user journeys:

1. Search for parking in Mumbai.
2. Filter and open a parking listing.
3. Complete the simulated verification flow.
4. Create and confirm a demo booking.
5. View the booking and extend the duration.
6. Demonstrate the expiry reminder.
7. Switch to Owner mode.
8. Create a parking listing.
9. Preview a photo and simulate the location check.
10. Submit listing evidence for review.
11. View listing status in the owner dashboard.

Ensure all buttons and forms work. Avoid dead links, placeholder sections, and non-functional controls.

Use Indian rupee formatting throughout. Add realistic demo data for metropolitan Indian cities.

### Final instruction

Build the working ParkShare India application, not just a landing page or a design proposal.

**The visual priority is: pure white background, yellow primary buttons, blue secondary buttons, clean typography, professional parking visuals, elegant cards, and excellent spacing.**

Prioritize a beautiful, polished frontend first, then connect the database and backend. Preserve the same visual identity across the complete application. Finish by testing the main driver and owner journeys and fixing any visible issues.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://parkshareindia.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/933616d2-1406-4622-941f-75076f50d2bd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
