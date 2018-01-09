# Input

```json
{
    "elements": [
        {
            "type": "text",
            "name": "firstname",
            "validation": [
                "firstname",
                "required"
            ]
        },
        {
            "type": "text",
            "name": "secondname",
            "validation": [
                "secondname",
                "required"
            ]
        },
        {
            "type": "email",
            "name": "email",
            "validation": [
                "email",
                "required",
                ["min", 10],
                ["max", 200]
            ]
        },
        {
            "type": "wysiwyg",
            "name": "bio",
            "options": {
                "tools": ["b", "i", "u"]
            }
        }
    ],
    "values": {
        "firstname": "John",
        "secondname": "Doe",
        "email": "john@doe.com",
        "bio": "<b>Be the best to mean something.</b>"
    }
}
```
