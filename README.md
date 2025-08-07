# 🎵 Music Streamer App
**Music Streamer App** is a full-stack web application built with NestJS, TypeScript, and React. It’s designed for music enthusiasts to create, share, and discover tracks within a vibrant community of like-minded users. 
This app is inspired by the official Spotify app and replicates some of its core funtionalities and design. It's build with a passion for learning and showcases a hands-on approach to mastering modern web development technologies.

## ✨ Features
 🎵 Upload and stream songs.

 🎵 Create your own albums.

 🎵 Audio player with play, pause, next, previous functionalities.

 🎵 Share your thoughts with comments for users songs in realtime.

 🎵 Drop a like on your favourite songs.

 🎵 Live feed of newly uploaded songs.

## 🛠 Technologies Used
 ⚡**MongoDB** : As the main database of the app. 
  
   - Mongoose : Used as an object modeling tool (ODM)
   - [GridFS](https://www.mongodb.com/docs/manual/core/gridfs/) : For storing large music files into parts, or chunks, with efficiency.

 ⚡**NestJS** : For building the backend API.

 ⚡**React+Vite** : For building the user interface.

   - Zustand : A light state-management solution for React.

 ⚡**Shadcn** : Library containing nice looking, customizable and reusable components for React.

 ⚡**Tailwind CSS** : For styling the components of the website.

 ⚡**JWT Authentication**: Authentication for users login.

 ⚡**Socket.IO** For realtime receiving and sending data.


## 📸 Screenshoots

## 🚀 Getting Started


### Env variables (.env.sample)
- There are 2 files that contain an example of an .env file setup, in the backend and frontend directory.

-  The **.env.sample** file has the enviroment variables needed for the backend app frontend and mongodb database set up.

- Follow the instructions inside **.env.sample** to create a .env file in each directory for development or production.

### Run project locally (Dev)

> [!NOTE]
> **Docker** should be installed in order to host locally the mongodb.
>
> **NodeJS** should be installed. 

To run this project locally lets go throught the following steps:

1. Firstly clone this repository:

```bash
clone <add-your-git-repo>
```

2. Navigate to the project directory and optionally have 2 terminal windows open so that you can have the backend directory in the first one and the frontend directory in the second one.
```bash
cd backend

cd frontend
```

3. Make sure both directories have a **.env** file created with the **development** setup.

4. In the backend terminal run the following command in order to pull a mongodb image and host the database locally.

```bash
# \backend
docker-compose -f docker-compose.mongo.yaml up -d
```

5. When the db container is up and running, install depedencies and run the app

```bash
# \backend 
npm install
npm run start
```
```bash
# \frontend 
npm install
npm run dev
```

### Setup with docker (Running app in production)

> [!NOTE]
> Make sure you have **Docker** installed 

1. Make sure that backend and frontend directories have .env files with the **Production** setup

2. In the root directory run the following command to build the full-stack app with Docker Compose. This command will build and run the NestJS app, build the React app and serve it with Nginx host a MongoDB database and manage all network connections.

```bash
docker-compose up --build 
```

## 💡Future Improvements
<table>
<tr>
<th >Layers</th>
<th>Things to improve</th>
</tr>
<tr>
<td width="30%">
Backend
</td>
<td width="70%">

- Update the help libraries used for GridFS, or make custom code to implement all functionalities from mongoose, using latest mongodb and mongoose modules. As a last solution move to cloud file storage.
- Improve JWT authentication by using cookies.
</td>
</tr>
<td width="30%">
Frontend
</td>
<td width="70%">

- UI improvements and mobile responsiveness
- Add image upload for albums or songs.
- Fix ui bugs
</td>
</tr>
</table>
