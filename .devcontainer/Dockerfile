FROM alpine

ARG USERNAME=alpineuser
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN addgroup -g $USER_GID $USERNAME \
    && adduser -u $USER_UID -G $USERNAME $USERNAME -D

WORKDIR /usr/src/

RUN chown $USER_UID:$USER_UID .

RUN apk add \
    python3 \
    nodejs \
    npm \
    poetry \
    git \
    alpine-sdk \
    tzdata \
    openssh \
    redis \
    chromium-chromedriver

USER $USERNAME

EXPOSE 8000

CMD [ 'redis-server' ]