import os
import joblib
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class ModelLoader:
    def __init__(self):
        self.models = {}
        self.model_path = Path(__file__).parent / "tag_model"
        
    def load_models(self):
        """Load all ML models and verify they work"""
        try:
            # Load tag prediction model
            model_file = self.model_path / "model.pkl"
            vectorizer_file = self.model_path / "tfidf_vectorizer.pkl"
            mlb_file = self.model_path / "mlb.pkl"
            
            if not all([model_file.exists(), vectorizer_file.exists(), mlb_file.exists()]):
                logger.error("Missing model files")
                return False
                
            self.models['tag_model'] = joblib.load(model_file)
            self.models['vectorizer'] = joblib.load(vectorizer_file)
            self.models['mlb'] = joblib.load(mlb_file)
            
            # Test the model with sample data
            test_text = "How to use React hooks?"
            X_test = self.models['vectorizer'].transform([test_text])
            prediction = self.models['tag_model'].predict(X_test)
            
            logger.info("All models loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load models: {str(e)}")
            return False
    
    def get_model(self, model_name):
        """Get a specific model"""
        return self.models.get(model_name)
    
    def is_ready(self):
        """Check if all models are loaded"""
        return len(self.models) > 0

# Global model loader instance
model_loader = ModelLoader() 