#!/bin/bash

echo What shail be the name of the commitment?
read commName
git add --all
git commit -m \"$commName\"
git push -u origin master
