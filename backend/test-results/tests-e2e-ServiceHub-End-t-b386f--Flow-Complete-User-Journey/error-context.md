# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e.spec.js >> ServiceHub End-to-End User Flow >> Complete User Journey
- Location: tests\e2e.spec.js:13:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Search"), button[aria-label="Search"]')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - link "ServiceHub Logo" [ref=e5] [cursor=pointer]:
        - /url: /
        - img "ServiceHub Logo" [ref=e6]
      - navigation [ref=e7]:
        - link "Home" [ref=e8] [cursor=pointer]:
          - /url: /
        - link "Services" [ref=e9] [cursor=pointer]:
          - /url: /services
        - link "About" [ref=e10] [cursor=pointer]:
          - /url: /about
      - generic [ref=e12]:
        - link "Messages" [ref=e13] [cursor=pointer]:
          - /url: /chat
          - button "Messages" [ref=e14]:
            - img [ref=e15]
        - button "Notifications" [ref=e18] [cursor=pointer]:
          - img [ref=e19]
          - generic [ref=e22]: "6"
        - generic [ref=e24] [cursor=pointer]:
          - img [ref=e26]
          - img [ref=e29]
    - main [ref=e31]:
      - generic [ref=e32]:
        - link "Home" [ref=e33] [cursor=pointer]:
          - /url: /
        - generic [ref=e34]: /
        - link "Services" [ref=e35] [cursor=pointer]:
          - /url: /services
        - generic [ref=e36]: /
        - link "mohris" [ref=e37] [cursor=pointer]:
          - /url: /services
      - generic [ref=e38]:
        - generic [ref=e39]:
          - heading "smayka" [level=1] [ref=e40]
          - generic [ref=e41]:
            - generic [ref=e42]:
              - generic [ref=e43]: RA
              - generic [ref=e44] [cursor=pointer]: rayder akrabou
              - generic [ref=e45]: Verified Expert
            - generic [ref=e47]:
              - generic [ref=e48]:
                - img [ref=e49]
                - img [ref=e51]
                - img [ref=e53]
                - img [ref=e55]
                - img [ref=e57]
              - generic [ref=e59]: "0.0"
              - generic [ref=e60] [cursor=pointer]: (1k+ reviews)
          - img "smayka" [ref=e62]
          - generic [ref=e63]:
            - heading "About this service" [level=2] [ref=e64]
            - generic [ref=e65]:
              - paragraph [ref=e66]: mkdwich
              - paragraph [ref=e67]: We pride ourselves on providing top-tier service tailored perfectly to your requirements. Our certified professionals ensure that everything is executed seamlessly from start to finish.
          - generic [ref=e68]:
            - heading "Reviews" [level=2] [ref=e69]
            - generic [ref=e70]:
              - heading "Leave a review" [level=3] [ref=e71]
              - generic [ref=e72]:
                - img [ref=e73] [cursor=pointer]
                - img [ref=e75] [cursor=pointer]
                - img [ref=e77] [cursor=pointer]
                - img [ref=e79] [cursor=pointer]
                - img [ref=e81] [cursor=pointer]
              - textbox "Tell others about your experience..." [ref=e83]
              - button "Save Review" [ref=e85] [cursor=pointer]
            - generic [ref=e87]:
              - generic [ref=e88]: RA
              - generic [ref=e89]:
                - generic [ref=e90]:
                  - generic [ref=e91]: ryder akrabou
                  - generic [ref=e92]: Jun 29, 2026
                - generic [ref=e93]:
                  - img [ref=e94]
                  - img [ref=e96]
                  - img [ref=e98]
                  - img [ref=e100]
                  - img [ref=e102]
                - paragraph [ref=e104]: hdhhhhked
              - button [ref=e106] [cursor=pointer]:
                - img [ref=e107]
        - generic [ref=e111]:
          - generic [ref=e112]:
            - button "Save" [ref=e113] [cursor=pointer]:
              - img [ref=e114]
              - text: Save
            - button "Share" [ref=e116] [cursor=pointer]:
              - img [ref=e117]
              - text: Share
          - generic [ref=e123]:
            - generic [ref=e124]:
              - heading "Service Booking" [level=3] [ref=e125]
              - generic [ref=e126]: 30 MAD
            - generic [ref=e127]:
              - heading "Standard Package" [level=4] [ref=e128]
              - paragraph [ref=e129]: mkdwich
              - generic [ref=e131]:
                - img [ref=e132]
                - generic [ref=e135]: Flexible Schedule
              - list [ref=e136]:
                - listitem [ref=e137]:
                  - img [ref=e138]
                  - text: Service Guarantee
                - listitem [ref=e140]:
                  - img [ref=e141]
                  - text: Background Checked Pro
                - listitem [ref=e143]:
                  - img [ref=e144]
                  - text: Secure Online Payment
              - button "Continue" [ref=e146] [cursor=pointer]:
                - text: Continue
                - img [ref=e147]
              - paragraph [ref=e149]: You won't be charged yet
          - generic [ref=e150]:
            - heading "Related Services" [level=4] [ref=e151]
            - list [ref=e152]:
              - listitem [ref=e153] [cursor=pointer]:
                - generic [ref=e154]: Roof Repair Pros
                - img [ref=e155]
              - listitem [ref=e157] [cursor=pointer]:
                - generic [ref=e158]: smayka
                - img [ref=e159]
              - listitem [ref=e161] [cursor=pointer]:
                - generic [ref=e162]: Premier Roof Maintenance
                - img [ref=e163]
              - listitem [ref=e165] [cursor=pointer]:
                - generic [ref=e166]: Sky Shield Roofing
                - img [ref=e167]
              - listitem [ref=e169] [cursor=pointer]:
                - generic [ref=e170]: Elevate Roof Solutions
                - img [ref=e171]
          - generic [ref=e174]:
            - generic [ref=e175] [cursor=pointer]:
              - img [ref=e177]
              - generic [ref=e180]:
                - generic [ref=e181]: Download Brochure
                - generic [ref=e182]: Get all details in a PDF
            - generic [ref=e183] [cursor=pointer]:
              - img [ref=e185]
              - generic [ref=e189]:
                - generic [ref=e190]: View Provider Profile
                - generic [ref=e191]: See everything they offer
    - contentinfo [ref=e192]:
      - generic [ref=e193]:
        - generic [ref=e194]:
          - link "About" [ref=e195] [cursor=pointer]:
            - /url: "#"
          - link "Services" [ref=e196] [cursor=pointer]:
            - /url: "#"
          - link "Home" [ref=e197] [cursor=pointer]:
            - /url: "#"
          - link "404" [ref=e198] [cursor=pointer]:
            - /url: "#"
        - generic [ref=e199]:
          - paragraph [ref=e200]:
            - text: Subscribe to our newsletter
            - text: to get seasonal cleaning tips,
            - text: exclusive offers & more
          - generic [ref=e201]:
            - textbox "your email address" [ref=e202]
            - button "»" [ref=e203] [cursor=pointer]
          - paragraph [ref=e204]: Made by SERVICE HUB
        - generic [ref=e205]:
          - paragraph [ref=e206]: Follow us
          - paragraph [ref=e207]: servicehub@gmail.com
          - paragraph [ref=e208]: +91 98765 43210
          - generic [ref=e209]:
            - link [ref=e210] [cursor=pointer]:
              - /url: "#"
              - img [ref=e211]
            - link [ref=e213] [cursor=pointer]:
              - /url: "#"
              - img [ref=e214]
            - link [ref=e216] [cursor=pointer]:
              - /url: "#"
              - img [ref=e217]
      - heading "SERVICE HUB" [level=2] [ref=e221]
  - region "Notifications Alt+T"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('ServiceHub End-to-End User Flow', () => {
  4   |   // Use the verified credentials provided for login
  5   |   const testUser = {
  6   |     email: 'zakaria.akrabou@gmail.com',
  7   |     password: 'Admin123@',
  8   |   };
  9   | 
  10  |   // Base URL of the frontend
  11  |   const FRONTEND_URL = 'http://localhost:5173';
  12  | 
  13  |   test('Complete User Journey', async ({ page }) => {
  14  |     // Note: The selectors used here are common generic selectors (like placeholder text, 
  15  |     // or button text). You may need to update them to match your frontend's actual DOM.
  16  | 
  17  |     // 1. Register (Skipped: Registration requires email verification. Using a pre-verified account.)
  18  |     
  19  |     // 2. Login
  20  |     await test.step('Login', async () => {
  21  |       // Go to login if not already there
  22  |       if (!page.url().includes('login')) {
  23  |         await page.goto(`${FRONTEND_URL}/login`);
  24  |       }
  25  |       await page.fill('input[name="email"], input[type="email"]', testUser.email);
  26  |       await page.fill('input[name="password"], input[type="password"]', testUser.password);
  27  |       await page.click('button[type="submit"], button:has-text("Login")');
  28  |       
  29  |       // Expect to be logged in and redirected to home/dashboard
  30  |       await page.waitForURL(FRONTEND_URL + '/');
  31  |     });
  32  | 
  33  |     // 3. Search services
  34  |     await test.step('Search services', async () => {
  35  |       await page.fill('input[placeholder*="Search"]', 'Cleaning'); // Adjust search term as needed
> 36  |       await page.click('button:has-text("Search"), button[aria-label="Search"]');
      |                  ^ Error: page.click: Test timeout of 30000ms exceeded.
  37  |       
  38  |       // Wait for search results to load
  39  |       await expect(page.locator('.service-card, [data-testid="service-card"]').first()).toBeVisible({ timeout: 10000 });
  40  |     });
  41  | 
  42  |     // 4. View service details
  43  |     await test.step('View service details', async () => {
  44  |       const firstService = page.locator('.service-card, [data-testid="service-card"]').first();
  45  |       await firstService.click();
  46  |       
  47  |       // Expect to be on the service details page
  48  |       await expect(page).toHaveURL(/.*\/services\/.+/);
  49  |       await expect(page.locator('text=Book')).toBeVisible();
  50  |     });
  51  | 
  52  |     // 5. Book a service
  53  |     await test.step('Book a service', async () => {
  54  |       await page.click('button:has-text("Book")');
  55  |       
  56  |       // Wait for booking confirmation (e.g. a toast, modal, or redirect)
  57  |       const successMessage = page.locator('text=Booking confirmed, text=Successfully booked, text=Success').first();
  58  |       await expect(successMessage).toBeVisible({ timeout: 10000 });
  59  |     });
  60  | 
  61  |     // 6. Open the chat
  62  |     await test.step('Open the chat', async () => {
  63  |       // Assuming there's a chat button on the navigation or service page
  64  |       await page.click('a[href*="/chat"], button:has-text("Chat")');
  65  |       await expect(page).toHaveURL(/.*\/chat/);
  66  |     });
  67  | 
  68  |     // 7. Send a message
  69  |     await test.step('Send a message', async () => {
  70  |       await page.fill('input[placeholder*="message"], textarea', 'Hello, I just booked your service!');
  71  |       await page.click('button:has-text("Send"), button[aria-label="Send"]');
  72  |       
  73  |       // Verify message appears in chat
  74  |       await expect(page.locator('text=Hello, I just booked your service!')).toBeVisible();
  75  |     });
  76  | 
  77  |     // 8. Leave a review
  78  |     await test.step('Leave a review', async () => {
  79  |       // Navigate to bookings page or review section
  80  |       await page.goto(`${FRONTEND_URL}/bookings`); // Adjust path to where reviews are left
  81  |       await page.click('button:has-text("Leave Review"), button:has-text("Review")');
  82  |       
  83  |       await page.fill('textarea[name="review"], textarea[placeholder*="review"]', 'Great service, highly recommended!');
  84  |       
  85  |       // Select rating (assuming 5 stars)
  86  |       const starRating = page.locator('.star-rating-5, input[value="5"], button[aria-label="5 stars"]');
  87  |       if (await starRating.isVisible()) {
  88  |         await starRating.click();
  89  |       }
  90  |       
  91  |       await page.click('button:has-text("Submit"), button:has-text("Post")');
  92  |       await expect(page.locator('text=Review submitted, text=Success')).toBeVisible();
  93  |     });
  94  | 
  95  |     // 9. Logout
  96  |     await test.step('Logout', async () => {
  97  |       // Sometimes logout is behind a user menu dropdown
  98  |       const userMenu = page.locator('button[aria-label="User menu"], .user-menu');
  99  |       if (await userMenu.isVisible()) {
  100 |         await userMenu.click();
  101 |       }
  102 |       
  103 |       await page.click('button:has-text("Logout"), a:has-text("Logout")');
  104 |       
  105 |       // Expect to be redirected to login or home as a guest
  106 |       await page.waitForURL(/.*(login|\/)$/);
  107 |     });
  108 |   });
  109 | });
  110 | 
```