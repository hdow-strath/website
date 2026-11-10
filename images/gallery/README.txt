How to add photos to the Gallery
================================

1. Save the photo in this folder, e.g.  images/gallery/conference-2026.jpg
   (Use lowercase and hyphens, no spaces. Keep files under ~500 KB, ~1600 px wide.)

2. Add it to data/gallery.json. Photos appear in the order listed.
   Remember the comma between entries:

   [
     {
       "src": "images/gallery/conference-2026.jpg",
       "caption": "The group at the conference in Glasgow",
       "date": "June 2026"
     },
     {
       "src": "images/gallery/lab-day.jpg",
       "caption": "Lab open day",
       "date": "2026"
     }
   ]

   "caption" and "date" are optional. The caption shows when hovering over a photo,
   and both show when the photo is opened full size.
