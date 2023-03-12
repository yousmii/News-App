# Frontend setup guide

## First time setup

### Installing node.js

1. Install curl

```bash
sudo apt-get install curl
```

2. Add the PPA (current latest version)

```bash
curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - &&\
```

3. Install node.js

```bash
sudo apt-get install nodejs
```

### Installing yarn (dependency manager)

This part is the easiest, you just install it with this easy command!

```bash
npm install --global yarn
```

### Installing the dependencies for the frontend

Now it is important that you are in the directory of the project. **Be sure that this is the case, else this command does not work!**

```bash
yarn
```

... yes, it's that simple

### Running the frontend

Now with everything in place, we just need to startup the project, which is also quite easy :)

```bash
yarn start
```