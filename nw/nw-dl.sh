#!/bin/bash


# Prebuilt binaries
linux64="https://s3.amazonaws.com/node-webkit/v0.9.2/node-webkit-v0.9.2-linux-x64.tar.gz"
linux32="https://s3.amazonaws.com/node-webkit/v0.9.2/node-webkit-v0.9.2-linux-ia32.tar.gz"
windows="https://s3.amazonaws.com/node-webkit/v0.9.2/node-webkit-v0.9.2-win-ia32.zip"
osx="https://s3.amazonaws.com/node-webkit/v0.9.2/node-webkit-v0.9.2-osx-ia32.zip"

function dl {
	dl_platform=$1
	dl_url=${!1}
	dl_filename=$(basename "$dl_url")

	echo "Downloading $dl_platform ..."
	curl $dl_url -o /tmp/$dl_filename

	echo "Extracting ..."
	rm -rf ./$dl_platform
	mkdir -p ./$dl_platform

	if [[ $dl_filename =~ "tar.gz" ]]; then
		dl_internal_dirname=`tar -ztf "/tmp/$dl_filename" | head -n 1`
		tar -zvxf /tmp/$dl_filename -C ./$dl_platform/
		mv ./$dl_platform/*/* ./$dl_platform
		rmdir ./$dl_platform/$dl_internal_dirname/
	else
		unzip /tmp/$dl_filename -d ./$dl_platform/
	fi

	rm -f /tmp/$dl_filename
}

if [ $# -eq 0 ]; then
	dl linux64
	dl linux32
	dl windows
	dl osx
else
	dl $1
fi