tar --exclude=".DS_Store" \
    --exclude="._.DS_Store" \
    --exclude="__MACOSX" \
    --exclude="*/.DS_Store" \
    --exclude="*/._*" \
    --exclude=".git" \
    --exclude=".idza" \
    --exclude=".env*" \
    -czvf ../video.tar.gz \
    .