import argparse
from random import choice

from lib.manager import Manager
from lib.types import T

def main(contacts, students, classes, courses, credits):
    db = Manager({
        T.contacts: contacts,
        T.students: students,
        T.classes: classes,
        T.courses: courses,
        T.credits: credits,
    })

    # File I/O Step1
    db.login('admin', None)
    
    db.create(T.students, ["2016001234", 'xxx', '홍길동', 'male', "6", "1999002345", "1"])
    db.commit()
    print (db.values[T.students])
    
    db.create(T.contacts, ["2016001234", '01088884444', 'hong@hanyang.ac.kr'])
    db.commit()
    print (db.values[T.contacts])

    db.update(T.contacts, {
        "sid": db.findOne(["sid"], T.students, {"sname": "권희조"})[0],
    }, {
        "email": "kwon@hanyang.ac.kr",
    })
    db.commit()
    print (db.values[T.contacts])

    print("WTF", {
        "sid": db.findOne(["sid"], T.students, {"sname": "김다현"})[0]
    })
    db.remove(T.contacts, {
        "sid": db.findOne(["sid"], T.students, {"sname": "김다현"})[0]
    })
    db.commit()
    print (db.values[T.students])

    # File I/O Step2

    # login as 정남아
    db.login('2009003125', '125125125')
    db.load(T.business, './business_cards/Grass_corp.csv', ['name', 'phone', 'email', 'type'])
    
    db.update(T.business, {
        "phone": "01023140011",
    }, {
        "name": "이상해풀",
        "email": "ivysaur@grass.poke",
        "type": "이사",
    })
    db.update(T.business, {
        "phone": "01051522001",
    }, {
        "email": "meganium@grass.poke",
        "type": "사장",
    })
    db.create(T.business, ["리피아", "01061344185", "leafeon@grass.poke", "부장"])

    # remove random
    db.remove(T.business, {
        'phone': choice(db.findAll(['phone'], T.business).squeeze())
    })


    print (db.values[T.business])

    # login as 윤인욱
    db.login('2013004394', 'goodboy')
    db.load(T.business, './business_cards/Fire_corp.csv', ['name', 'phone', 'email', 'type'])
    
    db.remove(T.business, {
        "phone": "01066162014",
    })
    db.create(T.business, ["파이어로", "01066162014", "talonflame@fire.poke", "대리"])

    # remove random
    db.remove(T.business, {
        'phone': choice(db.findAll(['phone'], T.business).squeeze())
    })
    print (db.values[T.business])

    # login as 장두호
    db.login('2014005004', 'hexahed')
    db.load(T.business, './business_cards/Water_corp.csv', ['name', 'phone', 'email', 'type'])
    
    db.update(T.business, {
        "phone": "01091290760",
    }, {
        "name": "갸라도스",
        "email": "gyarados@water.poke",
        "type": "과장",
    })
    db.remove(T.business, {
        "phone": "01061344185",
    })
    db.create(T.business, ["마릴", "01029818318", "marill@water.poke", "사원"])

    # remove random
    db.remove(T.business, {
        'phone': choice(db.findAll(['phone'], T.business).squeeze())
    })
    print (db.values[T.business])

    # File I/O Step3
    db.login('admin', None)
    print (db.emailFrequency)

    # Process
    print ('''
# SELECT [ATTRIBUTE] FROM [TABLE] WHERE [COND, (only support equal)]
# UPDATE [TABLE] SET [ATTRIBUTE=value,] WHERE [COND, (only support equal)]
# DELETE FROM [TABLE] WHERE [COND, (only support equal)]
# COMMIT

# examples
# >> SELECT sname, sex FROM STUDENTS WHERE sname=홍길동
# >> COMMIT
''')
    print ('''
There is {} tables
{}
'''.format(len(T), [t.name.upper() for t in T]))

    db.login('admin', None)
    while True:
        print ('>> ', end='')
        raw = input().strip()
        if raw.startswith('SELECT'):
            select, remain = raw.split('FROM')
            _, attributes = select.split('SELECT')
            target, *conditions = remain.split('WHERE')
        
            print (db.findAll(
                [] if attributes.strip() == '*' else list(map(str.strip, map(str.lower,attributes.strip().split(',')))),
                T.fromString(target.strip()),
                { c.split('=')[0].strip().lower(): c.split('=')[1].strip() for c in conditions[0].split(',')} if conditions else {}
            ))
        elif raw.startswith('UPDATE'):
            update, remain = raw.split('SET')
            _, target = update.split('UPDATE')
            attributes, *conditions = remain.split('WHERE')

            db.update(
                T.fromString(target.strip()),
                { c.split('=')[0].strip().lower(): c.split('=')[1].strip() for c in conditions[0].split(',')} if conditions else {},
                { c.split('=')[0].strip().lower(): c.split('=')[1].strip() for c in attributes.split(',')} if attributes else {}
            )
        elif raw.startswith('DELETE'):
            remain, *conditions = raw.split('WHERE')
            _, target = remain.split('FROM')

            db.remove(
                T.fromString(target.strip()),
                { c.split('=')[0].strip().lower(): c.split('=')[1].strip() for c in conditions[0].split(',')} if conditions else {}
            )
        elif raw.startswith('COMMIT'):
            db.commit()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--contacts', type=str, default='contacts.csv')
    parser.add_argument('--students', type=str, default='students.csv')
    parser.add_argument('--classes', type=str, default='class.csv')
    parser.add_argument('--courses', type=str, default='course.csv')
    parser.add_argument('--credits', type=str, default='credits.csv')

    args = parser.parse_args()
    main(*[
        args.contacts,
        args.students,
        args.classes,
        args.courses,
        args.credits,
    ])
