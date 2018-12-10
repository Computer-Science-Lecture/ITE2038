# DBMS

Assignment2 @ ITE2038

ER Modeling on the given environments.

## 2-1

- File System Version as `main.py` python script
- DBMS Version as `dbms.sql`

**In File System mode**, see `lib/manager.py`.
*create*, *remove*, *update*, *findIndex*, *findAll*, *findOne* works like ORM frameworks.
So, you can write query to execute insert, update, remove as below!

```
SELECT [ATTRIBUTE] FROM [TABLE] WHERE [COND, (only support equal)]
UPDATE [TABLE] SET [ATTRIBUTE=value,] WHERE [COND, (only support equal)]
DELETE FROM [TABLE] WHERE [COND, (only support equal)]
COMMIT
```

And examples

```
>> SELECT sname, sex FROM STUDENTS WHERE sname=홍길동
>> COMMIT
```

It is built using *numpy* indexing and reads csv with multiple options via *pandas*.
So you need to install the two using pip before using.


**In DBMS Mode**, I wrote just sql query, see `dbms.sql`

## 2-2

See `sql.sql` There is solutions for given five problems.

