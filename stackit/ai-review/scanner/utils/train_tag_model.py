# ai-review/train_tag_model.py

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
import joblib
import os

# === CONFIG ===
DATA_PATH = "questions_with_tags_500.csv"
MODEL_DIR = "tag_model"

# === Load Data ===
df = pd.read_csv(DATA_PATH)
df['text'] = df['title'] + " " + df['description']
df['tags'] = df['tags'].apply(lambda x: x.split(','))

# === Preprocessing ===
vectorizer = TfidfVectorizer(
    max_features=7000,
    ngram_range=(1, 2),        
    stop_words='english',     
    min_df=2                  
)
X = vectorizer.fit_transform(df['text'])

mlb = MultiLabelBinarizer()
Y = mlb.fit_transform(df['tags'])

# === Train Model with Multi-Label Wrapper ===
base_model = LogisticRegression(C=10, solver='liblinear', max_iter=1000)
model = OneVsRestClassifier(base_model)
model.fit(X, Y)

# === Save Everything ===
os.makedirs(MODEL_DIR, exist_ok=True)
joblib.dump(model, f"{MODEL_DIR}/model.pkl")
joblib.dump(vectorizer, f"{MODEL_DIR}/tfidf_vectorizer.pkl")
joblib.dump(mlb, f"{MODEL_DIR}/mlb.pkl")

print("✅ Multi-label tag prediction model trained and saved successfully.")
