# Car Damage Classification ML API

Flask API for serving the car damage classification model.

## Setup

1. **Create virtual environment:**
```bash
python -m venv venv
```

2. **Activate virtual environment:**
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Place your model file:**
- Copy `car_damage_classification_model.h5` to this directory (`ml-api/`)

5. **Run the API:**
```bash
python app.py
```

The API will start on `http://localhost:5001`

## API Endpoints

### Health Check
```
GET /health
```

### Predict Damage
```
POST /predict
Content-Type: multipart/form-data

Body:
- image: (file) Image file to classify
```

### Get Classes
```
GET /classes
```

## Model Configuration

Update the `DAMAGE_CLASSES` list in `app.py` to match your model's output classes.

Current classes:
- Minor Scratch
- Major Dent
- Broken Glass
- Flat Tire
- Bumper Damage
- No Damage

## Integration

The Node.js backend will call this Flask API to get predictions.
