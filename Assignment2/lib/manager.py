from os import path

from lib.permission import Permission
from lib.session import Session
from lib.types import T

class Manager:
    def __init__(self, files):
        if not all(t in files for t in T):
            raise "Must include all files"
        self.__files = files
        self.__frames = {file: pd.read_csv(filename, dtype=object, sep=" *, *", encoding="UTF-8") for file, filename in files.items()}
        self.__columns = {file: frame.columns.values for file, frame in self.__frames.items()}
        self.__values_admin = {file: frame.values for file, frame in self.__frames.items()}
        self.__values_user = {t: np.zeros((0, self.__columns[t].size)) for t in T}
        self.__session = Session(None, Permission.Default)

    def load_user(self):
        for t, file in self.__files.items():
            self.__session.user
            filename = '{}_{}'.format(self.__session.user, file)
            if path.isfile(filename):
                self.__values_user[t] = pd.read_csv(filename, dtype=object, sep=" *, *", encoding="UTF-8").values
            else:
                self.__values_user[t] = np.zeros((0, self.__columns[t].size))
        
    def login(self, user, pw):
        if user == 'admin':
            self.__session = Session(user, Permission.Admin)
        else:
            password = Permission.Admin.sudo(self.__session, lambda: self.findOne(['password'], T.students, {'sid': user}))
            if password and password[0] == pw:
                self.__session = Session(user, Permission.Student)
                self.load_user()
            else:
                raise Exception('Invalid ID or Password')
    
    @property
    def permission(self) -> Permission:
        return self.__session.permission
    
    @Permission.require(Permission.Admin)
    def values_admin(self) -> np.ndarray:
        return self.__values_admin
    
    @Permission.require(Permission.Student)
    def values_student(self) -> np.ndarray:
        return self.__values_user
    
    @Permission.require(Permission.Admin)
    def set_values_admin(self, target: T, v: np.ndarray):
        self.__values_admin[T] = v
    
    @Permission.require(Permission.Student)
    def set_values_student(self, target: T, v: np.ndarray):
        self.__values_user[T] = v
    
    @property
    def values(self) -> np.ndarray:
        return {
            Permission.Admin: self.values_admin,
            Permission.Student: self.values_student,
        }[self.__session.permission]()
    
    @property
    def columns(self) -> np.ndarray:
        return self.__columns
    
    def create(self, target: T, values = np.ndarray):
        self.values[target] = np.vstack([self.values[target], np.array(values)])
    
    def remove(self, target: T, where: dict = {}):
        self.values[target] = np.delete(self.values[target], self.findIndex(target, where), 0)
    
    def update(self, target: T, where: dict = {}, values = np.ndarray):
        for key, value in values.items():
            self.values[target][self.findIndex(target, where), np.where(self.__columns[target] == key)[0][0]] = value
    
    def findIndex(self, target: T, where: dict = {}) -> np.ndarray:
        return np.where(
            np.logical_and(
                *[self.values[target][:,column] == value for column, value in zip(
                    [np.where(self.__columns[target] == case)[0][0] for case in where],
                    where.values()
                )],
                np.ones(np.size(self.values[target], 0), dtype=np.bool),
                np.ones(np.size(self.values[target], 0), dtype=np.bool)
            )
        )[0]

    def findAll(self, subject: list, target: T, where: dict = {}) -> np.ndarray:
        return self.values[target][self.findIndex(target, where)]\
                          [:, [np.where(self.__columns[target] == case)[0][0] for case in (subject if subject else self.__columns[target])]]
    
    def findOne(self, subject: list, target: T, where: dict = {}) -> object:
        try:
            return self.findAll(subject, target, where)[0]
        except:
            return None
        
    # target function
    @property
    def emails(self):
        return zip(*map(lambda x: x.split('@'), db.findAll(['email'], T.contacts).squeeze()))
    
    
    def __str__(self):
        pass
