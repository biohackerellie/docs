# Python Scripts

Simple quick scripts run in Python

## Generate sha256 hash password 

A simple script to generate a hash of any password you put inside the quotes.

```python
import hashlib
haslib.sha256(b"password").hexdiggest()
```