# us, anywhere

**Upload one photo of you and your partner. Get a link to send them.**

They open it and see your photo, full screen, with one line over it:

> swipe to see our world together

They swipe — and a globe spins up, made of the two of you in Paris, Kyoto,
Venice, Goa, Manali, Udaipur and seven other places.

No API key. No sign-up. No setup.

---

## How to make yours

Go to any AI app builder — **[Google AI Studio](https://aistudio.google.com)**,
Lovable, Replit, Emergent, Bolt — and do two things:

1. **Attach one photo** of the two of you. Faces visible, both in frame.
2. **Paste this:**

```
Use the project at https://github.com/manikv723-jpg/us-anywhere

I've attached one photo of me and my partner.

Please:
1. Clone/download that repo — the app is already built, don't rewrite it.
2. Save my attached photo as public/us.jpg
3. Using your own image generation, create 12 photos of this exact
   couple — same two faces, same people — at these 12 places:
      0 Paris   1 Santorini  2 Kyoto     3 Venice
      4 Amalfi  5 Swiss Alps 6 Maldives  7 Prague
      8 Goa     9 Manali    10 Udaipur  11 Seoul
   Keep their faces identical. Only change outfits and background
   to suit each place. Portrait 3:4.
4. Save them as public/generated/0.png through public/generated/11.png
   using the numbers above.
5. In public/config.json put our names: "NAME ONE" and "NAME TWO".
6. Run npm install && npm run build, deploy the dist/ folder as a
   static site, and give me the public link.
```

That's it. Replace the two names, attach your photo, send the link.

---

## Why it works this way

The 12 photos get saved into the project as **real image files**. By the time
anyone opens your link, nothing is being generated — the app is only HTML,
JavaScript and images.

So the link:

- costs nothing to keep alive
- needs no API key
- can't rate-limit or expire
- works for anyone you send it to, forever

---

## Run it on your own machine

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # creates dist/
```

Drag `dist/` onto [netlify.com/drop](https://app.netlify.com/drop) for an
instant free link, no account needed.

Without photos in `public/generated/` it runs in **demo mode** with stock
travel pictures, so you can see the whole thing working before you make yours.

---

## Making it personal

Everything you'd want to change is in two small files.

**`public/config.json`** — the names and the line on the cover:

```json
{
  "names": { "a": "Your name", "b": "Their name" },
  "message": "swipe to see our world together"
}
```

**`src/story.ts`** — the 12 places and their captions:

```ts
{ location: 'the Eiffel Tower in Paris at golden hour',
  city: 'Paris',
  caption: 'Where we said we would go first.' },
```

Swap in places that actually mean something to the two of you and write your
own captions. Real ones beat anything generic. Keep the list at 12 and keep the
order — the photo filenames match the positions.

---

## The share button

Inside the globe there's a **send this to your person** button. It records ten
seconds of the globe spinning, builds a 12-photo collage, and opens your phone's
share sheet so it goes straight to WhatsApp or Instagram.

Note: iOS Safari's video recording support varies by version. If the video
doesn't come through, it downloads both files instead so you can send them
manually.

---

## Built with

React · three.js · react-three-fiber · Tailwind · Vite

MIT licensed — fork it, change it, make it yours.
