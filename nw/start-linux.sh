#!/bin/bash

ARCH=`uname -m`

if [ "$ARCH" == "x86_64" ]; then
	NW="64"
else
	NW="32"
fi

# nohup "./linux$NW/nw" app.nw 2>&1 > /dev/null &
./linux$NW/nw app.nw