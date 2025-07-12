# ai-review/scanner/utils/test.py

from tag_predictor import predict_tags

test_cases = [
    {
        "title": "How to implement authentication in React using JWT?",
        "desc": "I want to secure routes in my React frontend using JWTs issued from the backend."
    },
    {
        "title": "MongoDB aggregation query issue",
        "desc": "I'm trying to group records using $group and filter using $match but getting no results."
    },
    {
        "title": "React router blank screen on navigation",
        "desc": "When I navigate to another route using Link from react-router-dom, the screen turns blank."
    },
    {
        "title": "Hashing passwords in Node.js before storing",
        "desc": "How do I use bcrypt or any library to hash user passwords securely before saving to MongoDB?"
    },
    {
        "title": "Why is my Express middleware not executing?",
        "desc": "My custom middleware is not being called on protected routes in Express. What could be the issue?"
    }
]

for i, test in enumerate(test_cases, start=1):
    tags = predict_tags(test['title'], test['desc'])
    print(f"\n==== TEST CASE {i} ====")
    print(f"Title: {test['title']}")
    print(f"Description: {test['desc']}")
    print(f"Suggested Tags: {tags}")
