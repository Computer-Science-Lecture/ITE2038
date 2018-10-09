# deliveryHY

Assignment1 @ ITE2038

ER Modeling on the given environments.

## Submission

- `deliveryHY.md` Document of assignment
- `deliveryHY.ndm` navicat model file
- `deliveryHY.png` capture image of designed model
- `deliveryHY.sql` schema of designed model

## Documentation

There is nothing special about the task of implementing a given environment.

Below are real models in a given environment.

- ***Seller*** 
    - *name*
    - *location* as `point`
    - *address* divided into `city`, `county`, `district`
    - *service* mean type of business
    - *createdAt* mean opened date
    - *business_day*
    - *business_hour*
- ***Service***
    - *name*
    - *price*
    - *events* keep event informations
- ***Owner***
    - *login_id*
    - *login_pw*
    - *email*
- ***Buyer***
    - *login_id*
    - *login_pw*
    - *email*
- ***Agency***
    - *login_id*
    - *login_pw*
    - *email*
    - *location* as `point`
    - *updatedAt* as `timestamp` keep last location update time
    - *activity_location* as `varchar` keep korean-style postal address
    - *status* as `bool`
    - *queue* as `int` keep remain delivery
    - *fee*
- ***Order***
    - *expected_time*
    - *createdAt*
    - *count*

And follows are tables for relational attributes.

- ***Contact***
    - *number*
    - *carrier* as `varcahr` keep carrier of number
- ***Payment***
    - *type* as `varchar` keep type of payment
    - *number* as `varchar` keep data for payment
- ***Destination***
    - *location* as `point`
    - *lastUsed* as `timestamp` keep last used time
    - *primary* as `bool` mean preferred

Finally, the following are realtion.

- ***Owner*** has many ***Seller***s.
- ***Seller*** has many ***Contract***s.
- ***Seller*** has many ***Service***s.
- ***Service*** belongs to ***Seller***.
- ***Buyer*** has one ***Contract***.
- ***Buyer*** has many ***Payment***s.
- ***Buyer*** has many ***Destination***s.
- ***Agency*** has many ***Contract***s.
- ***Order*** belongs to ***Service***, ***Buyer***, ***Agency***.
