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
 * Google Analytics (ga.js) examples
 * Philip Lawrence | http://www.acronym
 */ 
(function(window) {
    _gaq = window._gaq || [];

    // Load event
    YouTubeEvents.bind('load', function(data) {
        _gaq.push(['_trackEvent', 'video', 'load', data.video.title]);
    });
    
    // Initial play (gets fired along side the play event)
    YouTubeEvents.bind('initial', function(data) {
        _gaq.push(['_trackEvent', 'video', 'first play', data.video.title]);
    });
    
    // Replay (gets fired along side the play event), with percentage viewed as the value
    YouTubeEvents.bind('replay', function(data) {
        var percentage = Math.ceil((data.video.currentTime / data.video.duration) * 100);
        _gaq.push(['_trackEvent', 'video', 'replay', data.video.title, percentage]);
    });
    
    // Play event, with percentage viewed as the value
    YouTubeEvents.bind('play', function(data) {
        var percentage = Math.ceil((data.video.currentTime / data.video.duration) * 100);
        _gaq.push(['_trackEvent', 'video', 'play', data.video.title, percentage]);
    });
    
    // Pause event, with percentage viewed as the value
    YouTubeEvents.bind('pause', function(data) {
        var percentage = Math.ceil((data.video.currentTime / data.video.duration) * 100);
        _gaq.push(['_trackEvent', 'video', 'pause', data.video.title, percentage]);
    });
    
    // Complete Event
    YouTubeEvents.bind('complete', function(data) {
        _gaq.push(['_trackEvent', 'video', 'complete', data.video.title]);
    });
        
    // Milestone event, with percentage viewed as the value
    YouTubeEvents.bind('milestone', function(data) {
        _gaq.push(['_trackEvent', 'video', 'milestone', data.video.title, data.milestone]);
    });
    
    // Cued up in the playlist
    YouTubeEvents.bind('cued', function(data) {
        _gaq.push(['_trackEvent', 'video', 'cued', data.video.title]);
    });
    
    // Buffering event
    YouTubeEvents.bind('buffer', function(data) {
        _gaq.push(['_trackEvent', 'video', 'buffering', data.video.title]);
    });
    
    // Seeked event
    YouTubeEvents.bind('seek', function(data) {
        _gaq.push(['_trackEvent', 'video', 'seeked', data.video.title]);
    });
    
})(window || {});