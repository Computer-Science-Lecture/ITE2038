from os import path
from collections import Counter

from lib.permission import Permission
from lib.session import Session
from lib.types import T

import numpy as np
import pandas as pd

class Manager:
    def __init__(self, files):
        self.__files = files
        self.__frames = {file: pd.read_csv(filename, dtype=object, sep=" *, *", encoding="UTF-8") for file, filename in files.items()}
        self.__columns_admin = {file: frame.columns.values for file, frame in self.__frames.items()}
        self.__columns_user = {file: frame.columns.values for file, frame in self.__frames.items()}
        self.__values_admin = {file: frame.values for file, frame in self.__frames.items()}
        self.__values_user = {t: np.zeros((0, self.__columns_user[t].size)) for t in files}
        self.__session = Session(None, Permission.Default)

    # How foolish data format... where is column? you idiot
    @Permission.require(Permission.Student)
    def load(self, t: T, filename, columns: list):
        frame = pd.read_csv(filename, dtype=object, sep=" *, *", encoding="UTF-8", header=None)
        self.__columns_user[t] = np.asarray(columns)
        self.__values_user[t] = frame.values
        frame.to_csv('private_{}.csv'.format(self.__session.user), index=False, header=None)

    def login(self, user, pw):
        if user == 'admin':
            self.__session = Session(user, Permission.Admin)
        else:
            password = Permission.Admin.sudo(self.__session, lambda: self.findOne(['password'], T.students, {'sid': user}))
            if password and password[0] == pw:
                self.__session = Session(user, Permission.Student)
                self.load(T.business, 'private_{}.csv'.format(user), ['name', 'phone', 'email', 'type'])
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
    
    @property
    def values(self) -> np.ndarray:
        return {
            Permission.Admin: self.values_admin,
            Permission.Student: self.values_student,
        }[self.__session.permission]()
    
    @Permission.require(Permission.Admin)
    def columns_admin(self) -> np.ndarray:
        return self.__columns_admin
    
    @Permission.require(Permission.Student)
    def columns_student(self) -> np.ndarray:
        return self.__columns_user
    
    @property
    def columns(self) -> np.ndarray:
        return {
            Permission.Admin: self.columns_admin,
            Permission.Student: self.columns_student,
        }[self.__session.permission]()
    
    def elements(self, t: T) -> np.ndarray:
        return np.vstack([
            Permission.Admin.sudo(self.__session, lambda: self.values[t]),
            Permission.Student.sudo(self.__session, lambda: self.values[t])
        ])
    
    def create(self, target: T, values = np.ndarray):
        self.values[target] = np.vstack([self.values[target], np.array(values)])
    
    def remove(self, target: T, where: dict = {}):
        self.values[target] = np.delete(self.values[target], self.findIndex(target, where), 0)
    
    def update(self, target: T, where: dict = {}, values: dict = {}):
        for key, value in values.items():
            self.values[target][self.findIndex(target, where), np.where(self.columns[target] == key)[0][0]] = value
    
    def findIndex(self, target: T, where: dict = {}) -> np.ndarray:
        return np.where(
            np.logical_and(
                *[self.values[target][:,column] == value for column, value in zip(
                    [np.where(self.columns[target] == case)[0][0] for case in where],
                    where.values()
                )],
                np.ones(np.size(self.values[target], 0), dtype=np.bool),
                np.ones(np.size(self.values[target], 0), dtype=np.bool)
            )
        )[0]

    def findAll(self, subject: list, target: T, where: dict = {}) -> np.ndarray:
        return self.values[target][self.findIndex(target, where)]\
                          [:, [np.where(self.columns[target] == case)[0][0] for case in (subject if subject else self.columns[target])]]
    
    def findOne(self, subject: list, target: T, where: dict = {}) -> object:
        try:
            return self.findAll(subject, target, where)[0]
        except:
            return None
    
    @Permission.require(Permission.Admin)
    def commit_admin(self):
        for t, file in self.__files.items():
            pd.DataFrame(self.values[t], columns=self.columns[t]).to_csv(file, index=False)
    
    @Permission.require(Permission.Student)
    def commit_student(self):
        pass
    
    def commit(self):
        return {
            Permission.Admin: self.commit_admin,
            Permission.Student: self.commit_student,
        }[self.__session.permission]()
    
    # target function
    @property
    def emailFrequency(self):
        local, domain = zip(*map(lambda x: x.split('@'), self.findAll(['email'], T.contacts).squeeze()))
        count = Counter(domain)
        return pd.DataFrame([count.keys(), count.values()]).values.T
    
    def __str__(self):
        pass
