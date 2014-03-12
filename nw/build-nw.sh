#!/bin/bash
rm app.nw
cd ../
zip -r -u --exclude="*node_module*" --exclude="*.git*" --exclude="*nw*" --exclude="*scss*" nw/app.nw *
cd nw