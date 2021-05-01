# dgorm-js
Modified DGraph ORM for Javascript with GraphQL support.

## Installation

```
npm install dgraph-orm
```

## Full Documentation

coming soon.

## Your first schema and model

```javascript
import dgorm from 'dgorm-js';

const UserSchema = new dgorm.Schema('user', {
  name: {
    type: dgorm.Types.STRING,
    index: true,
    token: {
      term: true
    }
  },
  email: {
    type: dgorm.Types.STRING,
    index: true,
    unique: true,
    token: {
      exact: true
    }
  },
  password: dgorm.Types.PASSWORD,
  bio: dgorm.Types.STRING,
  friend: {
    type: dgorm.Types.UID,
    model: 'user', // related model name
    count: true,
    reverse: true
  }
});

/**
 * Set and create model out of the schema
 */
const User = dgorm.model(UserSchema);

/**
 * Creates a new user with passed fields
 *
 * Returns the created user along with the generated uid
 */
const user = await User.create({
  name: 'George Patterson',
  email: 'george@mosaics.ai',
  bio: 'Bio ...'
});

console.log(user);
// {
//    uid: '0x1',
//    name: 'George Patterson',
//    email: 'george@mosaics.ai',
//    bio: 'Bio ...'
// }
```

For the full documentation please visit the below link

coming soon.