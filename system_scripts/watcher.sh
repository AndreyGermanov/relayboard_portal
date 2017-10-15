#!/bin/bash
v=`ps -ef | grep 'main.js' | grep -v 'grep main.js' | wc -l`
if [ $v -lt 1 ]
then
    /opt/relayboard_portal/run &
fi