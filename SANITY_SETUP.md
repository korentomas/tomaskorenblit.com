# Sanity CMS Setup Guide

Your portfolio now supports **both** Git-based MDX posts AND Sanity CMS posts!

## 🚀 Quick Setup (5 minutes)

### 1. Create Sanity Project

```bash
# Login to Sanity (creates account if needed)
npx sanity login

# Initialize project (use existing config)
npx sanity init --project-id YOUR_PROJECT_ID --dataset production
```

Or create at: https://sanity.io/manage

### 2. Get Your Project ID

1. Go to https://sanity.io/manage
2. Create a new project (or use existing)
3. Copy your Project ID
4. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Add your credentials:
   ```
   SANITY_PROJECT_ID=abc12345
   SANITY_DATASET=production
   ```

### 3. Deploy Studio

```bash
# Deploy your studio to sanity.studio
npx sanity deploy
```

Or run locally:
```bash
npm run dev
# Visit: http://localhost:5173/studio
```

### 4. Create Your First Post

1. Go to `/studio` (or your deployed studio)
2. Click "Blog Post"
3. Fill in the fields
4. Set status to "Published"
5. Click "Publish"
6. Your post appears on `/blog`!

---

## 📝 How It Works

### Dual Content Sources

Your blog now pulls from **two sources**:

1. **MDX Files** (Git-based)
   - Location: `content/blog/*.mdx`
   - Good for: Technical posts, code-heavy content
   - Edit in: Your code editor

2. **Sanity CMS** (Database)
   - Location: Sanity Cloud
   - Good for: Quick posts, mobile writing, images
   - Edit in: Visual editor at `/studio`

Both sources merge seamlessly in your blog listing!

---

## 🎨 Sanity Studio Features

### Rich Text Editor
- Visual editing (no Markdown needed)
- Drag-and-drop images
- Code blocks with syntax highlighting
- Links, quotes, headings

### Media Library
- Upload images directly
- Automatic optimization
- Hotspot selection (smart cropping)
- Alt text for accessibility

### Draft/Publish Workflow
- Save drafts
- Preview before publishing
- Schedule posts (with plugins)
- Version history

### Mobile App
Download Sanity Studio app:
- Write posts from your phone
- Upload photos on-the-go
- Quick edits anywhere

---

## 🛠️ Configuration

### Blog Post Schema

Located at: `sanity/schemas/post.ts`

**Fields:**
- Title (required)
- Slug (auto-generated)
- Description (SEO, max 160 chars)
- Cover Image (optional)
- Body (rich text with images & code)
- Tags (array)
- Published Date
- Status (draft/published)

**Customize:**
Add fields by editing `post.ts`:
```typescript
defineField({
  name: 'author',
  title: 'Author',
  type: 'string',
}),
```

### Studio Customization

Edit `sanity.config.ts`:
```typescript
theme: {
  color: {
    primary: '#3b82f6', // Your brand color
  },
},
```

---

## 🔒 Security

### API Tokens

For draft content, add a token:
1. Go to https://sanity.io/manage
2. API → Tokens
3. Create token with "Viewer" role
4. Add to `.env`:
   ```
   SANITY_API_TOKEN=your-token
   ```

### CORS Origins

Add your domains:
1. https://sanity.io/manage
2. API → CORS Origins
3. Add: `http://localhost:5173` (dev)
4. Add: `https://yoursite.com` (prod)

---

## 📊 Content Strategy

### When to Use MDX

- Technical deep-dives
- Code-heavy tutorials
- Posts with custom React components
- Content you want version-controlled in Git

### When to Use Sanity

- Quick thoughts and updates
- Image-heavy posts
- Writing on mobile
- When you want a visual editor
- Team blog with multiple authors

### Best Practice

Start with Sanity for ease of use. Use MDX for special cases.

---

## 🎯 Blog Workflow

### Writing a Post (Sanity)

