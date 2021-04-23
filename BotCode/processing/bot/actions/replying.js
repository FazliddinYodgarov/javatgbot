const path = require('path');

/**@param {*} ctx 
 * @param {Text} text 
 * @param {Object} option 
 * @param {Boolean} notify 
 */
function BotReply(ctx, text, option = {}, notify = false) {
   option.disable_notification = !notify;
   return ctx.replyWithHTML(text, option);
}

/**@param {*} bot 
 * @param {Number} chatID 
 * @param {String} text 
 * @param {Object} option 
 * @param {Boolean} notify 
 */
function BotSendMessage(bot, chatID, text, option = {}, notify = false) {
   option.disable_notification = !notify;
   return bot.telegram.sendMessage(chatID, text, option);
}

/**
 * 
 * @param {*} bot 
 * @param {Number} chatID 
 * @param {String} caption 
 * @param {Number} file_id 
 * @param {Object} option 
 * @param {Boolean} notify 
 */
async function BotSendAttachment(bot, chatID, caption, file_id, option = {}, notify = false) {
   option.disable_notification = !notify;
   let file_info = await bot.telegram.getFile(file_id);
   let file_path = path.parse(file_info.file_path);
   if (file_path.dir == 'photos') {
      return bot.telegram.sendPhoto(chatID, file_id, {
         caption,
         ...option
      });
   } else if (file_path.dir == 'videos') {
      return bot.telegram.sendVideo(chatID, file_id, {
         caption,
         ...option
      });
   } else {
      return bot.telegram.sendDocument(chatID, file_id, {
         caption,
         ...option
      });
   }
}

/**
 * @param {*} ctx 
 * @param {Array.<String>} replies 
 * @param {Array.<Object>} options 
 * @returns {Array.<Object>}
 */
 async function BotReplyMultipleMessages(ctx, replies, options) {
   let results = [];
   if (typeof (options) == 'undefined') {
      options = [];
   }
   
   try {
      for (const i in replies) {
         let reply = replies[i];
         let option = options[i] || {};
         results.push(await BotReply(ctx, reply, option));
      }
   } catch (e) {
      console.log(e);
   }
   return results;
}

module.exports = {
   BotReply,
   BotSendMessage,
   BotSendAttachment,
   BotReplyMultipleMessages
};