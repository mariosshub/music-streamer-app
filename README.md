# 🎧  Music Streamer App
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
 📙**MongoDB** : As the main database of the app. 
  
   - Mongoose : Used as an object modeling tool (ODM)
   - [GridFS](https://www.mongodb.com/docs/manual/core/gridfs/) : For storing large music files into parts, or chunks, with efficiency.

 😼[NestJS](https://nestjs.com/) : For building the backend API.

 ⚡**React+Vite** : For building the user interface.

   - Zustand : A light state-management solution for React.

 📚**Shadcn** : Library containing nice looking, customizable and reusable components for React.

 📱**Tailwind CSS** : For styling the components of the website.

 🔒**JWT Authentication**: Authentication for users login.

 📨**Socket.IO** For realtime receiving and sending data.


## 📸 Screenshoots
<div align="center">
    <table border >
     <tr>
       <td align="center">
         <img height="268" width="373" src="https://github.com/user-attachments/assets/0fed6ec4-97f6-481a-9702-08197fbfb366" />
         <img height="268" width="373" src="https://github.com/user-attachments/assets/de5ec1bd-da1e-42c7-b9f1-265ce06afa23"/>
       </td> 
     </tr>
     <tr>
      <td align="center">
       <img height="268" width="373" src="https://github.com/user-attachments/assets/10663b6b-1c9d-43af-8d31-bb4af13f327f"/>
       <img height="268" width="373" src="https://github.com/user-attachments/assets/ec8f06de-374f-4d14-a4b4-b51fa9cc8502"/>
      </td>
     </tr>
     <tr>
      <td align="center">
       <img height="268" width="373" src="https://github.com/user-attachments/assets/70bfc56c-3886-4fb4-84b3-6f040c63d875"/>
       <img height="268" width="373" src="https://github.com/user-attachments/assets/baddd91b-85ec-447c-8ed1-23c0a8dee778"/>
      </td>
     </tr>
    </table>
</div>



## 🚀 Getting Started


### Env variables (.env.sample)
- There are 2 files **.env.sample** in each directory backend and frontend, that contain a sample of the environment variables needed for the set up.
- Follow the instructions inside **.env.sample** to create a .env file in each directory for development or production.

### Run project locally (Dev)

> [!NOTE]
> **Docker** should be installed in order to host locally the mongodb and **NodeJS** for building and running the app.

To run this project locally lets go throught the following steps:

1. First clone this repository:

```bash
clone <add-your-git-repo>
```

2. Navigate to the project directory and optionally have 2 terminal windows open, so that you can operate the backend directory and the frontend directory simultaneously.
```bash
cd backend

cd frontend
```

3. Make sure both directories have a **.env** file created with the **development** setup.

4. In the backend terminal window run the following command in order to pull a mongodb and mongo-express images, create container and host the database locally.

```bash
# \backend
docker-compose -f docker-compose.mongo.yaml up -d
```

5. Make sure container is up and running, install npm depedencies and run the app.

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
> Make sure you have **Docker** installed.

1. Make sure that backend and frontend directories have .env files with the **Production** setup

2. In the root directory run the following command to build the full-stack app with Docker Compose.
   
   The following command will
    - build and run the NestJS app,
    - build the React app and serve it with Nginx,
    - host a MongoDB database,
    - manage all network connections.

```bash
docker-compose up --build 
```

## 💡Future Improvements
<table>
<tr>
<th>Layers</th>
<th>Things to improve</th>
</tr>
<tr>
<td width="30%">
Backend
</td>
<td width="70%">
 
- [ ] Update the packages used for GridFS (legacy code), or make custom code to implement all functionalities from mongoose, using latest mongodb and mongoose modules.
- [ ] Maybe move to cloud file storage (Cloudinary).
- [ ] Improve JWT authentication by using cookies.
</td>
</tr>
<td width="30%">
Frontend
</td>
<td width="70%">
 
- [ ] UI improvements and mobile responsiveness.
- [ ] Add image upload for albums or songs.
- [ ] Fix UI and other bugs.
</td>
</tr>
</table>
