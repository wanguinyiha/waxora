# Supabase Integration Plan — Waxing Company Website

## Objective

Integrate Supabase into the existing Next.js waxing company website.

The website belongs to one waxing company. Customers do not create accounts and do not log in.

Supabase will be used for:

- PostgreSQL database
- Admin authentication
- Services
- Bookings
- Reviews
- Blog posts
- Business availability
- Blocked appointment times
- Storage where necessary

The booking system must always create appointments for this company's business.

---

# 1. User Types

There are only two types of users:

## Admin

The business owner/admin is authenticated.

The admin can:

- Log in
- Manage services
- Manage bookings
- Manage reviews
- Manage blog posts
- Manage business availability
- Block/unblock dates and times
- View customer booking information

## Customers

Customers are guests.

They do NOT:

- Create accounts
- Log in
- Have passwords
- Have customer dashboards
- Have profiles
- Need Supabase Auth

Customers can:

- Browse the website
- View services
- Read the blog
- Read reviews
- Submit a booking
- Submit a review
- Receive booking information through email

---

# 2. Supabase Database

Create the following core tables.

## Services

Fields:

- id
- name
- slug
- short_description
- description
- price
- duration_minutes
- preparation
- aftercare
- is_active
- created_at
- updated_at

Only active services should appear as bookable services.

---

## Bookings

Because customers are guests, do not create a customer user relationship.

Fields:

- id
- service_id
- customer_name
- customer_email
- customer_phone
- appointment_date
- start_time
- end_time
- status
- notes
- created_at
- updated_at

Possible statuses:

- pending
- confirmed
- completed
- cancelled
- no_show

Customer information should be stored directly on the booking.

---

## Reviews

Customers should be able to submit reviews without having an account.

Fields:

- id
- customer_name
- rating
- review_text
- approved
- created_at
- updated_at

Only approved reviews should appear publicly.

The admin controls whether a review is approved.

---

## Blog Posts

Fields:

- id
- title
- slug
- excerpt
- content
- featured_image
- category
- published
- published_at
- created_at
- updated_at

Only published posts should appear on the public website.

Only the admin can manage blog posts.

---

## Business Hours

Create a table for the company's normal operating hours.

Fields:

- id
- day_of_week
- opening_time
- closing_time
- is_open

The admin should be able to manage these hours.

---

## Blocked Times

Create a table for dates/times when appointments cannot be booked.

Fields:

- id
- start_datetime
- end_datetime
- reason
- created_at

Examples:

- Holiday
- Business closed
- Personal day
- Fully booked
- Special event

---

# 3. Admin Authentication

Use Supabase Auth only for the admin.

Do not implement customer authentication.

The admin should have:

- Login
- Logout
- Password reset if required

The admin dashboard must be protected.

Unauthenticated visitors must not be able to access admin pages.

The public website must remain accessible without authentication.

---

# 4. Admin Authorization

Use an admin-only access model.

The application should verify that the authenticated Supabase user is an authorized admin before allowing access to administrative functionality.

Do not rely only on hiding admin links from the UI.

Authorization must also be enforced server-side and through appropriate database policies.

---

# 5. Row Level Security

Enable RLS on the database tables.

## Services

Public users:

- Can read active services.

Admin:

- Can create
- Can update
- Can deactivate
- Can delete where appropriate

---

## Blog Posts

Public users:

- Can read published posts.

Admin:

- Can create
- Can update
- Can publish
- Can unpublish
- Can delete

---

## Reviews

Public users:

- Can submit a review.
- Can read approved reviews.

Customers should not be able to edit or delete arbitrary reviews.

Admin:

- Can approve
- Can reject
- Can edit
- Can delete

---

## Bookings

Public users:

- Can create a booking.
- Should not be able to retrieve all bookings.
- Should not be able to access other customers' information.

Admin:

- Can view and manage all bookings.

Important:

Do not expose the bookings table directly to the public client in a way that allows customers to query other customers' personal information.

Booking creation should preferably go through a secure server-side action/API route with validation.

---

## Business Hours

Public users:

- Can read the information necessary to determine available appointment times.

Admin:

- Can modify business hours.

---

## Blocked Times

Public users:

- Can access only the information required to determine availability.

Admin:

- Can create, modify, and delete blocked times.

Do not expose unnecessary internal information such as private reasons for blocked periods.

---

# 6. Booking Flow

The booking system should work without customer accounts.

Customer flow:

1. Customer opens the website.
2. Customer chooses a service.
3. Customer views service details.
4. Customer clicks Book Appointment.
5. Customer selects a date.
6. System checks business hours.
7. System checks blocked times.
8. System checks existing bookings.
9. System displays available appointment times.
10. Customer selects a time.
11. Customer enters:
   - Full name
   - Email
   - Phone number
   - Optional notes
12. Customer submits booking.
13. Server validates the booking.
14. Booking is created in Supabase.
15. Customer receives a confirmation email.
16. Admin receives a booking notification email.

---

# 7. Booking Validation

The system must validate bookings server-side.

Check:

- Service exists.
- Service is active.
- Date is valid.
- Time is valid.
- Business is open.
- Time is not blocked.
- Appointment does not conflict with another booking.
- Required customer information is provided.

Do not rely only on frontend validation.

The database/server should protect against race conditions and double bookings.

---

# 8. Customer Email

