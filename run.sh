#!/bin/bash

export JAVA_HOME=/Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

pip install psycopg2

sudo apt install postgresql python-psycopg2
