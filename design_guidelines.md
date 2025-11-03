# IUO Student Archive - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Material Design) with Academic Platform Context

**Justification:** This is a utility-focused, information-dense platform where efficiency, clear hierarchy, and usability are paramount. The system needs to handle complex navigation (Department → Level → Course → Files) while maintaining clarity. Drawing inspiration from Google Classroom, Notion, and Linear for their clean, productivity-focused interfaces.

**Key Design Principles:**
- Academic Trust: Professional, credible appearance that students and administrators trust
- Efficient Navigation: Clear pathways through complex hierarchies
- Information Clarity: Dense content presented with strong visual hierarchy
- Action-Oriented: Upload, download, and search workflows are prominent and intuitive

---

## Typography

**Font Families:**
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for file names, course codes)

**Type Scale:**
- Hero/Page Titles: text-4xl md:text-5xl font-bold
- Section Headers: text-3xl font-semibold
- Subsection Headers: text-2xl font-semibold
- Card Titles: text-xl font-semibold
- Body Text: text-base leading-relaxed
- Labels/Metadata: text-sm font-medium
- Course Codes: font-mono text-sm tracking-wide
- Captions: text-xs text-opacity-70

---

## Layout System

**Spacing Primitives:** We will use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24** (p-2, p-4, m-6, gap-8, py-12, px-16, py-20, mb-24)

**Container Strategy:**
- Max widths: max-w-7xl for main content areas
- Page padding: px-4 md:px-6 lg:px-8
- Section spacing: py-12 md:py-16 lg:py-20
- Card/Component padding: p-4 md:p-6
- Grid gaps: gap-4 md:gap-6 lg:gap-8

**Responsive Breakpoints:**
- Mobile-first approach
- Grid columns: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

---

## Component Library

### Navigation

**Top Navigation Bar:**
- Fixed position with subtle shadow/border
- Height: h-16 md:h-20
- Logo on left, search bar center, user profile/actions right
- Mobile: Hamburger menu with slide-out drawer
- Search bar: Prominent, always visible, min-w-96 on desktop
- Action buttons: "Upload File" (primary CTA), Profile dropdown

**Sidebar (Dashboard/Browse Pages):**
- Width: w-64 on desktop, hidden on mobile (drawer pattern)
- Department filter/navigation tree
- Level selector (100-600)
- Recent uploads section
- User stats widget (uploads, reputation)

**Breadcrumbs:**
- Visible on all nested pages
- Format: Home → Computer Science → 200 Level → CSC 201
- Interactive with hover states
- Size: text-sm with separator icons

### Cards & Lists

**Department Card:**
- Aspect ratio: aspect-[4/3] or min-h-48
- Layout: Vertical with icon/image top, title, description, course count
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Padding: p-6
- Hover: Subtle lift/shadow effect, border highlight
- Meta info: Course count badge, student count

**Course Card:**
- Compact horizontal layout on desktop
- Course code (mono font) | Course title | Semester badge | File count
- List view with alternating subtle backgrounds
- Click area: entire card
- Quick actions: View files, Add to favorites (icon buttons)
- Padding: p-4 with gap-4

**File Card:**
- Layout: Icon left, metadata center, actions right
- File type icon (PDF, DOCX, IMG) - use Heroicons document icons
- Title: text-base font-semibold, truncate if long
- Metadata row: Uploader, Upload date, Downloads, Verified badge
- Actions: Download button, Rating stars, Report flag
- Padding: p-4 with border-b separator

### Forms & Inputs

**Search Bar:**
- Rounded: rounded-full
- Large size: h-12 with px-6
- Icon: Heroicons magnifying glass, left side
- Placeholder: "Search courses, files, or departments..."
- Autocomplete dropdown with categorized results

**Upload Form:**
- Modal overlay or dedicated page
- Steps: 1) Select department/course, 2) Upload file, 3) Add metadata
- Drag-and-drop zone: border-2 border-dashed, min-h-64
- File preview after selection
- Required fields: Title, Course, File type
- Progress bar during upload
- Padding: p-8

**Input Fields:**
- Height: h-12
- Border: border rounded-lg
- Focus: ring-2 with offset
- Labels: text-sm font-medium, mb-2
- Helper text: text-xs, mt-1

### Data Display

**Course Detail Page:**
- Hero section: Course code, title, description, semester badge
- Tab navigation: Files | About | Contributors
- File list: Table/list view with sort/filter options
- Stats bar: Total files, Total downloads, Contributors
- Upload CTA: Prominent, top right

**User Profile:**
- Header: Avatar, Name, Department badge, Level badge, Reputation score
- Tabs: My Uploads | Downloads | Activity
- Stats grid: 3-4 columns showing metrics
- Upload history: Card list with pagination

**Admin Dashboard:**
- Grid layout: 2x2 or 3 columns for stat widgets
- Pending approvals table: File preview, uploader, course, approve/reject actions
- Recent activity feed
- User management table with search/filter

### Overlays & Modals

**Modal:**
- Max width: max-w-2xl
- Backdrop: Semi-transparent overlay
- Close button: top-right, Heroicons x-mark
- Padding: p-6 md:p-8
- Actions: Footer with Cancel/Confirm buttons