Customers should receive booking details by email.

The confirmation should contain:

- Customer name
- Company name
- Service
- Date
- Time
- Duration
- Price
- Company location
- Company contact information
- Booking/reference number
- Cancellation/rescheduling instructions if applicable

Do not require the customer to log in to see this information.

---

# 9. Admin Booking Email

When a new booking is created, the admin should receive an email notification containing:

- Customer name
- Customer email
- Customer phone
- Service
- Date
- Time
- Notes
- Booking/reference number

---

# 10. Email Architecture

Use a transactional email provider rather than attempting to send emails directly from the browser.

The flow should be:

Customer
↓
Booking form
↓
Secure server-side booking handler
↓
Supabase
↓
Email service
↓
Customer confirmation

And:

Supabase
↓
Email service
↓
Admin notification

Keep email API keys in environment variables.

Never expose email service API keys to the browser.

---

# 11. Reviews

Customers should be able to submit reviews without logging in.

Review flow:

Customer
↓
Review form
↓
Name + rating + review
↓
Supabase
↓
Pending approval
↓
Admin reviews it
↓
Approve
↓
Review becomes public

Do not automatically publish every submitted review.

---

# 12. Admin Dashboard

Create a protected admin dashboard.

The dashboard should contain:

## Overview

Display:

- Today's bookings
- Upcoming bookings
- Pending bookings
- Recent reviews
- Basic booking statistics

---

## Services

Admin can:

- Add service
- Edit service
- Change price
- Change duration
- Edit description
- Edit preparation instructions
- Edit aftercare instructions
- Activate/deactivate service

---

## Bookings

Admin can:

- View bookings
- Filter bookings
- View booking details
- Confirm booking
- Cancel booking
- Mark completed
- Mark no-show

---

## Reviews

Admin can:

- View pending reviews
- Approve reviews
- Reject reviews
- Delete reviews

---

## Blog

Admin can:

- Create article
- Edit article
- Save draft
- Publish article
- Unpublish article
- Delete article

---

## Availability

Admin can:

- Set business hours
- Close specific days
- Block specific times
- Reopen blocked times

---

# 13. Supabase Storage

Use Supabase Storage for website assets that need database-backed management.

Potential uses:

- Blog images
- Service images
- Company gallery images

Do not store images directly inside PostgreSQL.

Store the file in Supabase Storage and save its URL/path in the relevant database record.

---

# 14. Environment Variables

Use `.env.local`.

Keep:

- Supabase URL
- Supabase public/publishable key
- Email provider API key
- Any other private configuration

out of source code.

Never commit `.env.local` to GitHub.

Never expose server-only secrets to client components.

---

# 15. Security Requirements

Before completion, verify:

- Admin pages require authentication.
- Customers cannot access admin pages.
- Customers cannot retrieve all bookings.
- Customers cannot access another customer's personal information.
- Customers cannot modify bookings belonging to other customers.
- Admin permissions are enforced server-side.
- RLS is enabled.
- Service-role credentials are never exposed to the browser.
- Email API keys are never exposed to the browser.
- `.env.local` is ignored by Git.
- Booking creation is validated server-side.
- Double bookings are prevented.
- User input is validated and sanitized appropriately.

---

# 16. Testing

Test the following.

## Public website

- Homepage
- Services
- Service details
- Blog
- Blog articles
- Reviews
- FAQ
- Contact

## Booking

- Successful booking
- Invalid service
- Inactive service
- Closed day
- Blocked time
- Already-booked time
- Double-booking attempt
- Missing customer information
- Invalid email
- Invalid phone number

## Emails

- Customer receives confirmation
- Admin receives notification
- Correct booking information is included

## Reviews

- Customer submits review
- Review enters pending state
- Admin approves review
- Approved review appears publicly
- Rejected review remains hidden

## Admin

- Login
- Logout
- Protected routes
- Service management
- Booking management
- Review management
- Blog management
- Availability management

---

# 17. Implementation Order

Do not implement everything at once.

Work in this order:

### Phase 1
Inspect existing Next.js project.

### Phase 2
Install and configure Supabase.

### Phase 3
Set up environment variables.

### Phase 4
Create database schema.

### Phase 5
Configure RLS and security policies.

### Phase 6
Implement admin authentication.

### Phase 7
Connect services to Supabase.

### Phase 8
Connect blog to Supabase.

### Phase 9
Connect reviews to Supabase.

### Phase 10
Build the booking backend.

### Phase 11
Connect the booking UI.

### Phase 12
Integrate transactional email.

### Phase 13
Build/connect the admin dashboard.

### Phase 14
Implement business hours and blocked times.

### Phase 15
Test security and booking conflicts.

### Phase 16
Clean up code and remove mock data.

### Phase 17
Commit the completed integration to GitHub.

---

# Final Customer Experience

The final customer experience should be:

Browse website
↓
Explore services
↓
Read about treatment
↓
Choose service
↓
Book appointment
↓
Enter contact details
↓
Receive confirmation email
↓
Attend appointment
↓
Receive/request review
↓
Submit review

There is no customer account or customer login.

# Final Admin Experience

Admin
↓
Login
↓
Dashboard
├── Bookings
├── Services
├── Reviews
├── Blog
└── Availability

The system is exclusively for this one waxing company. There is no marketplace, studio discovery, multi-business functionality, or booking with other businesses.