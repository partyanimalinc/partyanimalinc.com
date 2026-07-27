# Party Animal — Site Map & Information Architecture

Working IA + build checklist for the new **partyanimalinc.com** corporate site.
Status legend: **LIVE** = built & on the local site · **PLANNED** = next non-catalog build · **CATALOG** = PIM-driven (later phase).

---

## Page tree

### Home
| Page | URL | Status | Notes |
|---|---|---|---|
| Home | `/` | LIVE | Hero, licenses marquee, Choose Your Lineup, For the Real Ones |

### Products & Collections
| Page | URL | Status | Notes |
|---|---|---|---|
| Products index | `/products` | LIVE | Grid of collection banners |
| TeenyMates | `/teenymates` | LIVE | Collection landing (designed hero) |
| SqueezyMates | `/squeezymates` | LIVE | Collection landing |
| Jumbo Squeezy | `/jumbo-squeezy` | LIVE | Collection landing |
| Team Gear | `/team-gear` | LIVE | Collection landing |
| Big Sip | `/big-sip` | PLANNED | Sub-brand landing (from curated brand map) |
| Speed Cube | `/speed-cube` | PLANNED | Sub-brand landing |
| Big Shot Ballers | `/big-shot-ballers` | PLANNED | Sub-brand landing |
| MotiGlow | `/motiglow` | PLANNED | Sub-brand landing |
| Electric Football | `/electric-football` | PLANNED | Sub-brand landing |
| Lil Teammates | `/lil-teammates` | PLANNED | Sub-brand landing |
| _(+ remaining sub-brands)_ | `/[line]` | PLANNED | Per the curated brand map |
| Category template | `/products/[category]` | CATALOG | Cross-line categories (Drinkware, Flags & Banners…) |
| Product detail | `/[line]/[product]` | CATALOG | Nested under line; "Available at" retailer links |
| Team pages (~170) | `/licenses/[team]` | CATALOG | NFL/MLB/NBA/NHL/MLS/College |

### Company
| Page | URL | Status | Notes |
|---|---|---|---|
| About Us | `/about` | LIVE | |
| Our Philosophy / Story | `/philosophy` | PLANNED | Brand values + heritage |
| Careers | `/careers` | LIVE | Static openings (code-managed) |
| Press & Media Kit | `/press` | PLANNED | Press releases + downloadable logos/shots |
| Licenses & Partners | `/licenses` | LIVE | Leagues + partners overview |

### Buy & Wholesale
| Page | URL | Status | Notes |
|---|---|---|---|
| Where to Buy | `/where-to-buy` | LIVE | Retailer directory (expands in catalog phase) |
| Wholesale / Become a Retailer | `/wholesale` | PLANNED | B2B lead page (ties to Faire) |
| Enter to Win | `partyanimaltoys.com` ↗ | EXTERNAL | Contest lives on the toys store |

### Support
| Page | URL | Status | Notes |
|---|---|---|---|
| FAQs | `/faq` | LIVE | |
| Contact Us | `/contact` | LIVE | Form emails a PA inbox |
| Returns & Warranty | `/returns` | PLANNED | Was in old footer |
| Product Safety & Compliance | `/product-safety` | PLANNED | CPSIA, age grading, choking-hazard |

### Legal
| Page | URL | Status | Notes |
|---|---|---|---|
| Privacy Policy | `/privacy-policy` | LIVE | |
| Terms of Use | `/terms` | LIVE | |
| Cookie Policy | `/cookie-policy` | PLANNED | |
| Do Not Sell/Share My Info | `/do-not-sell` | PLANNED | CCPA/CPRA |
| Accessibility Statement | `/accessibility` | PLANNED | |

### Technical / SEO
| Item | URL | Status | Notes |
|---|---|---|---|
| Custom 404 | `/404` | PLANNED | Branded not-found |
| Robots | `/robots.txt` | PLANNED | |
| XML Sitemap | `/sitemap.xml` | PLANNED | Generated dynamically |

---

## 301 Redirect map (old NetSuite → new)

| Old URL | New URL | Notes |
|---|---|---|
| `/about-us` | `/about` | |
| `/contact-us` | `/contact` | |
| `/faq.html` | `/faq` | |
| `/terms` | `/terms` | unchanged |
| `/privacy-policy` | `/privacy-policy` | unchanged |
| `/Become-A-Reseller` | `/wholesale` | |
| `/Reseller-Specials` | `/wholesale` | |
| `/Shop/` | `/products` | store retired |
| `/Products/` | `/products` | |
| `/Products/TeenyMates/` | `/teenymates` | |
| `/Products/SqueezyMates/` | `/squeezymates` | |
| `/Products/Jumbo-Squeezys/` | `/jumbo-squeezy` | |
| `/Products/Big-Sip-Water-Bottles/` | `/big-sip` | sub-brand |
| `/Products/Speed-Cubes/` | `/speed-cube` | sub-brand |
| `/Products/Big-Shot-Ballers/` | `/big-shot-ballers` | sub-brand |
| `/Products/Drinkware/` | `/products/drinkware` | generic category |
| `/Products/Flags-Banners/` | `/products/flags-banners` | generic category |
| `/Products/{Category}/{Product}.html` | `/{line}/{product}` | **CATALOG** — generated from PIM `item_url` |
| `/Licenses/` | `/licenses` | |
| `/Licenses/{Team}/` | `/licenses/{team}` | lowercased |
| `/Licenses/MLBPA/` | `/licenses` | |

**Method:** corporate + collection redirects are hand-mapped (above). Product-level and team-level redirects are generated programmatically from the PIM (`products.item_url`) + Google Search Console export during the catalog phase, so no ranked URL is dropped.

---

## Global navigation

- **Top nav:** Our Products (dropdown) · About Us · Licenses & Partners · Careers · Contact Us · **Enter to Win**
- **Footer — Our Products:** the sub-brands
- **Footer — Company:** About · Our Philosophy · Careers · Press · Licenses & Partners · Contact
- **Footer — Support:** Where to Buy · Wholesale · FAQs · Returns · Product Safety
- **Footer — Legal (sub-row):** Privacy · Terms · Cookie Policy · Do Not Sell · Accessibility
