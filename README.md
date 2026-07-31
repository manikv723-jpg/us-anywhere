# us, anywhere

**Upload one photo of you and your partner. Get a link to send them.**

They open it and see your photo, full screen, with one line over it:

> swipe to see our world together

They swipe — and a globe spins up, made of the two of you in Paris, Kyoto,
Venice, Goa, Manali, Udaipur and seven other places.

No API key. No sign-up. No setup.

---

## How to make yours

### 👉 [**Open the prompt →**](PROMPT.md)

Use **[Google AI Studio](https://aistudio.google.com)** — it's free, and it's
the only builder that does all three things this needs: generates the photos,
builds the app, and gives you a shareable link.

1. AI Studio → **Build** → **Import from GitHub** → paste this repo's URL
2. **Attach one photo** of the two of you
3. **Paste [the prompt](PROMPT.md)**, with your two names in it
4. It deploys and hands you a link. Send it.

No API key. No terminal. No sign-up beyond a Google account.

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
