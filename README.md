# Stackshop - Fixed It Up

I kept it simple. Fixed the main bugs without changing the look too much.

### What I did:
- **Cart actually works now**: When you hit add to cart, the number in the header goes up. I used localStorage to keep track of it.
- **Fixed the filters**: The category and subcategory selects were a bit broken, they work right now.
- **Fixed the "View details" link**: It was passing the whole product data in the URL before which is bad. Now it just passes the SKU and fetches it on the next page.
- **Search works**: You can type in the box and it filters the list immediately.
- **Added a toast**: Just a small notification when you add something so you know it worked.

### Files I messed with:
- `app/page.tsx`: Added the Header with the cart count and fixed the product links.
- `app/product/page.tsx`: Simplified it to just get the product from the API.
- `app/api/products/route.ts`: Added some dynamic stuff so it doesn't cache.
- `app/api/subcategories/route.ts`: Fixed the filtering logic.

### How to run:
- `npm install`
- `npm run dev`

That's it.
