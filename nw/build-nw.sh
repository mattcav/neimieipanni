#!/bin/bash
rm app.nw
cd ../
zip -r -u --exclude="*node_module*" --exclude="*.abr"  --exclude="*.psd" --exclude="*tests*" --exclude="*.git*" --exclude="*nw*" --exclude="*scss*" --exclude="*bower_components/[^f]*" nw/app.nw *
cd nw