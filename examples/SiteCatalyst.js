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
 * Adobe SiteCatalyst examples
 * Philip Lawrence | http://www.acronym
 */ 
(function(window) {
    // Verify we the SiteCatalyst object has loaded
    if(typeof window.s != 'object')
        return;
    
    var s = window.s;
    
    YouTubeEvents.bind('load', function(data) {
        s.Media.open(data.video.title, data.video.duration, 'YouTube');
    });
    YouTubeEvents.bind('play', function(data) {
        s.Media.play(data.video.title, data.video.currentTime);
    });
    YouTubeEvents.bind('pause', function(data) {
        s.Media.stop(data.video.title, data.video.currentTime);
    });
    YouTubeEvents.bind('complete', function(data) {
        s.Media.close(data.video.title);
    });
    
})(window || {});