import argparse

from lib.manager import Manager
from lib.types import T

def main(contacts, students, classes, courses, credits):
    manager = Manager({
        T.contacts: contacts,
        T.students: students,
        T.classes: classes,
        T.courses: courses,
        T.credits: credits,
    })

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('contacts', type=str, default='contacts.csv')
    parser.add_argument('students', type=str, default='students.csv')
    parser.add_argument('classes', type=str, default='class.csv')
    parser.add_argument('courses', type=str, default='course.csv')
    parser.add_argument('credits', type=str, default='credits.csv')

    args = parser.parse_args()
    main({
        args.contacts,
        args.students,
        args.classes,
        args.courses,
        args.credits,
    })

