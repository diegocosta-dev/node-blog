# node-blog
 This is a blog builded with nodejs, express and mongodb

### Install node_modules
 npm install

### Run blog
 npm start

### Run in dev mode
 npm run dev

### set user admin

```
db.users.update({ _id: ObjectId("5f833ff70d66a73e81c31a35") }, { $set: { isAdmin: 1 } })
```

### using docker-compose

```
docker-compose up -d
docker exec -it node-blog_mongo_1 mongo
```