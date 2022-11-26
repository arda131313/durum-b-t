const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
const Gamedig = require('gamedig');

bot.on('ready', () => {
  console.log("Bot Aktif.")
  var interval = setInterval(function () {
    let guild = bot.guilds.cache.get(config.discord);
    let channel = guild.channels.cache.get(config.channel);
    Gamedig.query({
      type: 'csgo',
      host: config.ipabs, 
      port: config.port 
    }).then((state) => {
      bot.user.setActivity(`👥 ${state.players.length}/${state.maxplayers} 🗺️ ${state.map}`, {type: "PLAYING"});
    }).catch((error) => {
      console.log(error);
    });
  }, 1000);
});

bot.on('message', (message) => {

  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "gt") {
    Gamedig.query({
      type: 'csgo',
      host: config.ipabs,
      port: config.port 
    }).then((state) => {
      let n = Date.now();
      let sunucu = "https://cache.gametracker.com/server_info/185.193.165.165.71:27015/b_560_95_1.png?" + n.toString(); // IP DEĞİŞECEK
      let gt = new Discord.MessageEmbed()
      .setTitle(`${state.name}`)
      .setColor('BLACK')
      .setImage(sunucu);
      message.channel.send(gt)
    }).catch((error) => {
      message.channel.send(`Sunucu aktif değil.`);
    });
  }

  if (command === "ip") {
    Gamedig.query({
      type: 'csgo',
      host: config.ipabs,
      port: config.port 
    }).then((state) => {
      let ip = new Discord.MessageEmbed()
        .setTitle(`${state.name}`)
        .addField('**🗺️ | Harita**', state.map, true)
        .addField('👥 | Oyuncu Sayısı\n', `${state.players.length}/${state.maxplayers}`, true)
        .addField('🔗 Sunucu adresi | Tıkla bağlan', `185.193.165.71:27015 **-** steam://connect/185.193.165.71`)
        .setColor('BLACK')
      message.channel.send(ip)
    }).catch((error) => {
      message.channel.send(`Sunucu aktif değil.`);
    });
  }    
})


bot.login(config.token);