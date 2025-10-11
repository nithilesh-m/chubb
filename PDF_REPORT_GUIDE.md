# PDF Report Feature Guide

## Overview

The Part Detection page now includes a professional PDF report download feature with animated particle background effects.

## Features Added

### 1. **Particle Background Effect**
- ✅ Animated floating particles (same as Prediction.jsx)
- ✅ Gradient color effects
- ✅ Smooth animations
- ✅ Dedicated CSS file: `Part.css`

### 2. **PDF Report Download**
- ✅ Professional PDF layout with CHUBB CLAIMS branding
- ✅ Includes damage detection results
- ✅ Includes part detection results
- ✅ Shows all part predictions (top 10)
- ✅ Includes vehicle image
- ✅ Date, time, and user information
- ✅ Page numbers and footer

## PDF Report Contents

### Page 1: Report Summary
```
┌─────────────────────────────────┐
│   CHUBB CLAIMS (Blue Header)    │
│ Vehicle Damage Assessment Report│
└─────────────────────────────────┘

Report Date: 10/12/2025
Report Time: 3:45 PM
User: harshan

Damage Detection Result
Status: Damaged
Confidence: 93.73%

Damaged Part Detection
Damaged Part: Front Bumper
Confidence: 87.5%

All Part Predictions:
  Front Bumper: 87.5%
  Rear Bumper: 5.2%
  Hood: 3.1%
  ... (top 10)

Footer: Group 301 - Confidential Report
        Page 1 of 2
```

### Page 2: Vehicle Image
```
Vehicle Image
[Full-size car image]

Footer: Group 301 - Confidential Report
        Page 2 of 2
```

## How to Use

### 1. **Navigate to Part Detection**
```
Upload Image → Predict → Next → Detect Damaged Part
```

### 2. **Download PDF Report**
Click the green "Download PDF Report" button

### 3. **PDF File**
- Automatically downloads as: `Damage_Report_[timestamp].pdf`
- Example: `Damage_Report_1697123456789.pdf`

## Button Styles

### **Download PDF Report Button**
- 🟢 Green gradient background
- 📥 Download icon
- Hover effect with shadow
- Smooth animations

### **Back to Upload Button**
- ⚫ Gray background
- ← Back arrow icon
- Returns to Prediction page

## Technical Details

### Dependencies
```json
{
  "jspdf": "^2.5.1"
}
```

### Files Modified
1. ✅ `Part.jsx` - Added PDF generation function
2. ✅ `Part.css` - New CSS file with particle effects
3. ✅ `package.json` - Added jsPDF dependency

### CSS Classes Added
- `.part-page` - Main page wrapper
- `.particles-bg` - Animated particle background
- `.print-report-btn` - PDF download button
- Particle animations and effects

## Particle Effect Details

### Animation Features
- **Floating particles**: Smooth up/down movement
- **Color gradients**: Blue, purple, pink overlays
- **Opacity changes**: Fades in/out
- **Scale transforms**: Grows/shrinks slightly
- **20-second loop**: Infinite animation

### Visual Effects
```css
- Radial gradients at multiple positions
- Transform animations (translate, scale)
- Opacity transitions
- Smooth easing functions
```

## PDF Generation Process

### Step 1: Initialize jsPDF
```javascript
const { jsPDF } = await import('jspdf')
const doc = new jsPDF()
```

### Step 2: Add Header
- Blue background rectangle
- White text
- CHUBB CLAIMS title
- Subtitle

### Step 3: Add Content
- Report metadata (date, time, user)
- Damage detection results
- Part detection results
- All predictions list

### Step 4: Add Image
- New page for vehicle image
- Scaled to fit (170x120mm)
- Centered on page

### Step 5: Add Footer
- Page numbers
- "Group 301 - Confidential Report"
- Applied to all pages

### Step 6: Save
- Auto-generated filename
- Downloads to browser's download folder

## Customization

### Change PDF Colors
Edit `Part.jsx` line 71-72:
```javascript
doc.setFillColor(59, 130, 246)  // Blue header
// Change to: doc.setFillColor(16, 185, 129)  // Green
```

### Change Report Title
Edit `Part.jsx` line 75:
```javascript
doc.text('CHUBB CLAIMS', 105, 20, { align: 'center' })
```

### Add More Predictions
Edit `Part.jsx` line 122:
```javascript
.slice(0, 10) // Top 10
// Change to: .slice(0, 15) // Top 15
```

### Change Image Size
Edit `Part.jsx` line 138:
```javascript
doc.addImage(imagePreview, 'JPEG', 20, 30, 170, 120)
// Format: (image, type, x, y, width, height)
```

## Troubleshooting

### Issue: PDF not downloading

**Solution:**
1. Check browser console for errors
2. Ensure jsPDF is installed: `npm install jspdf`
3. Restart frontend: `npm run dev`

### Issue: Image not showing in PDF

**Cause:** Image format not supported or too large

**Solution:**
- Ensure image is JPG/PNG
- Image is automatically converted to base64
- Check browser console for image errors

### Issue: Particle effect not visible

**Solution:**
1. Clear browser cache (Ctrl+Shift+R)
2. Check `Part.css` is imported
3. Verify `.part-page` class is applied

### Issue: PDF layout broken

**Cause:** Too much content on one page

**Solution:**
- Reduce number of predictions shown
- Add page breaks: `doc.addPage()`
- Adjust Y positions

## Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

### PDF Features
- ✅ Text rendering
- ✅ Image embedding
- ✅ Color support
- ✅ Multi-page support
- ✅ Auto-download

## Performance

### PDF Generation Time
- Small images (<1MB): ~1-2 seconds
- Large images (>5MB): ~3-5 seconds

### Optimization Tips
1. Compress images before upload
2. Limit predictions to top 10
3. Use JPEG format for images
4. Avoid very high-resolution images

## Future Enhancements

Potential additions:
- [ ] Add charts/graphs for predictions
- [ ] Include repair cost estimates
- [ ] Add company logo
- [ ] Email PDF directly
- [ ] Save to database
- [ ] Print preview before download
- [ ] Multiple image support
- [ ] Damage severity visualization

## Testing

### Test Checklist
- [ ] Upload damaged car image
- [ ] Get damage prediction
- [ ] Click "Next" button
- [ ] Detect damaged part
- [ ] Click "Download PDF Report"
- [ ] Verify PDF downloads
- [ ] Open PDF and check content
- [ ] Verify image is included
- [ ] Check all text is readable
- [ ] Verify page numbers

## Example Output

```
Filename: Damage_Report_1697123456789.pdf
Size: ~500KB (with image)
Pages: 2
Format: A4 (210x297mm)
Orientation: Portrait
```

## Support

For issues:
1. Check browser console (F12)
2. Verify jsPDF is installed
3. Check Part.css is loaded
4. Review PDF_REPORT_GUIDE.md
