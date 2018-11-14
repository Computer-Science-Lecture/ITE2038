from lib.permission import Permission

class Session(object):
    def __init__(self, user: int, permission: Permission):
        self.user = user
        self.permission = permission

    @property
    def isAdmin(self) -> bool:
        return self.permission == Permission.admin

    def require():
        def wrapper(f):
            @wraps(f)
            def wrapped(self, *args, **kwargs):
                if self.session:
                    return f(self, *args, **kwargs)
                raise Exception("Session required")
            return wrapped
        return wrapper
