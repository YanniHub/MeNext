# MeNext

a Slack bot to manage a queue of slack users in a channel.

## Why?

Sometimes it's necesary to create a queue for differents things in the day-to-day.

## How?

MeNext expose a API with main functionalities of a queue. You only need to mention him with some of next commands:

* `add`   >   Add a user to the queue
* `del`   >   Delete user of the queue
* `show`  >   Show the queue 
* `clean` >   Delete all users in the queue 
* `help`  >   Show the MeNextAPI avalaible 

## Example

![MeNext messages](/MeNextmessages.PNG)

## Install

Clone this repository:

`git clone https://github.com/andyindahouse/MeNext.git`

Install dependencies, including [Botkit](https://github.com/howdyai/botkit):

```
cd MeNext
npm install
```

Get a Slack bot token [from your Slack team](https://my.slack.com/apps/new/A0F7YS25R-bots)

Run your bot from the command line with your new tokens:

`token=<slack token> node .`

Invite @MeNext to your slack-channel 

(in Slack channel) `/invite @MeNext`

## More info

This bot was build with [Botkit Studio Starter Kit](https://github.com/howdyai/botkit-studio-starter) 


