// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
// const {
//   DynamoDBDocumentClient,
//   GetCommand,
//   PutCommand,
// } = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");
// const axios = require("axios");

const axios = require('./middleware/index');

const app = express();

// const USERS_TABLE = process.env.USERS_TABLE;
// const client = new DynamoDBClient();
// const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

// app.get("/users/:userId", async function (req, res) {
//   const params = {
//     TableName: USERS_TABLE,
//     Key: {
//       userId: req.params.userId,
//     },
//   };

//   try {
//     const { Item } = await dynamoDbClient.send(new GetCommand(params));
//     if (Item) {
//       const { userId, name } = Item;
//       res.json({ userId, name });
//     } else {
//       res
//         .status(404)
//         .json({ error: 'Could not find user with provided "userId"' });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Could not retreive user" });
//   }
// });

// app.post("/users", async function (req, res) {
//   const { userId, name } = req.body;
//   if (typeof userId !== "string") {
//     res.status(400).json({ error: '"userId" must be a string' });
//   } else if (typeof name !== "string") {
//     res.status(400).json({ error: '"name" must be a string' });
//   }

//   const params = {
//     TableName: USERS_TABLE,
//     Item: {
//       userId: userId,
//       name: name,
//     },
//   };

//   try {
//     await dynamoDbClient.send(new PutCommand(params));
//     res.json({ userId, name });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Could not create user" });
//   }
// });

app.get("/hello", function (req, res) {
  res.json({ success: true, message: "hello datga" });
});

app.post("/token", async function (req, res) {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: req.body.grant_type,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret
      },
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    const { data } = response;
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not get token" });
  }
});

app.get("/playlists/:playlistId", async function (req, res) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${req.params.playlistId}`, {
      headers: {
        "Authorization": req.headers.authorization
      }
    });
    const { data } = response;
    const formatData = data?.tracks?.items.map(item => ({
      name: item.track.name,
      artist: item.track.artists[0].name,
      image: item.track.album.images[0].url
    }))
    res.json(formatData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not get token" });
  }
});

app.get("/tracks/:trackId", async function (req, res) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${req.params.trackId}`, {
      headers: {
        "Authorization": req.headers.authorization
      }
    });
    const { data } = response;
    const formatData = {
      id: data.id,
      name: data.name,
      artist: data.artists[0].name,
      image: data.album.images[0].url,
      preview_url: data.preview_url
    }
    res.json(formatData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not get token" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports.handler = serverless(app);
