from typing import Callable

from enum import Enum
from functools import wraps

class Permission(Enum):
    Default = 0
    Admin = 1
    Student = 2
    
    def sudo(upper, session, task):
        original_permission = session.permission
        session.permission = upper
        result = task()
        session.permission = original_permission
        return result

    def require(permission):
        def wrapper(f):
            @wraps(f)
            def wrapped(self, *args, **kwargs):
                if self.permission == permission:
                    return f(self, *args, **kwargs)
                raise Exception("Invalid Permission")
            return wrapped
        return wrapper
