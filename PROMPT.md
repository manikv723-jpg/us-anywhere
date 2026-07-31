# The prompt

Use **[Google AI Studio](https://aistudio.google.com)**. It's free, and it's the
only builder that does all three things this needs: generate the photos, build
the app, and give you a shareable link.

---

## Step 1 — open the project

Go to [aistudio.google.com](https://aistudio.google.com) → **Build** → **Import
from GitHub**, and paste:

```
https://github.com/manikv723-jpg/us-anywhere
```

This part is a button, not something you can ask for in the prompt.

## Step 2 — attach your photo

One photo of the two of you. Faces visible, both in frame.

## Step 3 — paste this

Change the two names. Nothing else.

```
I've attached one photo of me and my partner.

The app in this project already works — do not rewrite or redesign it.
You only need to add our photos.

1. Save my attached photo as public/us.jpg

2. Generate 12 photos of this exact couple — same two faces, same two
   people — one at each of these places, and save each one at the
   exact filename listed:

   public/generated/0.png   Paris, in front of the Eiffel Tower
   public/generated/1.png   Santorini, white cliffs at sunset
   public/generated/2.png   Kyoto, under cherry blossom
   public/generated/3.png   Venice, on a canal bridge
   public/generated/4.png   Amalfi Coast, cliffside
   public/generated/5.png   Swiss Alps, in snow
   public/generated/6.png   Maldives, overwater villa
   public/generated/7.png   Prague, old town square at night
   public/generated/8.png   Goa, on the beach at sunset
   public/generated/9.png   Manali, in snowfall
   public/generated/10.png  Udaipur, at the lake palace
   public/generated/11.png  Seoul, neon street in the rain

   For each: a bright, vivid, photorealistic travel photo of this
   couple in front of that place. Keep their faces, body types and
   skin tones exactly as in my photo. Change only their outfits to
   suit the weather and culture. Portrait 3:4.

3. In public/config.json set our names to "NAME ONE" and "NAME TWO".

4. Build and deploy it, and give me the public link.
```

## Step 4 — send the link

That's the whole thing.

---

## If something goes wrong

**It starts redesigning the app.** Say: *"Stop. The globe, cover screen and
share button already exist and work. Only add the photos and deploy."*

**Photos on the wrong cards** — Paris showing where Kyoto should be. The
filenames didn't match. Say: *"Rename the files so 2.png is Kyoto, 8.png is
Goa,"* and so on down the list.

**The faces don't look like us.** Regenerate that one: *"Redo 4.png — keep the
exact faces from my original photo."* Face consistency is the hardest part of
this for any image model, so expect to redo two or three.

**It only made some of them.** Ask for the missing numbers specifically.

---

## Different places?

Edit `src/story.ts` before you build. Twelve entries, each with a location, a
city name, and the caption shown when the card is tapped:

```ts
{ location: 'the Eiffel Tower in Paris at golden hour',
  city: 'Paris',
  caption: 'Where we said we would go first.' },
```

Use places that actually mean something to the two of you, and write your own
captions — real ones beat anything generic. Keep it at 12 and keep the order,
because the filenames match the positions.

---

## Doing it by hand instead

No builder needed. Generate the 12 photos anywhere — the Gemini app, ChatGPT,
whatever — using this once per place:

> A bright, vivid, photorealistic travel photo of this couple taken directly in
> front of {place}. Preserve the exact same two people — their exact faces, body
> structures, skin tones and poses. Change only their outfits to suit the
> location's weather and culture, and place them seamlessly in this
> environment. Extremely detailed background, stunning quality. Portrait 3:4.

Name them `0.png` to `11.png` in the order listed above, drop them into
`public/generated/`, put your photo at `public/us.jpg`, then:

```bash
npm install
npm run build
```

Drag the `dist/` folder onto [netlify.com/drop](https://app.netlify.com/drop)
for a free link, no account needed.
