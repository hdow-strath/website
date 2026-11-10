How to add a blog post
======================

1. Write the post as a Markdown file in this folder, e.g.  content/blog/my-new-paper.md
   (The filename, minus .md, is the post's "slug". Use lowercase and hyphens, no spaces.)

2. Add an entry to data/blog.json (remember the comma between entries):

   {
     "slug": "my-new-paper",
     "title": "Our new paper on ...",
     "date": "2026-12-01",
     "author": "Hamish Dow",
     "summary": "One or two sentences shown on the Blog page.",
     "image": "images/blog/my-new-paper.jpg"
   }

   - "date" must be YYYY-MM-DD. Posts are listed newest first.
   - "image" is optional. If set, it's used as the thumbnail on the Blog page
     and as the banner at the top of the post. Leave it as "" for none.

3. To put images inside a post, save them in images/blog/ and write:

   ![Description of the photo](images/blog/photo.jpg)

Markdown quick reference
- **bold**   *italic*   [link text](https://example.com)
- "## Heading" for a section heading
- "- item" for bullet lists
- A blank line starts a new paragraph
