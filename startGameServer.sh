#!/bin/bash

GAME_ID=$1
PORT=$2
GAMESERVER_PORT=$3
SERVER_MAP=$4
AUTH_CODE=$5
SERVERNAME=$6
SERVER_ID=$7
cd servers/"$GAME_ID"-"$PORT" || exit

exec > startLog.out 2>&1

echo "Starting Server System"

# Update UFW rules
echo "Updating UFW rules..."
sudo ufw allow "$PORT"/tcp
sudo ufw allow "$GAMESERVER_PORT"/udp
echo "UFW rules updated."

sudo chmod +x startGameServer.sh

npm install

pm2 start index.js --name "$PORT" -- "$PORT" "$GAMESERVER_PORT" "$GAME_ID" "$SERVER_MAP" "$AUTH_CODE" "$SERVERNAME" "$SERVER_ID"

echo "Server is ready and running."