**Toast Notifications:**
- Position: top-right, fixed
- Width: w-96
- Types: Success (upload complete), Error (file too large), Info (admin reviewing)
- Auto-dismiss after 5 seconds
- Icon + message + close button

### Buttons & CTAs

**Primary Button (Upload, Download):**
- Height: h-12, px-6
- Rounded: rounded-lg
- Font: text-base font-semibold
- Icon support: with gap-2
- States: Hover (lift), Active (scale-95), Disabled (opacity-50)

**Secondary Button:**
- Same size as primary
- Border variant
- Less visual weight

**Icon Buttons:**
- Size: w-10 h-10
- Rounded: rounded-lg
- Use for actions like favorite, share, download

**Button on Images (Hero):**
- Background: backdrop-blur-md with semi-transparent background
- No hover/active animation (rely on button's own states)

### Badges & Tags

**Level Badge:**
- Size: px-3 py-1, text-xs font-semibold
- Rounded: rounded-full
- Format: "200 Level" or "100-Level"

**Semester Badge:**
- Similar to level badge
- Format: "First Semester" | "Second Semester"

**Verified Badge:**
- Checkmark icon with "Verified" text
- Small: px-2 py-1, text-xs
- Indicates admin approval

**File Type Badge:**
- Icon only or icon + extension
- Format: PDF, DOCX, PNG
- Size: w-8 h-8 icon in file lists

---

## Page Layouts

### Home Page
- **Hero Section:** h-[70vh] with centered search, headline "Access IUO's Complete Course Archive", subheading, CTA
- **Department Grid:** 4 columns desktop, department cards with hover effects
- **Stats Bar:** Total departments, courses, files, active students (4-column grid)
- **Recent Uploads:** Horizontal scroll or grid of latest files
- **How It Works:** 3-step visual guide (Browse → Download → Upload)

### Department Page
- **Department Header:** Title, description, total courses, breadcrumbs
- **Level Selector:** Horizontal tabs or segmented control (100, 200, 300, 400, 500, 600)
- **Course List:** Filterable table/card grid sorted by course code
- **Sidebar:** Quick stats, top contributors, related departments

### Course Detail Page
- **Course Header:** Code (large, mono), Title, Description, Semester badge
- **File List:** Main content area, sortable table (Name, Type, Uploader, Date, Downloads)
- **Upload CTA:** Sticky or prominent button
- **Course Info Sidebar:** Instructor (if available), prerequisites, related courses

### Upload Page
- **Form Layout:** Single column, max-w-2xl centered
- **Steps Indicator:** Visual progress (1/3, 2/3, 3/3)
- **File Drop Zone:** Large, central focus
- **Metadata Form:** Below drop zone, reveals after file selected

### Profile Page
- **Profile Header:** Avatar left, info right (name, department, level, reputation)
- **Tab Navigation:** Below header
- **Content Area:** Based on active tab (uploads, downloads, activity)
- **Sidebar:** Achievement badges, contribution graph

---

## Images

**Hero Image (Home Page):**
- Full-width background image showing students studying, library, or campus scene
- Overlay: gradient for text readability
- Position: background, covered
- Description: "Diverse group of students collaborating with laptops and books in a modern university library setting"

**Department Icons/Illustrations:**
- Each department card includes a representative icon or small illustration
- Style: Line art or minimal style, consistent across all departments
- Size: 48x48px or 64x64px
- Position: Top of department card

**Empty States:**
- No files found: Illustration of empty folder
- No courses: Illustration of open book with question mark
- No uploads yet: Illustration of upload cloud icon
- Size: 200x200px, centered

**File Type Icons:**
- Use Heroicons: document, document-text, photo for different file types
- Consistent sizing: w-6 h-6 in lists, w-12 h-12 in previews

---

## Iconography

**Icon Library:** Heroicons (via CDN)

**Common Icons:**
- Navigation: home, academic-cap, folder, document-text, user-circle
- Actions: arrow-up-tray (upload), arrow-down-tray (download), magnifying-glass (search), heart (favorite)
- Status: check-circle (verified), exclamation-triangle (pending), x-circle (rejected)
- UI: x-mark (close), chevron-right (next), bars-3 (menu)

**Icon Sizing:**
- In buttons: w-5 h-5
- In cards: w-6 h-6
- In navigation: w-6 h-6
- Large icons (empty states): w-16 h-16

---

## Animations

**Use Sparingly:**
- Card hover: Subtle lift (translate-y-1) + shadow increase
- Button hover: Minimal scale or brightness change
- Modal entry: Fade in backdrop + scale-95 to scale-100 for content
- Page transitions: Simple fade (no elaborate animations)
- File upload: Progress bar smooth animation only

**Avoid:**
- Scroll animations
- Parallax effects
- Elaborate entrance/exit animations
- Distracting decorative animations

---

## Accessibility

- Semantic HTML: Use proper heading hierarchy (h1, h2, h3)
- Form labels: Always associate labels with inputs
- Focus indicators: Visible focus rings on all interactive elements
- Alt text: Descriptive alt text for all images
- ARIA labels: For icon-only buttons
- Keyboard navigation: Tab order follows visual layout
- Color contrast: Text meets WCAG AA standards minimum
- Touch targets: Minimum 44x44px for mobile