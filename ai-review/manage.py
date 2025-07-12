"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ai_review.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Check if this is a runserver command and add startup logging
    if len(sys.argv) > 1 and sys.argv[1] == 'runserver':
        print("Starting AI Review Service...")
        print("Loading ML models...")
        
        # Initialize Django settings
        import django
        django.setup()
        
        # Load ML models
        try:
            from scanner.utils.model_loader import model_loader
            if model_loader.load_models():
                print("✓ ML models loaded successfully")
            else:
                print("⚠ Warning: ML models failed to load")
        except Exception as e:
            print(f"⚠ Warning: Could not load ML models: {e}")
        
        print("AI Review Service ready!")
        print("Available endpoints:")
        print("  - POST /api/predict-tags/")
        print("  - POST /api/filter-content/")
        print("  - POST /api/rank-answers/")
        print("  - POST /api/clean-answers/")
        print("  - GET  /api/health/")
        print()
    
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()