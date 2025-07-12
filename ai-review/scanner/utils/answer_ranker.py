import re
from better_profanity import profanity

# Load default profanity set
profanity.load_censor_words()

# Add extra custom profane terms (local slang etc.)
CUSTOM_BAD_WORDS = {'wtf', 'fuck', 'shit', 'hell', 'lmao', 'rofl'}

LOW_QUALITY_PATTERNS = [
    r'^\s*$',                            # empty
    r'^[a-zA-Z]$',                       # single letter
    r'^[0-9]{1,2}$',                     # just number
    r'^[a-zA-Z\s]{1,3}$',                # very short
    r'(.)\1{3,}',                        # repeated characters
    r'^(idk|same|ok|okay|k|thanks|cool)$',  # generic words
    r'😐|😂|🤣|❤️|😒|👌|🔥|👍|💀|😭|😎|🙄|🖕|💦|🍆||🍑',  # emojis
]

def is_profanity(text):
    lower_text = text.lower()
    for bad in CUSTOM_BAD_WORDS:
        if bad in lower_text:
            return True
    return profanity.contains_profanity(lower_text)

def is_low_effort(text):
    cleaned = text.lower().strip()
    for pattern in LOW_QUALITY_PATTERNS:
        if re.fullmatch(pattern, cleaned) or re.search(pattern, cleaned):
            return True
    if len(cleaned.split()) < 5:
        return True
    return False

def clean_answers(answer_list):
    """
    Removes low-quality or profane answers from the list.
    """
    valid_answers = []
    for ans in answer_list:
        if is_profanity(ans):
            print(f"Removed (profanity): {ans}")
            continue
        if is_low_effort(ans):
            print(f"Removed (low effort): {ans}")
            continue
        valid_answers.append(ans)
    return valid_answers