1. Visit `/studio`
2. Click "Blog Post" → Create
3. Write your post
4. Upload images
5. Add tags
6. Set "Status" to Published
7. Click Publish
8. Auto-appears on `/blog`!

### Writing a Post (MDX)

1. Create `content/blog/post-slug.mdx`
2. Add frontmatter
3. Write in Markdown
4. Commit and push
5. Auto-deploys via Vercel

Both appear together on your blog!

---

## 🚀 Deployment

### Vercel

Add environment variables:
1. Vercel Dashboard → Settings → Environment Variables
2. Add `SANITY_PROJECT_ID`
3. Add `SANITY_DATASET`
4. Redeploy

### Studio Hosting

**Option 1: Self-hosted** (current)
- Studio lives at yoursite.com/studio
- No extra hosting needed
- Uses your Vercel deployment

**Option 2: Sanity-hosted**
```bash
npx sanity deploy
```
- Studio at yourproject.sanity.studio
- Separate from main site
- Free hosting by Sanity

---

## 🎨 Customization Ideas

### Add More Content Types

Create schemas for:
- Projects (portfolio items)
- Case Studies
- Resources/Links
- Speaking engagements

### Add Plugins

```bash
npm install @sanity/code-input
```

Then add to `sanity.config.ts`:
```typescript
import { codeInput } from '@sanity/code-input';

plugins: [
  codeInput(),
]
```

Popular plugins:
- `@sanity/code-input` - Better code blocks
- `sanity-plugin-markdown` - Markdown support
- `@sanity/dashboard` - Custom dashboard
- `sanity-plugin-media` - Advanced media library

---

## 📈 Content Migration

### Moving MDX to Sanity

If you want to migrate existing MDX posts:

1. Copy content from `.mdx` files
2. Create posts in Sanity Studio
3. Paste content
4. Format with rich text editor
5. Delete old `.mdx` files (optional - or keep both!)

### Exporting from Sanity

```bash
npx sanity dataset export production backup.tar.gz
```

Your content is never locked in!

---

## 🤝 Collaboration

### Adding Team Members

1. https://sanity.io/manage
2. Project → Members
3. Invite by email
4. Choose role:
   - **Administrator**: Full access
   - **Editor**: Can write & publish
   - **Contributor**: Can write drafts
   - **Viewer**: Read-only

Free tier: **3 users**

---

## 🎓 Learning Resources

- [Sanity Docs](https://www.sanity.io/docs)
- [Portable Text](https://www.sanity.io/docs/presenting-block-text)
- [Schema Guide](https://www.sanity.io/docs/schema-types)
- [Studio Customization](https://www.sanity.io/docs/studio-ui)

---

## 🆘 Troubleshooting

### Studio not loading?
- Check `.env` has correct `SANITY_PROJECT_ID`
- Clear browser cache
- Try incognito mode

### Posts not appearing?
- Check "Status" is set to "Published"
- Verify `.env` variables in Vercel
- Check CORS settings in Sanity

### Images not loading?
- Verify CORS origins include your domain
- Check image asset permissions

---

## 💡 Pro Tips

1. **Use drafts** - Write drafts, preview, then publish
2. **Rich previews** - Studio shows live preview of posts
3. **Keyboard shortcuts** - Cmd+S to save, Cmd+Shift+P to publish
4. **Version history** - Right-click post → "Revision history"
5. **Mobile editing** - Download Sanity Studio app for iOS/Android

---

## 🎉 You're All Set!

Your blog now has:
- ✅ Visual editor at `/studio`
- ✅ Git-based MDX backup
- ✅ Both sources merged on `/blog`
- ✅ Media library for images
- ✅ Draft/publish workflow
- ✅ Mobile-friendly editing
- ✅ Free forever (3 users, 100k docs)

**Start writing!** 🚀

Questions? The setup works out of the box - just add your `SANITY_PROJECT_ID` to `.env` and you're ready!
