#!/bin/sh
cmd=$1;
if [[ $cmd = 'sync' ]];then
	scp index.js devServer.js sync.sh ${USER}@47.104.20.128:/home/q/dc
	ssh ${USER}@47.104.20.128 "sh /home/q/dc/sync.sh reload"
fi

if [[ $cmd = 'reload' ]];then
	cd /home/q/dc;
	pm2 stop index.js;
	pm2 start index.js;
fi