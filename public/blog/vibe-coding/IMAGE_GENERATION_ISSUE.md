# Blog Hero Image Generation Issue

## Current Status
The KIE API key in `.env.local` does not have access permissions for image generation models.

## Error Details
```
KIE API task creation failed: { code: 401, msg: 'You do not have access permissions' }
```

## Models Attempted (in priority order)
1. `google/nano-banana` - 401 Unauthorized
2. `nano-banana-pro` - 401 Unauthorized

## Solution Options

### Option 1: Update KIE API Key Permissions
Contact KIE.ai support to enable image generation permissions for your API key.

### Option 2: Configure Alternative Model
If you have access to a different model, set it in `.env.local`:
```bash
KIE_IMAGE_T2I_MODEL="your-model-name"
```

### Option 3: Use Manual Image Generation
1. Generate images using KIE.ai web interface or another AI image generator
2. Save as `public/blog/<slug>/hero.jpg`
3. Dimensions: 1280x720px (16:9 aspect ratio)
4. Format: JPEG

## Current Workaround
A placeholder hero image has been copied from another blog post for the vibe-coding page.

## Script Updates Made
Updated `scripts/generate-blog-hero.ts` to use the model priority system instead of hardcoding 'nano-banana-pro'. The script now:
1. Checks `env.KIE_IMAGE_T2I_MODEL` first (if configured)
2. Falls back to `google/nano-banana`
3. Falls back to `nano-banana-pro`

This ensures all blog image generation uses the same format and model priority.
