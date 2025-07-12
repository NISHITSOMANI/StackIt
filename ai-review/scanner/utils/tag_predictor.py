
import joblib
import os
import numpy as np

# === Load Model Components ===
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'tag_model')

model = joblib.load(os.path.join(MODEL_DIR, 'model.pkl'))
vectorizer = joblib.load(os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl'))
mlb = joblib.load(os.path.join(MODEL_DIR, 'mlb.pkl'))

# === Predict Tags ===

def predict_tags(title, description, top_n=3):
    text = f"{title} {description}"
    X = vectorizer.transform([text])
    Y_pred_prob = model.predict_proba(X)[0]
    
    top_indices = np.argsort(Y_pred_prob)[-top_n:][::-1]
    tags = mlb.classes_[top_indices]
    
    return tags.tolist()
