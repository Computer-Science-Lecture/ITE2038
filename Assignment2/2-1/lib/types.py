from enum import Enum

class T(Enum):
    contacts = 1
    students = 2
    classes = 3
    courses = 4
    credits = 5
    business = 6

    def fromString(string):
        for t in T:
            if string.upper() == t.name.upper():
                return t
        return None
