module.exports = function (controller) {
     
    // Show the api of @MeNext
    controller.hears(

      ['help', 'help (.*)', '(.*) help (.*)'], 

      'direct_message,direct_mention,mention', 

      help

    );

    /** 
	// Bring up when SEMRush is mentioned
    controller.hears(

      ['on semrush', 'on semrush (.*)', '(.*) on semrush (.*)','using semrush', 'using semrush (.*)', '(.*) using semrush (.*)','to semrush', 'to semrush (.*)', '(.*) to semrush (.*)'], 

      'direct_message,direct_mention,mention', 

      semrush

    );
*/  	
	// Bring up when SEMRush is mentioned

	controller.hears(
		['on semrush', 'on semrush (.*)', '(.*) on semrush (.*)','using semrush', 'using semrush (.*)', '(.*) using semrush (.*)','to semrush', 'to semrush (.*)', '(.*) to semrush (.*)'],
['direct_message','direct_mention','mention'],

function(bot,message) {

  bot.reply(message,''Hello '+ '<@'+ message.user +'>! Are you looking to get in line for SEMRush? Try asking me for help!');

});

    // Show users in the queue
    controller.hears(
      
      ['queue','queue (.*)','(.*) queue (.*)'], 
      
      'direct_message,direct_mention,mention', 
      
      queue

    );

    // Add user to the queue
    controller.hears(
      
      ['add','add (.*)', '(.*) add (.*)','addme','addme (.*)', '(.*) addme (.*)', 'add me','add me(.*)', '(.*) add me(.*)'],
      
      'direct_message,direct_mention,mention', 
      
      addme

    );

    // Delete user in the queue
    controller.hears(
      
      ['del', 'del (.*)', '(.*) del (.*)','done', 'done (.*)', '(.*) done (.*)'],
      
      'direct_message,direct_mention,mention', 
      
      del
      
    );

    // Delete all users in the queue
    controller.hears(
      
      ['clean','clean (.*)','(.*) clean (.*)','clear','clear (.*)','(.*) clear (.*)'],
      
      'direct_message,direct_mention,mention', 
      
      clear
      
    );

    /** Callbacks for hears */    

    function help(bot, message) {
       
      const help = 'Hello '+ '<@'+ message.user +'>! These are the commands you can use with me: ' +'\n' + 
            '> `add me`  : Add a user to the queue\n' +
            '> `queue` : Show the queue\n' +
            '> `done`  : Delete user of the queue\n' + 
            '> `clear`: Delete all users in the queue\n' +
            '> `help` : Show the commands you can use with MeNext\n' + 
            'Name me with any of this commands. Ex: Hey `@MeNext` show me the `queue`.'; 

       bot.reply(message, help);

    }

/**
    function semrush(bot, message) {
       
      const semrush = 'Hello '+ '<@'+ message.user +'>! Are you looking to get in line for SEMRush? These are the commands you can use: ' +'\n' + 
            '> `add me`  : Add a user to the queue\n' +
            '> `queue` : Show the queue\n' +
            '> `done`  : Delete user of the queue\n' + 
            '> `clear`: Delete all users in the queue\n' +
            '> `help` : Show the commands you can use with MeNext\n' + 
            'Name me with any of this commands. Ex: Hey `@MeNext` show me the `queue`.'; 

       bot.reply(message, semrush);

    }
*/  
    function queue(bot, message) {

        // load user from storage...
        controller.storage.teams.get('queue', function(err, queue) { 
            
            if (!queue || !queue.users || queue.users.length == 0) {
                bot.reply(message, "There is no one in the queue at the moment, name me and add the command `add` to add you.");                
            } else {
                bot.reply(message, generateQueueList(queue.users));
            }

        });

    }

    function add(bot, message) {

        controller.storage.teams.get('queue', function(err, queue) {
            if(err){
                return throwError(err);
            }

            if (!queue || !queue.users) {
                queue = {
                    'id': 'queue',
                    'users': []
                };                
            }
            
            var user = findUser(queue.users,message.user);
                                     
            if(user){                
                bot.reply(message, "<"+ user.name +">, You are in the queue already. When it's your turn, I'll let you know.");
                bot.reply(message, generateQueueList(queue.users));
            } else {
                
                userInfo(bot.api, message.user, function (err, user) {
                    
                    queue.users.push({
                        id: message.user,
                        name: '@' + user.name
                    });

                    controller.storage.teams.save(queue, function(err,saved) {
                        if (err) {
                            bot.reply(message, 'I experienced an error adding your task: ' + err);
                        } else {
                            
                            bot.api.reactions.add({
                                name: 'thumbsup',
                                channel: message.channel,
                                timestamp: message.ts
                            });

                            bot.reply(message, generateQueueList(queue.users));
                        }
                    });
                });
            }            
        });
    }
  
    function del(bot, message) {
        
        controller.storage.teams.get('queue', function(err, queue) {
            if(err){
                return throwError(err);
            }
            
            if (!queue || !queue.users || queue.users.length == 0 || findUser(queue.users,message.user) === undefined) {
                bot.reply(message, "The queue doesn't exist or you aren't in it\n" +
                                   "You can see the who is in the queue by naming me and using the command `queue`");                
            } else {
                                     
                queue.users = queue.users.filter(function(user){
                    return (user.id != message.user);
                });
                     
                controller.storage.teams.save(queue, function(err,saved) {
                    if (err) {
                        bot.reply(message, 'I experienced an error adding your task: ' + err);
                    } else {
                        bot.api.reactions.add({
                            name: 'thumbsup',
                            channel: message.channel,
                            timestamp: message.ts
                        });

                        if(queue.users && queue.users.length > 0){

                            bot.reply(message, '<'+ queue.users[0].name +'> it`s your turn! When you finish, you should delete you from the queue. Name me and add the command `del`. Thank you.');
                        }
                    }
                });                
            }                        
        });

    }

    function clean(bot, message) {
        
        controller.storage.teams.get('queue', function(err, queue) {
            if(err){
                return throwError(err);
            }
            
            if (!queue || !queue.users || queue.users.length == 0) {
                bot.reply(message, 'There is no one in the queue at the moment. Go for it!');                
            } else {                
                queue.users = [];                                          
                controller.storage.teams.save(queue, function(err,saved) {
                    if (err) {
                        bot.reply(message, 'I experienced an error adding your task: ' + err);
                    } else {
                        bot.api.reactions.add({
                            name: 'thumbsup',
                            channel: message.channel,
                            timestamp: message.ts
                        });
                    }
                });                
            }                        
        });

    }
    

    /** Utils */

    // (Async) get info user by id
    function userInfo(api, id, next){
        api.users.info({
           user: id
        }, function (err, res) {
            next(err, res.user);
        });
    }

    // Generate list of users
    function generateQueueList(users) {
        
        var text = 'This is the current queue: \n';

        users.forEach(function(user, i){                
            text = text + '> `' +  (i + 1) + 'º` ' +  user.name + '\n';            
        });

        return text;
    }

    // Find user by id
    function findUser(users, id){
        
        return users.find(function(user, i){ return (user.id === id);});                
    }

};