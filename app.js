const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require('./settings.json');
let channel_log;

function getChannelPath(channel) {
    let path = "";
    if ("parent" in channel && channel.parent) {
        path += channel.parent.name;
    }
    path += "#" + channel.name + "@" + channel.guild.name;
    return path;
}

function getChannelIcon(channel) {
    return channel.guild.iconURL;
}

function isInit() {
    return channel_log;
}

function isUserEquivalent(user1, user2) {
    return user1.id === user2.id;
}

function getRichEmbed(obj) {
    return new Discord.RichEmbed(Object.assign({}, {
        color: 0x31B0D5,
        timestamp: new Date()
    }, obj));
}

// TODO: testing
/*
bot.on("disconnect", () => {
    channel_log = undefined;

    channel_log.send(getRichEmbed({
        title: "Exit",
        footer: {
        icon_url: bot.avatarURL,
        text: bot.username
    }
    })).catch(console.error);
});
*/

bot.on("message", (message) => {
    if(!isInit() || isUserEquivalent(bot.user, message.author)) return;

    let richEmbed = getRichEmbed({
        author: {
            name: getChannelPath(message.channel),
            icon_url: getChannelIcon(message.channel)
        },
        color: 0x218838,
        description: message.cleanContent,
        timestamp: new Date(message.createdAt),
        title: "New message",
        footer: {
            icon_url: message.author.avatarURL,
            text: message.guild.member(message.author).nickname
        }
    });

    message.attachments.forEach(function (attachment) {
        richEmbed.attachFile(attachment.url);
    });

    channel_log.send(richEmbed).catch(console.error);
});

bot.on("messageDelete", (message) => {
    if(!isInit() || isUserEquivalent(bot.user, message.author)) return;

    let richEmbed = getRichEmbed({
        author: {
            name: getChannelPath(message.channel),
            icon_url: getChannelIcon(message.channel)
        },
        color: 0xC9302C,
        description: message.cleanContent,
        timestamp: new Date(message.createdAt),
        title: "Delete message",
        footer: {
            icon_url: message.author.avatarURL,
            text: message.guild.member(message.author).nickname
        }
    });

    message.attachments.forEach(function (attachment) {
        richEmbed.attachFile(attachment.url);
    });

    channel_log.send(richEmbed).catch(console.error);
});

bot.on("messageUpdate", (oldMessage, newMessage) => {
    if(!isInit() || isUserEquivalent(bot.user, oldMessage.author)) return;

    let oldRichEmbed = getRichEmbed({
        author: {
            name: getChannelPath(oldMessage.channel),
            icon_url: getChannelIcon(oldMessage.channel)
        },
        color: 0xEC971F,
        description: oldMessage.cleanContent,
        timestamp: new Date(oldMessage.createdAt),
        title: "Update message",
        footer: {
            icon_url: oldMessage.author.avatarURL,
            text: oldMessage.guild.member(oldMessage.author).nickname
        }
    });

    oldMessage.attachments.forEach(function (attachment) {
        oldRichEmbed.attachFile(attachment.url);
    });

    channel_log.send(oldRichEmbed).catch(console.error);

    let newRichEmbed = getRichEmbed({
        author: {
            name: getChannelPath(newMessage.channel),
            icon_url: getChannelIcon(newMessage.channel)
        },
        color: 0xEC971F,
        description: newMessage.cleanContent,
        timestamp: new Date(newMessage.createdAt),
        title: "Updated message",
        footer: {
            icon_url: newMessage.author.avatarURL,
            text: newMessage.guild.member(newMessage.author).nickname
        }
    });

    newMessage.attachments.forEach(function (attachment) {
        newRichEmbed.attachFile(attachment.url);
    });

    channel_log.send(newRichEmbed).catch(console.error);
});

// TODO: move to join guild
bot.on("ready", () => {
    bot.user.setStatus("invisible").catch(console.error);
    channel_log = bot.channels.find("id", config.channel_log);

    channel_log.send(getRichEmbed({
        title: "Started",
        footer: {
            icon_url: bot.avatarURL,
            text: bot.username
        }
    })).catch(console.error);
});

bot.on("reconnecting", () => {
    bot.user.setStatus("invisible").catch(console.error);
    channel_log = bot.channels.find("id", config.channel_log);

    channel_log.send(getRichEmbed({
        title: "Reconnected",
        footer: {
            icon_url: bot.avatarURL,
            text: bot.username
        }
    })).catch(console.error);
});

bot.login(config.token).catch(console.error);
