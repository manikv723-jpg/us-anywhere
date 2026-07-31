# The prompt

Go to any AI app builder — [Google AI Studio](https://aistudio.google.com),
Lovable, Replit, Emergent, Bolt.

**Attach one photo** of you and your partner. Faces visible, both in frame.

**Paste this.** Change the two names. Nothing else.

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

Send the link to your person. That's the whole thing.

---

## If the builder gets confused

Some builders wander off and start rewriting the app. If that happens, add this
line to the end:

```
Do not redesign anything. The globe, the cover screen and the share
button already exist and work. Your only jobs are: add my photo,
generate the 12 photos into public/generated/, set our names, build,
deploy.
```

If the photos land in the wrong order — Paris showing on the Kyoto card — the
filenames didn't match the numbers. Ask it to rename them so
`public/generated/2.png` is Kyoto, and so on down the list.

---

## Want different places?

Edit `src/story.ts` before you build. Twelve entries, each with a location, a
city name, and the caption shown when the card is tapped:

```ts
{ location: 'the Eiffel Tower in Paris at golden hour',
  city: 'Paris',
  caption: 'Where we said we would go first.' },
```

Use places that actually mean something to the two of you, and write your own
captions — real ones beat anything generic. Keep it at 12 and keep the order,
because the photo filenames match the positions.

---

## The image prompt, if you want to make the photos yourself

Run this once per city in any image tool, then drop the results into
`public/generated/` yourself:

> A bright, vivid, photorealistic travel photo of this couple taken directly in
> front of {place}. Preserve the exact same two people — their exact faces, body
> structures, skin tones and poses. Change only their outfits to suit the
> location's weather and culture, and place them seamlessly in this
> environment. Extremely detailed background, stunning quality. Portrait 3:4.
