# ML Models Setup

## ⚠️ Important: Model Files Not Included

The ML model files are **NOT included in this repository** because they exceed GitHub's 100MB file size limit.

### Required Model Files

You need to place the following model files in the `ml-api/` directory:

1. **car_damage_classification_model.h5** (147.86 MB)
   - Binary classification model
   - Detects: Damaged vs Not Damaged

2. **efficientnet_car_damage.h5** (237.61 MB)
   - Multi-class classification model
   - Detects which car part is damaged

## How to Add Models

### Option 1: Download from Your Source
```bash
# Place your model files in ml-api/
cp /path/to/car_damage_classification_model.h5 ml-api/
cp /path/to/efficientnet_car_damage.h5 ml-api/
```

### Option 2: Train Your Own Models
Follow the instructions in `MODEL_GUIDE.md` to train your own models.

### Option 3: Use Git LFS (For Team Sharing)

If you want to share models with your team:

```bash
# Install Git LFS
git lfs install

# Track model files
git lfs track "*.h5"
git lfs track "*.keras"

# Add .gitattributes
git add .gitattributes

# Add models
git add ml-api/*.h5
git commit -m "Add ML models via Git LFS"
git push
```

## Verify Models Are Present

After adding the models, verify:

```bash
ls ml-api/*.h5
```

You should see:
```
ml-api/car_damage_classification_model.h5
ml-api/efficientnet_car_damage.h5
```

## System Works Without Models

The system includes **fallback mock predictions** so you can test the UI and workflow even without the actual model files.

### Mock Predictions
- Random damage detection (Damaged/Not Damaged)
- Random part detection (12 car parts)
- Confidence values between 70-95%

## File Structure

```
ml-api/
├── app.py                                    ✅ Included
├── requirements.txt                          ✅ Included
├── car_damage_classification_model.h5        ❌ NOT included (add manually)
├── efficientnet_car_damage.h5                ❌ NOT included (add manually)
├── MODEL_GUIDE.md                            ✅ Included
└── README.md                                 ✅ Included
```

## Alternative: Download from Cloud Storage

You can store models on:
- Google Drive
- Dropbox
- AWS S3
- Azure Blob Storage
- Your own server

Then download them during deployment:

```bash
# Example: Download from Google Drive
wget --no-check-certificate 'https://drive.google.com/uc?export=download&id=FILE_ID' -O ml-api/car_damage_classification_model.h5
```

## Model Sizes

| Model | Size | Purpose |
|-------|------|---------|
| car_damage_classification_model.h5 | 147.86 MB | Binary classification |
| efficientnet_car_damage.h5 | 237.61 MB | Part detection |
| **Total** | **385.47 MB** | Both models |

## GitHub File Size Limits

- **Maximum file size**: 100 MB
- **Recommended**: Use Git LFS for files > 50 MB
- **Warning at**: 50 MB
- **Blocked at**: 100 MB

## Questions?

If you need the model files, contact the project maintainer or train your own using the guide in `MODEL_GUIDE.md`.
