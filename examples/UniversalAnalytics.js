/***
 *                                        |    |                                 |                  |                         
 * ,---.,---.,---.,---.,---.,   .,-.-.    |    |__/ ,---.,   .. . .,---.,---.,---|---,---..   .,---.|--- ,---.,-.-.,---.,---. 
 * ,---||    |    |   ||   ||   || | |    |    |  \ |---'|   || | ||   ||    |   |---|    |   |`---.|    |   || | ||---'|     
 * `---^`---'`    `---'`   '`---|` ' '    |    `   ``---'`---|`-'-'`---'`    `---'   `---'`---'`---'`---'`---'` ' '`---'`    o
 *                          `---'         |              `---'                                                                
 *                                        |    |                                                                              
 *                                        |    |__/ ,---.,---.. . .    ,   .,---..   .,---.,---.                              
 *                                        |    |  \ |   ||   || | |    |   ||   ||   ||    `---.                              
 *                                        |    `   ``   '`---'`-'-'    `---|`---'`---'`    `---'o                             
 *                                                                     `---'  
 * 
 * YouTube Events
 * Google Analytics (analytics.js) examples
 * Philip Lawrence | http://www.acronym
 */ 
(function(window) {
    _gaq = window._gaq || [];

    // Load event
    YouTubeEvents.bind('load', function(data) {
        ga('send', 'event', {
            eventCategory: 'video',
              eventAction: 'load',
               eventLabel: data.video.title
        });
    });
    
    // Initial play (gets fired along side the play event)
    YouTubeEvents.bind('initial', function(data) {
        ga('send', 'event', {
            eventCategory: 'video',
              eventAction: 'first play',
               eventLabel: data.video.title
        });
    });
    
    // Replay (gets fired along side the play event), with percentage viewed as the value
    YouTubeEvents.bind('replay', function(data) {
        var percentage = Math.ceil((data.video.currentTime / data.video.duration) * 100);
        ga('send', 'event', {
            eventCategory: 'video',
              eventAction: 'replay',
               eventLabel: data.video.title,
               eventValue: percentage
        });
    });
    
    // Play event, with percentage viewed as the value
    YouTubeEvents.bind('play', function(data) {
        var percentage = Math.ceil((data.video.currentTime / data.video.duration) * 100);
        ga('send', 'event', {
            eventCategory: 'video',
              eventAction: 'play',
               eventLabel: data.video.title,
               eventValue: percentage
        });
    });
    
    // Pause event, with percentage viewed as the value
    YouTubeEvents.bind('pause', function(data) {
        var percentage = Math.ceil((data.video.currentTime / data.video.duration) * 100);
        ga('send', 'event', {
            eventCategory: 'video',
              eventAction: 'pause',
               eventLabel: data.video.title,
               eventValue: percentage
        });
    });
    
    // Complete Event
    YouTubeEvents.bind('complete', function(data) {
        ga('send', 'event', {
            eventCategory: 'video',
              eventAction: 'complete',
               eventLabel: data.video.title
        });
    });
        
    // Milestone event, with percentage viewed as the value
    YouTubeEvents.bind('milestone', function(data) {
        ga('send', 'event', {
            eventCategory: 'video',
              eventAction: 'load',
               eventLabel: data.video.title,
               eventValue: data.milestone
        });
    });
    
    // Cued up in the playlist
    YouTubeEvents.bind('cued', function(data) {
        ga('send', 'event', {
            eventCategory: 'video',
              eventAction: 'cued',
               eventLabel: data.video.title
        });
    });
    
    // Buffering event
    YouTubeEvents.bind('buffer', function(data) {
        ga('send', 'event', {
            eventCategory: 'video',
              eventAction: 'buffering',
               eventLabel: data.video.title
        });
    });
    
    // Seeked event
    YouTubeEvents.bind('seek', function(data) {
        ga('send', 'event', {
            eventCategory: 'video',
              eventAction: 'seeked',
               eventLabel: data.video.title
        });
    });
    
})(window || {});