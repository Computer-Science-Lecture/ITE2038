class Manager:
    converter = {t: lambda x: x.strip() for t in T}
    
    def __init__(self, files):
        if not all(t in files for t in T):
            raise "Must include all files"
        self.frames = {file: pd.read_csv(filename, dtype=object, sep=" *, *", encoding="UTF-8") for file, filename in files.items()}
        self.columns = {file: frame.columns.values for file, frame in self.frames.items()}
        self.values = {file: frame.values for file, frame in self.frames.items()}
        self.session = None
    
    def login(self, user, pw):
        if user == 'admin':
            self.session = Session(user, Permission.Admin)
        else:
            password = self.findOne(['password'], T.students, {'sid': sid})
            if password and password[0] == pw:
                self.session = Session(user, Permission.Student)
            else:
                raise Exception('Invalid ID or Password')
        
    @Permission.require(Permission.Admin)
    def create(self, target: T, values = np.ndarray):
        self.values[target] = np.vstack([self.values[target], np.array(values)])
    
    @Permission.require(Permission.Admin)
    def remove(self, target: T, where: dict = {}):
        self.values[target] = np.delete(self.values[target], self.findIndex(target, where), 0)
    
    @Permission.require(Permission.Admin)
    def update(self, target: T, where: dict = {}, values = np.ndarray):
        for key, value in values.items():
            self.values[target][self.findIndex(target, where), np.where(self.columns[target] == key)[0][0]] = value

    def findIndex(self, target: T, where: dict = {}) -> np.ndarray:
        return np.where(
            np.logical_and(
                *[self.values[target][:,column] == value for column, value in zip(
                    [np.where(self.columns[target] == case)[0][0] for case in where],
                    where.values()
                )],
                np.ones(np.size(db.values[target], 0), dtype=np.bool),
                np.ones(np.size(db.values[target], 0), dtype=np.bool)
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
    
    def __str__(self):
        pass
